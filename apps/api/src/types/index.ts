// =====================================================================
// PolarConnect — API Shared Domain Types and Enums (SIH Problem Statement 26063)
// =====================================================================

export type PolarProgramme = 'Antarctica' | 'Arctic' | 'Southern Ocean' | 'Himalayas';

export type AssetType = 'report' | 'dataset' | 'photo' | 'video' | 'activity';

export type AccessState = 
  | 'draft'
  | 'quarantined'
  | 'private'
  | 'restricted'
  | 'embargoed'
  | 'public'
  | 'withdrawn';

export type UserRole = 
  | 'public_visitor'
  | 'student'
  | 'researcher'
  | 'contributor'
  | 'curator'
  | 'comms_reviewer'
  | 'admin';

export interface StationTelemetry {
  stationId: string;
  name: string;
  programme: PolarProgramme;
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  temperatureC: number;
  windSpeedKnots: number;
  windDirectionDeg: number;
  pressureHpa: number;
  humidityPercent: number;
  solarRadiationWm2: number;
  status: 'active' | 'seasonal' | 'historic';
  establishedYear: number;
  lastObservationTime: string;
  source: string;
  isCached: boolean;
}

export interface Waypoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  date: string;
  description: string;
  scientificActivity?: string;
}

export interface Expedition {
  id: string;
  slug: string;
  title: string;
  programme: PolarProgramme;
  region: string;
  startDate: string;
  endDate: string;
  leadScientist: string;
  institution: string;
  vesselOrBase: string;
  status: 'planned' | 'ongoing' | 'completed';
  publicSummary: string;
  scientificObjectives: string[];
  bannerImage: string;
  routeGeoJSON: {
    type: 'FeatureCollection';
    features: Array<{
      type: 'Feature';
      geometry: {
        type: 'LineString' | 'Point';
        coordinates: number[] | number[][];
      };
      properties: Record<string, any>;
    }>;
  };
  waypoints: Waypoint[];
  linkedAssetIds: string[];
}

export interface AssetVersion {
  versionId: string;
  assetId: string;
  versionNumber: number;
  objectKey: string;
  sha256: string;
  byteSize: number;
  mimeType: string;
  originalFilename: string;
  uploadedBy: string;
  createdAt: string;
  processingState: 'uploaded' | 'quarantined' | 'scanning' | 'processed' | 'failed';
  extractedText?: string;
  extractedMetadata?: {
    pageCount?: number;
    dimensions?: { width: number; height: number };
    durationSeconds?: number;
    exifStripped?: boolean;
    detectedLanguage?: string;
    sampleRows?: Record<string, any>[];
    columnDefinitions?: Array<{ name: string; type: string; unit?: string }>;
  };
}

export interface Derivative {
  id: string;
  parentVersionId: string;
  type: 'thumbnail' | 'webp_preview' | 'pdf_preview' | 'video_poster' | 'transcript' | 'dataset_sample';
  objectKey: string;
  url: string;
  format: string;
  byteSize: number;
  isPublic: boolean;
}

export interface DatasetDetail {
  id: string;
  assetId: string;
  temporalCoverage: { start: string; end: string };
  spatialCoverage: {
    north: number;
    south: number;
    east: number;
    west: number;
    placeName: string;
  };
  variablesMeasured: string[];
  instruments: string[];
  methodology: string;
  qualityControlNotes: string;
  sampleDataUrl?: string;
  authoritativeDoi?: string;
  distributionFormat: 'CSV' | 'NetCDF' | 'ASCII' | 'GeoTIFF';
}

export interface AssetRelationship {
  id: string;
  fromAssetId: string;
  predicate: 'partOf' | 'documents' | 'usesDataset' | 'depicts' | 'derivedFrom' | 'publishedAs';
  toAssetId: string;
  note?: string;
}

export interface Asset {
  id: string;
  type: AssetType;
  title: string;
  abstract: string;
  expeditionId?: string;
  sourceUrl: string;
  authoritativeProvider: 'NCPOR' | 'NPDC' | 'SCAR' | 'SOOS' | 'MoES' | 'Internal';
  contributors: Array<{ name: string; role: string; orcid?: string; affiliation?: string }>;
  subjects: string[];
  date: string;
  spatialCoverageName: string;
  licence: string;
  rightsHolder: string;
  accessState: AccessState;
  accessPolicy: {
    isPublicDerivativeAllowed: boolean;
    embargoUntil?: string;
    requiresApproval: boolean;
    policySource: string;
    allowedAudience: ('public' | 'researcher' | 'curator')[];
  };
  currentVersionNumber: number;
  versions: AssetVersion[];
  derivatives: Derivative[];
  datasetDetail?: DatasetDetail;
  fairMetrics: {
    findableScore: number;
    accessibleScore: number;
    interoperableScore: number;
    reusableScore: number;
  };
  careCompliant: boolean;
  geographicSensitivityFlag: boolean;
  downloadCount: number;
  viewCount: number;
}

export interface ContentDraft {
  id: string;
  title: string;
  sourceAssetVersionIds: string[];
  targetAudience: 'school_students' | 'general_public' | 'journalists_press' | 'policymakers';
  channel: 'twitter_thread' | 'instagram_carousel' | 'press_release' | 'educational_explainer';
  tone: 'engaging' | 'rigorous' | 'inspiring' | 'plain_language';
  generatedHeadline: string;
  generatedBody: string;
  bulletPoints?: string[];
  suggestedAltText: string;
  citationLinks: Array<{
    claim: string;
    assetId: string;
    assetTitle: string;
    pageOrTimestamp: string;
    sourceUrl: string;
  }>;
  claimsNeedingVerification: string[];
  licenceAttributionStatement: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    role: UserRole;
    email: string;
  };
  action: 
    | 'UPLOAD_INITIATED'
    | 'FILE_QUARANTINED'
    | 'ANTIVIRUS_PASSED'
    | 'METADATA_EXTRACTED'
    | 'SUBMITTED_FOR_REVIEW'
    | 'ACCESS_STATE_CHANGED'
    | 'EMBARGO_MODIFIED'
    | 'PUBLISHED'
    | 'ASSET_DOWNLOADED'
    | 'DRAFT_GENERATED'
    | 'DRAFT_APPROVED'
    | 'SENSITIVITY_FLAGGED';
  targetType: 'Asset' | 'Expedition' | 'ContentDraft' | 'Policy';
  targetId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  notes: string;
}

export interface RAGCitation {
  assetId: string;
  assetTitle: string;
  versionId: string;
  pageOrTimeLocator: string;
  chunkSnippet: string;
  sourceUrl: string;
  relevanceScore: number;
}

export interface RAGAnswer {
  query: string;
  answer: string;
  citations: RAGCitation[];
  evidenceFound: boolean;
  isUnsupportedOrGap: boolean;
  groundingConfidence: number;
  processingTimeMs: number;
  evaluatedPolicies: string[];
}

export interface RAGEvalBenchmark {
  id: string;
  question: string;
  expectedSourceAssetId: string;
  expectedTopic: string;
  isSensitiveProhibited: boolean;
  category: 'Arctic' | 'Antarctica' | 'Southern Ocean' | 'Himalayas' | 'Policy / Access' | 'Station Operations';
}
