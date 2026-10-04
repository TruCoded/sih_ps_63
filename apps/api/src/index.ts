import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { stationsRouter } from './routes/stations.js';
import { expeditionsRouter } from './routes/expeditions.js';
import { assetsRouter } from './routes/assets.js';
import { ragRouter } from './routes/rag.js';
import { contentDraftsRouter } from './routes/contentDrafts.js';
import { provenanceRouter } from './routes/provenance.js';
import { auditRouter } from './routes/audit.js';
import { educationRouter } from './routes/education.js';
import { ragEngine } from './services/ragEngine.js';
import { llmService } from './services/llmService.js';
import { store } from './services/store.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check — returns only branded capability tiers, no internal provider names
app.get('/api/health', (_req, res) => {
  // Count active tiers WITHOUT exposing provider names to the public
  let activeTiers = 1; // baseline always active
  if (process.env.GROQ_API_KEY) activeTiers++;
  if (process.env.GEMINI_API_KEY) activeTiers++;
  if (process.env.TOGETHER_API_KEY) activeTiers++;
  if (process.env.HUGGINGFACE_API_KEY) activeTiers++;

  res.json({
    status: 'healthy',
    service: 'PolarConnect Knowledge Engine — MoES / NCPOR',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    ai: {
      engine: 'PolarConnect Intelligence Engine',
      mode: 'Grounded RAG with multi-tier fallback',
      activeTiers,
      groundingSource: 'NCPOR / NPDC verified corpus'
    }
  });
});

// =====================================================================
// FIX: Missing Benchmark Route (was causing 404 on frontend)
// Frontend PolarAiAssistant.tsx calls POST /api/benchmarks/run
// =====================================================================
app.post('/api/benchmarks/run', async (req, res) => {
  try {
    const report = await ragEngine.runBenchmarkSuite();
    res.json({ success: true, timestamp: new Date().toISOString(), data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Benchmark suite failed', error: error?.message });
  }
});

// Also keep the original GET endpoint for backward compatibility
app.get('/api/eval/rag-benchmark', async (req, res) => {
  try {
    const report = await ragEngine.runBenchmarkSuite();
    res.json({ success: true, timestamp: new Date().toISOString(), report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Benchmark suite failed', error: error?.message });
  }
});

// =====================================================================
// NEW: AI Semantic Search Route
// POST /api/ai/semantic-search
// =====================================================================
app.post('/api/ai/semantic-search', async (req, res) => {
  const { query, userRole = 'public_visitor' } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ success: false, message: 'query string is required' });
  }

  try {
    const { assets } = store.getAssets({ userRole });
    const result = await llmService.semanticSearchAssets(query, assets, userRole);
    res.json({ success: true, data: result, totalAssets: assets.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Semantic search failed', error: error?.message });
  }
});

// =====================================================================
// NEW: Station AI Condition Brief
// GET /api/stations/:id/ai-brief
// =====================================================================
app.get('/api/stations/:id/ai-brief', async (req, res) => {
  try {
    const station = store.getStationById(req.params.id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }
    const analysis = await llmService.narrateStationConditions(station);
    res.json({ success: true, stationId: req.params.id, data: analysis });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Station AI brief failed', error: error?.message });
  }
});

// =====================================================================
// NEW: Asset Metadata Enrichment
// POST /api/assets/enrich-metadata
// =====================================================================
app.post('/api/assets/enrich-metadata', async (req, res) => {
  const { title, abstract, fileType, expedition } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'title is required' });
  }

  try {
    const enriched = await llmService.enrichAssetMetadata(
      title,
      abstract || '',
      fileType || 'report',
      expedition || 'NCPOR Expedition'
    );
    res.json({ success: true, data: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Metadata enrichment failed', error: error?.message });
  }
});

// =====================================================================
// NEW: Curator AI Metadata Quality Review
// POST /api/assets/:id/ai-review
// =====================================================================
app.post('/api/assets/:id/ai-review', async (req, res) => {
  try {
    const asset = store.getAssetById(req.params.id, 'curator');
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }
    const review = await llmService.reviewMetadataQuality(asset);
    res.json({ success: true, assetId: req.params.id, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'AI review failed', error: error?.message });
  }
});

// =====================================================================
// Mount All Standard Routers
// =====================================================================
app.use('/api/stations', stationsRouter);
app.use('/api/expeditions', expeditionsRouter);
app.use('/api/assets', assetsRouter);
app.use('/api', ragRouter);
app.use('/api/content-drafts', contentDraftsRouter);
app.use('/api/provenance', provenanceRouter);
app.use('/api/audit-events', auditRouter);
app.use('/api/education', educationRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[API Server Error]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`❄️  PolarConnect API Server (Multi-Provider LLM v2.0)`);
  console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
  console.log(`📋 National Centre for Polar and Ocean Research (NCPOR)`);
  console.log(`🤖 LLM Providers: ${[
    process.env.GROQ_API_KEY ? 'Groq' : null,
    process.env.GEMINI_API_KEY ? 'Gemini' : null,
    process.env.TOGETHER_API_KEY ? 'Together' : null,
    process.env.HUGGINGFACE_API_KEY ? 'HuggingFace' : null,
    'Pollinations.ai (free)'
  ].filter(Boolean).join(' → ')}`);
  console.log(`=======================================================`);
});

export default app;
