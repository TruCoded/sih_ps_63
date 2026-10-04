import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { StationCommandHUD } from './components/StationCommandHUD.tsx';
import { VoyageTimeline } from './components/VoyageTimeline.tsx';
import { ScientificCatalogue } from './components/ScientificCatalogue.tsx';
import { PolarAiAssistant } from './components/PolarAiAssistant.tsx';
import { ContentStudio } from './components/ContentStudio.tsx';
import { IngestPipelineWizard } from './components/IngestPipelineWizard.tsx';
import { CuratorReviewQueue } from './components/CuratorReviewQueue.tsx';
import { SmartEducationHub } from './components/SmartEducationHub.tsx';
import { ProvGraphViewer } from './components/ProvGraphViewer.tsx';
import { AuditLogViewer } from './components/AuditLogViewer.tsx';
import { Footer } from './components/Footer.tsx';
import { StationTelemetry, Expedition, Asset, UserRole, PolarProgramme } from '../../../packages/shared-types/index.js';
import { Download, CheckCircle2, X, AlertTriangle, RefreshCw } from 'lucide-react';

// ── Error Boundary — prevents blank-page crashes ─────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(err: Error) {
    return { hasError: true, error: err.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-rose-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">Something went wrong</h2>
            <p className="text-sm text-[var(--muted-foreground)] max-w-sm">
              This section encountered an unexpected error. Try refreshing or switching tabs.
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: '' })}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('public_visitor');
  const [activeTab, setActiveTab] = useState<string>('command');

  const [stations, setStations] = useState<StationTelemetry[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [downloadModal, setDownloadModal] = useState<any | null>(null);
  const [selectedAssetForProv, setSelectedAssetForProv] = useState<string | undefined>(undefined);

  // Initial Data Fetching from API
  useEffect(() => {
    setIsLoading(true);
    setApiError(false);

    Promise.all([
      fetch('/api/stations/weather').then(r => r.json()).catch(() => null),
      fetch('/api/expeditions').then(r => r.json()).catch(() => null),
      fetch(`/api/assets/catalogue?userRole=${currentRole}`).then(r => r.json()).catch(() => null),
    ]).then(([stData, expData, assetData]) => {
      if (stData?.success) setStations(stData.data);
      if (expData?.success) setExpeditions(expData.data);
      if (assetData?.success) setAssets(assetData.data);
      if (!stData && !expData && !assetData) setApiError(true);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [currentRole]);

  // Handle Download Request
  const handleDownloadAsset = async (assetId: string) => {
    try {
      const res = await fetch(`/api/assets/${assetId}/download?userRole=${currentRole}&userName=Scientist`);
      const data = await res.json();
      if (data.success) {
        setDownloadModal(data);
      } else {
        alert(data.message || 'Access Denied: Record is restricted or embargoed.');
      }
    } catch (e) {
      console.error('Download check failed:', e);
    }
  };

  const handleAssetIngested = (newAsset: Asset) => {
    setAssets(prev => [newAsset, ...prev]);
  };

  const handleAssetUpdated = (updatedAsset: Asset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
  };

  const handleOpenProvenance = (assetId: string) => {
    setSelectedAssetForProv(assetId);
    setActiveTab('audit');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[var(--ice)] selection:text-[var(--deep)]">
      {/* Navbar with live station ticker & role selector */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stations={stations}
      />

      {/* Loading Skeleton — shown while API data is fetching */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-xl border-2 border-[var(--signal)] border-t-transparent animate-spin" />
            <p className="text-sm text-[var(--muted-foreground)] font-mono">Loading NCPOR data corpus…</p>
          </div>
        </div>
      )}

      {/* API Error Banner */}
      {!isLoading && apiError && (
        <div className="mx-auto max-w-2xl mt-12 px-6">
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 flex items-start gap-4">
            <span className="text-amber-500 mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-amber-900">Cannot connect to PolarConnect API</p>
              <p className="text-xs text-amber-700 mt-1">Make sure the API server is running on port 4000. Run <code className="bg-amber-100 px-1 rounded">npm run dev</code> in <code className="bg-amber-100 px-1 rounded">apps/api</code>.</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {!isLoading && (
      <ErrorBoundary>
      <main className="flex-1">
        {/* Render Hero Section when on Command HUD */}
        {activeTab === 'command' && (
          <HeroSection onNavigate={setActiveTab} />
        )}

        {/* Tab 1: Station Command HUD & Telemetry */}
        {activeTab === 'command' && (
          stations.length > 0 ? (
            <StationCommandHUD
              stations={stations}
              onSelectExpeditionByProgramme={(_prog: PolarProgramme) => {
                setActiveTab('expeditions');
              }}
            />
          ) : (
            <div className="page-container py-20 text-center">
              <p className="text-[var(--muted-foreground)] text-sm font-mono">⏳ Awaiting station telemetry from NCPOR…</p>
            </div>
          )
        )}

        {/* Tab 2: Expeditions & Voyage Timeline */}
        {activeTab === 'expeditions' && (
          expeditions.length > 0 ? (
            <VoyageTimeline
              expeditions={expeditions}
              assets={assets}
              onSelectAsset={(_assetId: string) => {
                setActiveTab('catalogue');
              }}
            />
          ) : (
            <div className="page-container py-20 text-center">
              <p className="text-[var(--muted-foreground)] text-sm font-mono">⏳ Awaiting expedition data from NCPOR…</p>
            </div>
          )
        )}

        {/* Tab 3: Scientific Knowledge Catalogue */}
        {activeTab === 'catalogue' && (
          <ScientificCatalogue
            assets={assets}
            userRole={currentRole}
            onDownloadAsset={handleDownloadAsset}
            onOpenProvenance={handleOpenProvenance}
          />
        )}

        {/* Tab 4: PolarAI Grounded Q&A Assistant & Benchmark Suite */}
        {activeTab === 'rag' && (
          <PolarAiAssistant
            userRole={currentRole}
            onSelectAsset={(assetId) => {
              setActiveTab('catalogue');
            }}
          />
        )}

        {/* Tab 5: Content Studio */}
        {activeTab === 'studio' && (
          <ContentStudio
            assets={assets}
            userRole={currentRole}
          />
        )}

        {/* Tab 6: Field Ingestion & Quarantine Pipeline */}
        {activeTab === 'ingest' && (
          <IngestPipelineWizard
            userRole={currentRole}
            onAssetIngested={handleAssetIngested}
          />
        )}

        {/* Tab 7: Curator Governance & Review Queue */}
        {activeTab === 'curation' && (
          <CuratorReviewQueue
            assets={assets}
            userRole={currentRole}
            onAssetUpdated={handleAssetUpdated}
          />
        )}

        {/* Tab 8: Smart Education Hub */}
        {activeTab === 'education' && (
          <SmartEducationHub />
        )}

        {/* Tab 9: System Audit & W3C PROV-O Graph */}
        {activeTab === 'audit' && (
          <div className="space-y-8">
            <ProvGraphViewer
              assets={assets}
              initialAssetId={selectedAssetForProv}
            />
            <AuditLogViewer userRole={currentRole} />
          </div>
        )}
      </main>
      </ErrorBoundary>
      )}

      {/* Footer */}
      <Footer />

      {/* Authorized Download Modal */}
      {downloadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-xl max-w-lg w-full p-6 border border-[var(--border)] shadow-2xl text-[var(--foreground)]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <span className="text-sm font-bold text-[var(--foreground)] font-mono">
                  Access Entitlement Validated
                </span>
              </div>
              <button 
                onClick={() => setDownloadModal(null)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h4 className="text-sm font-bold text-[var(--foreground)] mb-2">{downloadModal.title}</h4>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-4">
              Your request was authenticated per NCPOR Open Research Access Policy. An immutable audit record has been logged.
            </p>

            <div className="bg-[var(--secondary)] p-3 rounded-lg border border-[var(--border)] text-xs font-mono space-y-1 text-[var(--muted-foreground)] mb-6">
              <div><span className="text-[var(--foreground)] font-semibold">LICENCE: </span>{downloadModal.licence}</div>
              <div><span className="text-[var(--foreground)] font-semibold">ATTRIBUTION: </span>{downloadModal.attribution}</div>
              <div className="text-emerald-700 font-semibold truncate">
                <span className="text-[var(--foreground)]">SOURCE: </span>{downloadModal.authoritativeSourceUrl}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDownloadModal(null)}
                className="px-4 py-2 rounded text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)] bg-[var(--background)] cursor-pointer"
              >
                Dismiss
              </button>
              <a
                href={downloadModal.authoritativeSourceUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setDownloadModal(null)}
                className="px-5 py-2 rounded bg-[var(--primary)] hover:bg-[var(--deep)] text-[var(--primary-foreground)] font-bold text-xs shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Authoritative NPDC Source</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
