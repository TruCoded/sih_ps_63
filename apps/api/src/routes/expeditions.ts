import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';

export const expeditionsRouter = Router();

// GET /api/expeditions?programme=Antarctica
expeditionsRouter.get('/', (req: Request, res: Response) => {
  const programme = req.query.programme as string | undefined;
  const expeditions = store.getExpeditions(programme);
  res.json({
    success: true,
    total: expeditions.length,
    data: expeditions
  });
});

// GET /api/expeditions/:slug
expeditionsRouter.get('/:slug', (req: Request, res: Response) => {
  const expedition = store.getExpeditionBySlug(req.params.slug);
  if (!expedition) {
    return res.status(404).json({ success: false, message: 'Expedition not found' });
  }
  res.json({
    success: true,
    data: expedition
  });
});
