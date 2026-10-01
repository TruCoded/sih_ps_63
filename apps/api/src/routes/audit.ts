import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';

export const auditRouter = Router();

// GET /api/audit-events
auditRouter.get('/', (req: Request, res: Response) => {
  const events = store.getAuditEvents();
  res.json({
    success: true,
    total: events.length,
    data: events
  });
});
