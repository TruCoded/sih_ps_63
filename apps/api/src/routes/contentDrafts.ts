import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { llmService } from '../services/llmService.js';

export const contentDraftsRouter = Router();

// GET /api/content-drafts
contentDraftsRouter.get('/', (req: Request, res: Response) => {
  const drafts = store.getContentDrafts();
  res.json({ success: true, data: drafts });
});

// POST /api/content-drafts/generate-pack (LLM-Powered Multi-Platform Synthesizer)
contentDraftsRouter.post('/generate-pack', async (req: Request, res: Response) => {
  const {
    primaryAssetId,
    audience = 'general_public',
    channel = 'educational_explainer',
    tone = 'engaging',
    customInstructions = '',
    actorName = 'Science Communicator',
    config
  } = req.body;

  const primaryAsset = store.getAssetById(primaryAssetId, 'curator') || store.getAssets({ userRole: 'public_visitor' }).assets[0];
  if (!primaryAsset) {
    return res.status(404).json({ success: false, message: 'Source asset not found' });
  }

  try {
    const pack = await llmService.generateMediaPack(
      primaryAsset,
      audience,
      channel,
      tone,
      customInstructions,
      config
    );

    const draft = store.createContentDraft({
      title: pack.headline,
      sourceAssetVersionIds: primaryAsset.versions.map((v: any) => v.versionId) || ['ver-001'],
      targetAudience: audience as any,
      channel: channel as any,
      tone: tone as any,
      generatedHeadline: pack.headline,
      generatedBody: pack.body,
      bulletPoints: pack.bulletPoints,
      suggestedAltText: pack.suggestedAltText,
      citationLinks: [
        {
          claim: `Evidence grounded in ${primaryAsset.title}`,
          assetId: primaryAsset.id,
          assetTitle: primaryAsset.title,
          pageOrTimestamp: "Official Technical Report Section 1",
          sourceUrl: primaryAsset.sourceUrl
        }
      ],
      claimsNeedingVerification: [
        "Confirm that all numbers match the latest validated expedition annexure."
      ],
      licenceAttributionStatement: `Source: National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences. Licensed under ${primaryAsset.licence}.`
    }, actorName);

    res.status(201).json({
      success: true,
      data: {
        ...draft,
        hashtags: pack.hashtags,
        aiVerificationScore: pack.aiVerificationScore,
        verifiableClaims: pack.verifiableClaims
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to synthesize content pack', error });
  }
});

// POST /api/content-drafts/verify-claims (AI Claim Verification Radar)
contentDraftsRouter.post('/verify-claims', async (req: Request, res: Response) => {
  const { draftText, primaryAssetId } = req.body;
  const primaryAsset = store.getAssetById(primaryAssetId, 'curator') || store.getAssets({ userRole: 'public_visitor' }).assets[0];
  if (!primaryAsset) {
    return res.status(404).json({ success: false, message: 'Source asset not found' });
  }

  const result = await llmService.verifyDraftClaims(draftText || '', primaryAsset);
  res.json({ success: true, data: result });
});

// POST /api/content-drafts (standard create)
contentDraftsRouter.post('/', (req: Request, res: Response) => {
  const {
    sourceAssetIds = [],
    targetAudience = 'general_public',
    channel = 'educational_explainer',
    tone = 'engaging',
    actorName = 'Science Communicator'
  } = req.body;

  const sourceAssets = sourceAssetIds.map((id: string) => store.getAssetById(id, 'curator')).filter(Boolean);
  const primaryAsset = sourceAssets[0] || store.getAssets({ userRole: 'public_visitor' }).assets[0];

  const draft = store.createContentDraft({
    title: `Polar Knowledge Story: ${primaryAsset?.title || 'Polar Research'}`,
    sourceAssetVersionIds: primaryAsset?.versions.map((v: any) => v.versionId) || ['ver-001'],
    targetAudience,
    channel,
    tone,
    generatedHeadline: `Discoveries from ${primaryAsset?.spatialCoverageName || 'Indian Polar Bases'}`,
    generatedBody: primaryAsset?.abstract || 'Verified polar findings.',
    bulletPoints: ['Grounded in primary records', 'FAIR compliant stewardship'],
    suggestedAltText: 'View of scientific research expedition base.',
    citationLinks: primaryAsset ? [{
      claim: "Findings verified against official archives",
      assetId: primaryAsset.id,
      assetTitle: primaryAsset.title,
      pageOrTimestamp: "Executive Summary",
      sourceUrl: primaryAsset.sourceUrl
    }] : [],
    claimsNeedingVerification: ["Review before broadcast."],
    licenceAttributionStatement: `Source: National Centre for Polar and Ocean Research (NCPOR). Licensed under ${primaryAsset?.licence || 'CC-BY-4.0'}.`
  }, actorName);

  res.status(201).json({ success: true, data: draft });
});

// POST /api/content-drafts/:id/approve
contentDraftsRouter.post('/:id/approve', (req: Request, res: Response) => {
  const { reviewerName = 'Chief Communications Officer', notes } = req.body;
  const approved = store.approveContentDraft(req.params.id, reviewerName, notes);
  if (!approved) {
    return res.status(404).json({ success: false, message: 'Draft not found' });
  }
  res.json({ success: true, message: 'Content draft approved for public release', data: approved });
});
