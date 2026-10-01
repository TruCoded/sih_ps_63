import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { UserRole, AccessState } from '../types/index.js';

export const assetsRouter = Router();

// GET /api/assets/catalogue
assetsRouter.get('/catalogue', (req: Request, res: Response) => {
  const { programme, type, accessState, search, userRole } = req.query;
  const result = store.getAssets({
    programme: programme as string,
    type: type as string,
    accessState: accessState as string,
    search: search as string,
    userRole: (userRole as UserRole) || 'public_visitor'
  });

  res.json({
    success: true,
    total: result.assets.length,
    data: result.assets,
    facets: result.facets
  });
});

// GET /api/assets/:id
assetsRouter.get('/:id', (req: Request, res: Response) => {
  const userRole = (req.query.userRole as UserRole) || 'public_visitor';
  const asset = store.getAssetById(req.params.id, userRole);
  if (!asset) {
    return res.status(404).json({
      success: false,
      message: 'Asset not found or restricted per NCPOR access policy'
    });
  }
  res.json({ success: true, data: asset });
});

// POST /api/assets (create draft/quarantined asset)
assetsRouter.post('/', (req: Request, res: Response) => {
  const { actorName = 'Field Contributor', actorRole = 'contributor', ...assetData } = req.body;
  const newAsset = store.createAssetDraft(assetData, actorName, actorRole as UserRole);
  res.status(201).json({ success: true, data: newAsset });
});

// PATCH /api/assets/:id (update metadata)
assetsRouter.patch('/:id', (req: Request, res: Response) => {
  const { actorName = 'Data Curator', actorRole = 'curator', ...updates } = req.body;
  const updated = store.updateAssetMetadata(req.params.id, updates, actorName, actorRole as UserRole);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Asset not found' });
  }
  res.json({ success: true, data: updated });
});

// POST /api/assets/:id/publish (curator action)
assetsRouter.post('/:id/publish', (req: Request, res: Response) => {
  const { actorName = 'Data Curator', actorRole = 'curator' } = req.body;
  if (actorRole !== 'curator' && actorRole !== 'admin') {
    return res.status(403).json({ success: false, message: 'Permission denied: Only curators or admins can publish assets.' });
  }
  const published = store.publishAsset(req.params.id, actorName, actorRole as UserRole);
  if (!published) {
    return res.status(404).json({ success: false, message: 'Asset not found' });
  }
  res.json({ success: true, message: 'Asset successfully verified and published to public catalogue', data: published });
});

// POST /api/assets/:id/access (change access state or set embargo)
assetsRouter.post('/:id/access', (req: Request, res: Response) => {
  const { newState, embargoUntil, actorName = 'Data Curator', actorRole = 'curator' } = req.body;
  if (actorRole !== 'curator' && actorRole !== 'admin') {
    return res.status(403).json({ success: false, message: 'Permission denied: Curator access required.' });
  }
  const updated = store.changeAccessState(req.params.id, newState as AccessState, embargoUntil, actorName, actorRole as UserRole);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Asset not found' });
  }
  res.json({ success: true, data: updated });
});

// GET /api/assets/:id/download (entitlement check & audit)
assetsRouter.get('/:id/download', (req: Request, res: Response) => {
  const userRole = (req.query.userRole as UserRole) || 'public_visitor';
  const asset = store.getAssetById(req.params.id, userRole);

  if (!asset) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Asset is quarantined, restricted or embargoed.'
    });
  }

  store.logAudit({
    actor: { name: (req.query.userName as string) || 'Visitor', role: userRole, email: 'download-user@polarconnect.gov.in' },
    action: 'ASSET_DOWNLOADED',
    targetType: 'Asset',
    targetId: asset.id,
    notes: `Download entitlement validated. Directed to authoritative source: ${asset.sourceUrl}`
  });

  asset.downloadCount += 1;

  res.json({
    success: true,
    assetId: asset.id,
    title: asset.title,
    authoritativeSourceUrl: asset.sourceUrl,
    licence: asset.licence,
    attribution: `Please attribute to: ${asset.rightsHolder}`,
    downloadUrl: asset.derivatives[0]?.url || asset.sourceUrl
  });
});
