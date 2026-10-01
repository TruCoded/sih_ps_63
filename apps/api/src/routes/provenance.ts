import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { llmService } from '../services/llmService.js';

export const provenanceRouter = Router();

// GET /api/provenance/:assetId
provenanceRouter.get('/:assetId', (req: Request, res: Response) => {
  const graph = store.getProvenanceGraph(req.params.assetId);
  res.json({
    success: true,
    standard: 'W3C PROV-O (Provenance Ontology)',
    assetId: req.params.assetId,
    graph
  });
});

// GET /api/provenance/:assetId/explain (LLM Provenance Inspector)
provenanceRouter.get('/:assetId/explain', async (req: Request, res: Response) => {
  const graph = store.getProvenanceGraph(req.params.assetId);
  const analysis = await llmService.explainProvenance(req.params.assetId, graph);
  res.json({
    success: true,
    assetId: req.params.assetId,
    analysis
  });
});
