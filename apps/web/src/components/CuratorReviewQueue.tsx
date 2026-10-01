import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  AlertTriangle, 
  ExternalLink, 
  Layers,
  FileText
} from 'lucide-react';
import { Asset, UserRole, AccessState } from '../../../../packages/shared-types/index.js';

interface CuratorReviewQueueProps {
  assets: Asset[];
  userRole: UserRole;
  onAssetUpdated: (updatedAsset: Asset) => void;
}

export const CuratorReviewQueue: React.FC<CuratorReviewQueueProps> = ({ 
  assets, 
  userRole, 
  onAssetUpdated 
}) => {
  const [embargoDates, setEmbargoDates] = useState<Record<string, string>>({});
  const [curatorNotes, setCuratorNotes] = useState<Record<string, string>>({});

  const reviewAssets = assets.filter(a => a.accessState !== 'public');

  const handlePublish = async (assetId: string) => {
    try {
      const res = await fetch(`/api/assets/${assetId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorName: 'Priya Sharma (Senior Curator)',
          actorRole: 'curator'
        })
      });
      const data = await res.json();
      if (data.success) {
        onAssetUpdated(data.data);
      }
    } catch (err) {
      console.error('Publish failed:', err);
    }
  };

  const handleSetAccess = async (assetId: string, newState: AccessState) => {
    try {
      const res = await fetch(`/api/assets/${assetId}/access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newState,
          embargoUntil: embargoDates[assetId] || '2026-12-31',
          actorName: 'Priya Sharma (Senior Curator)',
          actorRole: 'curator'
        })
      });
      const data = await res.json();
      if (data.success) {
        onAssetUpdated(data.data);
      }
    } catch (err) {
      console.error('Access change failed:', err);
    }
  };

  return (
    <div className="page-container py-12">
      {/* 1. KINDRED-PALETTE PAGE INTRO */}
      <div className="pb-10 border-b border-[var(--border)] mb-8">
        <div className="section-kicker">
          <span>10</span>
          <span>Curation</span>
        </div>
        <h1 className="editorial-title">
          Curator Governance &amp; <em className="font-serif italic font-normal text-[var(--signal)]">access queue.</em>
        </h1>
        <p className="page-intro-desc">
          Authorized data stewards validate incoming quarantined files, review metadata completeness against ISO 19115 and GCMD standards, configure research embargo lock-in periods, and authorize public release.
        </p>
      </div>

      <div className="space-y-6">
        {reviewAssets.map(asset => {
          const isQuarantined = asset.accessState === 'quarantined';
          const isEmbargoed = asset.accessState === 'embargoed';
          const isRestricted = asset.accessState === 'restricted';

          return (
            <div 
              key={asset.id}
              className="bg-[var(--card)] rounded-[var(--radius)] p-6 sm:p-8 border border-[var(--border)] relative overflow-hidden shadow-xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 border-b border-[var(--border)] pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] font-bold">
                      {asset.type}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                      isQuarantined
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : isEmbargoed
                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                        : 'bg-rose-50 text-rose-700 border-rose-300'
                    }`}>
                      STATUS: {asset.accessState}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] font-mono">ID: {asset.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">{asset.title}</h3>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono">
                  <div className="bg-[var(--secondary)]/60 px-3 py-1.5 rounded border border-[var(--border)] text-right">
                    <div className="text-[10px] text-[var(--muted-foreground)]">FAIR SCORE</div>
                    <div className="text-emerald-700 font-bold">{asset.fairMetrics.findableScore}%</div>
                  </div>
                  <div className="bg-[var(--secondary)]/60 px-3 py-1.5 rounded border border-[var(--border)] text-right">
                    <div className="text-[10px] text-[var(--muted-foreground)]">POLICY</div>
                    <div className="text-[var(--foreground)] font-semibold truncate max-w-[120px]">{asset.accessPolicy.policySource.split(' ')[0]}</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-4 font-light">
                {asset.abstract}
              </p>

              {/* Policy & Governance Action Controls */}
              <div className="bg-[var(--secondary)]/40 p-4 rounded-[var(--radius)] border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-[var(--signal)]" />
                    <span className="text-[var(--muted-foreground)]">Embargo Lock-in Until:</span>
                    <input
                      type="date"
                      value={embargoDates[asset.id] || asset.accessPolicy.embargoUntil || '2026-12-31'}
                      onChange={(e) => setEmbargoDates({ ...embargoDates, [asset.id]: e.target.value })}
                      className="bg-[var(--card)] border border-[var(--border)] rounded px-2 py-1 text-[var(--foreground)] text-xs focus:outline-none focus:border-[var(--ring)]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSetAccess(asset.id, 'embargoed')}
                    className="px-3.5 py-2 rounded-[var(--radius)] bg-[var(--card)] hover:bg-[var(--secondary)] text-amber-700 text-xs font-semibold border border-amber-300 transition-all flex items-center space-x-1 cursor-pointer shadow-2xs"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Apply Embargo Lock</span>
                  </button>

                  <button
                    onClick={() => handleSetAccess(asset.id, 'restricted')}
                    className="px-3.5 py-2 rounded-[var(--radius)] bg-[var(--card)] hover:bg-[var(--secondary)] text-rose-700 text-xs font-semibold border border-rose-300 transition-all cursor-pointer shadow-2xs"
                  >
                    Restrict
                  </button>

                  <button
                    onClick={() => handlePublish(asset.id)}
                    className="px-5 py-2 rounded-[var(--radius)] bg-[var(--primary)] hover:bg-[var(--deep)] text-[var(--primary-foreground)] text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Publish to Public Catalogue</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {reviewAssets.length === 0 && (
          <div className="bg-[var(--card)] rounded-[var(--radius)] p-12 text-center border border-[var(--border)] shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">Curation Queue Empty</h3>
            <p className="text-xs text-[var(--muted-foreground)] font-light">All submitted records have been verified and processed into the public repository.</p>
          </div>
        )}
      </div>

      {/* Standardized Bottom Container */}
      <div className="bottom-box-container">
        <div className="flex items-start gap-3.5">
          <div className="bottom-box-icon">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--foreground)]">ISO 19115 / GCMD Curation Standards</h4>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
              All curation decisions are logged in the immutable audit trail. Embargo policies comply with the Indian National Policy on Open Data for Science (NPODS-2022) and NCPOR Data Governance Framework. Public release triggers a FAIR-compliant DOI minting via DataCite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
