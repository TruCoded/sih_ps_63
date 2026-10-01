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
import { Download, CheckCircle2, X } from 'lucide-react';
import seedData from './data/seed-data.json';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('public_visitor');
  const [activeTab, setActiveTab] = useState<string>('command');

  const [stations, setStations] = useState<StationTelemetry[]>((seedData as any).stations || []);
  const [expeditions, setExpeditions] = useState<Expedition[]>((seedData as any).expeditions || []);
  const [assets, setAssets] = useState<Asset[]>((seedData as any).assets || []);
  const [downloadModal, setDownloadModal] = useState<any | null>(null);
  const [selectedAssetForProv, setSelectedAssetForProv] = useState<string | undefined>(undefined);

  // Initial Data Fetching from API (refreshes state with live data)
  useEffect(() => {
    // 1. Fetch Stations
    fetch('/api/stations/weather')
      .then(r => r.json())
      .then(d => { if (d.success && d.data && d.data.length > 0) setStations(d.data); })
      .catch(e => console.error('Stations fetch error:', e));

    // 2. Fetch Expeditions
    fetch('/api/expeditions')
      .then(r => r.json())
      .then(d => { if (d.success && d.data && d.data.length > 0) setExpeditions(d.data); })
      .catch(e => console.error('Expeditions fetch error:', e));

    // 3. Fetch Assets
    fetch(`/api/assets/catalogue?userRole=${currentRole}`)
      .then(r => r.json())
      .then(d => { if (d.success && d.data && d.data.length > 0) setAssets(d.data); })
      .catch(e => console.error('Assets fetch error:', e));
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

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Render Hero Section when on Command HUD */}
        {activeTab === 'command' && (
          <HeroSection onNavigate={setActiveTab} />
        )}

        {/* Tab 1: Station Command HUD & Telemetry */}
        {activeTab === 'command' && (
          <StationCommandHUD
            stations={stations}
            onSelectExpeditionByProgramme={(prog: PolarProgramme) => {
              setActiveTab('expeditions');
            }}
          />
        )}

        {/* Tab 2: Expeditions & Voyage Timeline */}
        {activeTab === 'expeditions' && (
          <VoyageTimeline
            expeditions={expeditions}
            assets={assets}
            onSelectAsset={(assetId: string) => {
              setActiveTab('catalogue');
            }}
          />
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
