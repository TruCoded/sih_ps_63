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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'PolarConnect MoES/NCPOR Knowledge Engine with LLM Integration',
    timestamp: new Date().toISOString(),
    version: '1.2.0'
  });
});

// Mount Routes
app.use('/api/stations', stationsRouter);
app.use('/api/expeditions', expeditionsRouter);
app.use('/api/assets', assetsRouter);
app.use('/api', ragRouter);
app.use('/api/content-drafts', contentDraftsRouter);
app.use('/api/provenance', provenanceRouter);
app.use('/api/audit-events', auditRouter);
app.use('/api/education', educationRouter);

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[API Server Error]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`❄️  PolarConnect API Server (LLM Enhanced) on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
    console.log(`📋 National Centre for Polar and Ocean Research (NCPOR)`);
    console.log(`=======================================================`);
  });
}

export default app;
