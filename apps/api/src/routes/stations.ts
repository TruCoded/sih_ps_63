import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';

export const stationsRouter = Router();

// GET /api/stations/weather - All station telemetry with NCPOR attribution & cache status
stationsRouter.get('/weather', (req: Request, res: Response) => {
  try {
    const stations = store.getStations();
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      provider: 'National Centre for Polar and Ocean Research (NCPOR) / IMD',
      data: stations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve station telemetry', error });
  }
});

// GET /api/stations/:id
stationsRouter.get('/:id', (req: Request, res: Response) => {
  const station = store.getStationById(req.params.id);
  if (!station) {
    return res.status(404).json({ success: false, message: 'Station not found' });
  }
  res.json({ success: true, data: station });
});
