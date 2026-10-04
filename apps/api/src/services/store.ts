import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { 
  StationTelemetry, 
  Expedition, 
  Asset, 
  AssetVersion, 
  AuditEvent, 
  ContentDraft, 
  UserRole,
  AccessState 
} from '../types/index.js';

import seedDataJson from '../data/seed-data.json';

const currentDir = typeof __dirname !== 'undefined' ? __dirname : '';
const SEED_CANDIDATES = [
  path.resolve(currentDir, '../../../../infra/seed/seed-data.json'),
  path.resolve(currentDir, '../../../infra/seed/seed-data.json'),
  path.resolve(process.cwd(), 'infra/seed/seed-data.json'),
  path.resolve(currentDir, '../seed-data.json'),
];
const seedPath = SEED_CANDIDATES.find(p => p && fs.existsSync(p));

class DataStore {
  private stations: StationTelemetry[] = [];
  private expeditions: Expedition[] = [];
  private assets: Asset[] = [];
  private auditEvents: AuditEvent[] = [];
  private contentDrafts: ContentDraft[] = [];

  constructor() {
    this.loadSeedData();
  }

  private loadSeedData() {
    try {
      let data: any = null;
      if (seedPath && fs.existsSync(seedPath)) {
        const raw = fs.readFileSync(seedPath, 'utf-8');
        data = JSON.parse(raw);
      } else {
        data = seedDataJson;
      }
      this.stations = data?.stations || [];
      this.expeditions = data?.expeditions || [];
      this.assets = data?.assets || [];
      this.auditEvents = data?.auditEvents || [];
      this.contentDrafts = data?.contentDrafts || [];
      console.log(`[Store] Seed data successfully loaded: ${this.stations.length} stations, ${this.expeditions.length} expeditions, ${this.assets.length} assets.`);
    } catch (err) {
      console.error('[Store] Error loading seed data, using bundled fallback:', err);
      const data: any = seedDataJson;
      this.stations = data?.stations || [];
      this.expeditions = data?.expeditions || [];
      this.assets = data?.assets || [];
      this.auditEvents = data?.auditEvents || [];
      this.contentDrafts = data?.contentDrafts || [];
    }
  }

  // Stations
  public getStations(): StationTelemetry[] {
    return this.stations.map(st => {
      const tempDrift = (Math.sin(Date.now() / 100000 + st.latitude) * 0.4);
      const windDrift = (Math.cos(Date.now() / 80000 + st.longitude) * 0.8);
      return {
        ...st,
        temperatureC: Number((st.temperatureC + tempDrift).toFixed(1)),
        windSpeedKnots: Math.max(0, Number((st.windSpeedKnots + windDrift).toFixed(1))),
        lastObservationTime: new Date().toISOString()
      };
    });
  }

  public getStationById(id: string): StationTelemetry | undefined {
    return this.getStations().find(s => s.stationId === id);
  }

  // Expeditions
  public getExpeditions(programme?: string): Expedition[] {
    if (programme && programme !== 'All') {
      return this.expeditions.filter(e => e.programme.toLowerCase() === programme.toLowerCase());
    }
    return this.expeditions;
  }

  public getExpeditionBySlug(slug: string): Expedition | undefined {
    return this.expeditions.find(e => e.slug === slug || e.id === slug);
  }

  // Assets & Catalogue
  public getAssets(filters: {
    programme?: string;
    type?: string;
    accessState?: string;
    search?: string;
    userRole?: UserRole;
  }): { assets: Asset[]; facets: Record<string, Record<string, number>> } {
    const role = filters.userRole || 'public_visitor';
    const isPublicUser = role === 'public_visitor' || role === 'student';

    let list = this.assets.filter(asset => {
      if (isPublicUser && asset.accessState !== 'public') {
        return false;
      }
      if (filters.accessState && filters.accessState !== 'all') {
        if (asset.accessState !== filters.accessState) return false;
      }
      if (filters.type && filters.type !== 'all') {
        if (asset.type !== filters.type) return false;
      }
      if (filters.programme && filters.programme !== 'all') {
        const exp = this.expeditions.find(e => e.id === asset.expeditionId);
        if (!exp || exp.programme.toLowerCase() !== filters.programme.toLowerCase()) return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesTitle = asset.title.toLowerCase().includes(q);
        const matchesAbstract = asset.abstract.toLowerCase().includes(q);
        const matchesSubject = asset.subjects.some((s: string) => s.toLowerCase().includes(q));
        const matchesProvider = asset.authoritativeProvider.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAbstract && !matchesSubject && !matchesProvider) return false;
      }
      return true;
    });

    const facets = {
      type: {} as Record<string, number>,
      programme: {} as Record<string, number>,
      accessState: {} as Record<string, number>,
      licence: {} as Record<string, number>
    };

    this.assets.forEach(a => {
      if (isPublicUser && a.accessState !== 'public') return;
      facets.type[a.type] = (facets.type[a.type] || 0) + 1;
      facets.accessState[a.accessState] = (facets.accessState[a.accessState] || 0) + 1;
      facets.licence[a.licence] = (facets.licence[a.licence] || 0) + 1;

      const exp = this.expeditions.find(e => e.id === a.expeditionId);
      const prog = exp ? exp.programme : 'General';
      facets.programme[prog] = (facets.programme[prog] || 0) + 1;
    });

    return { assets: list, facets };
  }

  public getAssetById(id: string, userRole: UserRole = 'public_visitor'): Asset | null {
    const asset = this.assets.find(a => a.id === id);
    if (!asset) return null;
    if ((userRole === 'public_visitor' || userRole === 'student') && asset.accessState !== 'public') {
      return null;
    }
    asset.viewCount += 1;
    return asset;
  }

  public createAssetDraft(data: Partial<Asset>, actorName: string, actorRole: UserRole): Asset {
    const id = `asset-${uuidv4().substring(0, 8)}`;
    const newAsset: Asset = {
      id,
      type: data.type || 'report',
      title: data.title || 'Untitled Ingest Record',
      abstract: data.abstract || '',
      expeditionId: data.expeditionId || 'exp-43-isea',
      sourceUrl: data.sourceUrl || 'https://data.ncpor.res.in/',
      authoritativeProvider: data.authoritativeProvider || 'NCPOR',
      contributors: data.contributors || [{ name: actorName, role: 'Contributor' }],
      subjects: data.subjects || ['Polar Science', 'Observation'],
      date: new Date().toISOString().split('T')[0],
      spatialCoverageName: data.spatialCoverageName || 'Indian Polar Station Vicinity',
      licence: data.licence || 'NCPOR Open Research Data Licence',
      rightsHolder: data.rightsHolder || 'NCPOR / Ministry of Earth Sciences',
      accessState: 'quarantined',
      accessPolicy: {
        isPublicDerivativeAllowed: true,
        requiresApproval: true,
        policySource: 'Standard MoES Data Submission Policy',
        allowedAudience: ['researcher', 'curator']
      },
      currentVersionNumber: 1,
      versions: [],
      derivatives: [],
      fairMetrics: {
        findableScore: 85,
        accessibleScore: 80,
        interoperableScore: 78,
        reusableScore: 82
      },
      careCompliant: true,
      geographicSensitivityFlag: false,
      downloadCount: 0,
      viewCount: 1
    };

    this.assets.unshift(newAsset);

    this.logAudit({
      actor: { name: actorName, role: actorRole, email: `${actorName.toLowerCase().replace(/\s+/g, '.')}@ncpor.res.in` },
      action: 'UPLOAD_INITIATED',
      targetType: 'Asset',
      targetId: id,
      notes: `New asset record created in quarantined state: "${newAsset.title}"`
    });

    return newAsset;
  }

  public updateAssetMetadata(id: string, updates: Partial<Asset>, actorName: string, actorRole: UserRole): Asset | null {
    const asset = this.assets.find(a => a.id === id);
    if (!asset) return null;

    const before = { ...asset };
    Object.assign(asset, updates);

    this.logAudit({
      actor: { name: actorName, role: actorRole, email: `${actorName.toLowerCase().replace(/\s+/g, '.')}@ncpor.res.in` },
      action: 'METADATA_EXTRACTED',
      targetType: 'Asset',
      targetId: id,
      beforeState: { title: before.title, licence: before.licence },
      afterState: { title: asset.title, licence: asset.licence },
      notes: `Asset metadata updated by ${actorName}`
    });

    return asset;
  }

  public publishAsset(id: string, actorName: string, actorRole: UserRole): Asset | null {
    const asset = this.assets.find(a => a.id === id);
    if (!asset) return null;

    const before = asset.accessState;
    asset.accessState = 'public';
    asset.fairMetrics.accessibleScore = Math.min(100, asset.fairMetrics.accessibleScore + 15);
    asset.fairMetrics.findableScore = Math.min(100, asset.fairMetrics.findableScore + 10);

    this.logAudit({
      actor: { name: actorName, role: actorRole, email: `${actorName.toLowerCase().replace(/\s+/g, '.')}@ncpor.res.in` },
      action: 'PUBLISHED',
      targetType: 'Asset',
      targetId: id,
      beforeState: { accessState: before },
      afterState: { accessState: 'public' },
      notes: `Curator ${actorName} verified metadata and approved public release into catalogue`
    });

    return asset;
  }

  public changeAccessState(id: string, newState: AccessState, embargoUntil: string | undefined, actorName: string, actorRole: UserRole): Asset | null {
    const asset = this.assets.find(a => a.id === id);
    if (!asset) return null;

    const before = asset.accessState;
    asset.accessState = newState;
    if (embargoUntil) {
      asset.accessPolicy.embargoUntil = embargoUntil;
    }

    this.logAudit({
      actor: { name: actorName, role: actorRole, email: `${actorName.toLowerCase().replace(/\s+/g, '.')}@ncpor.res.in` },
      action: newState === 'embargoed' ? 'EMBARGO_MODIFIED' : 'ACCESS_STATE_CHANGED',
      targetType: 'Asset',
      targetId: id,
      beforeState: { accessState: before },
      afterState: { accessState: newState, embargoUntil },
      notes: `Access state transition to ${newState} executed by ${actorName}`
    });

    return asset;
  }

  // Audit Log
  public getAuditEvents(): AuditEvent[] {
    return this.auditEvents;
  }

  public logAudit(event: Omit<AuditEvent, 'id' | 'timestamp'>) {
    const newEvent: AuditEvent = {
      id: `aud-${uuidv4().substring(0, 8)}`,
      timestamp: new Date().toISOString(),
      ...event
    };
    this.auditEvents.unshift(newEvent);
  }

  // Content Drafts
  public getContentDrafts(): ContentDraft[] {
    return this.contentDrafts;
  }

  public createContentDraft(draftData: Omit<ContentDraft, 'id' | 'createdAt' | 'status'>, actorName: string): ContentDraft {
    const newDraft: ContentDraft = {
      id: `draft-${uuidv4().substring(0, 8)}`,
      createdAt: new Date().toISOString(),
      status: 'pending_review',
      ...draftData
    };
    this.contentDrafts.unshift(newDraft);

    this.logAudit({
      actor: { name: actorName, role: 'comms_reviewer', email: 'comms@polarconnect.gov.in' },
      action: 'DRAFT_GENERATED',
      targetType: 'ContentDraft',
      targetId: newDraft.id,
      notes: `Generated evidence-based communication draft for channel: ${newDraft.channel}`
    });

    return newDraft;
  }

  public approveContentDraft(id: string, reviewerName: string, reviewerNotes?: string): ContentDraft | null {
    const draft = this.contentDrafts.find(d => d.id === id);
    if (!draft) return null;

    draft.status = 'approved';
    draft.reviewedBy = reviewerName;
    draft.reviewedAt = new Date().toISOString();
    draft.reviewerNotes = reviewerNotes || 'Verified against approved scientific source references.';

    this.logAudit({
      actor: { name: reviewerName, role: 'comms_reviewer', email: 'chief.editor@ncpor.res.in' },
      action: 'DRAFT_APPROVED',
      targetType: 'ContentDraft',
      targetId: id,
      notes: `Reviewer approved communication pack: "${draft.generatedHeadline}"`
    });

    return draft;
  }

  // W3C PROV-O Graph Builder
  public getProvenanceGraph(assetId: string) {
    const asset = this.assets.find(a => a.id === assetId);
    if (!asset) return { nodes: [], edges: [] };

    const nodes = [
      { id: `entity-expedition`, label: `Expedition Context (${asset.expeditionId || 'MoES Program'})`, type: 'activity', color: '#38bdf8' },
      { id: `entity-raw`, label: `Raw Sensor / Field Capture (${asset.title.substring(0, 24)}...)`, type: 'entity', color: '#00f2fe' },
      { id: `activity-quarantine`, label: 'Quarantine & Fixity Check (SHA-256)', type: 'activity', color: '#f59e0b' },
      { id: `activity-metadata`, label: 'Metadata Enrichment & EXIF Stripping', type: 'activity', color: '#8b5cf6' },
      { id: `entity-derivative`, label: 'Public WebP / Excerpt Derivative', type: 'entity', color: '#10b981' },
      { id: `agent-curator`, label: 'Data Curator Approval (NCPOR)', type: 'agent', color: '#ec4899' },
      { id: `activity-publish`, label: 'Public Catalogue Ingestion (FAIR 95%)', type: 'activity', color: '#06b6d4' }
    ];

    const edges = [
      { from: 'entity-raw', to: 'entity-expedition', relation: 'wasGeneratedBy' },
      { from: 'activity-quarantine', to: 'entity-raw', relation: 'used' },
      { from: 'activity-metadata', to: 'activity-quarantine', relation: 'wasInformedBy' },
      { from: 'entity-derivative', to: 'activity-metadata', relation: 'wasGeneratedBy' },
      { from: 'entity-derivative', to: 'entity-raw', relation: 'wasDerivedFrom' },
      { from: 'activity-publish', to: 'entity-derivative', relation: 'used' },
      { from: 'activity-publish', to: 'agent-curator', relation: 'wasAssociatedWith' }
    ];

    return { nodes, edges };
  }
}

export const store = new DataStore();
