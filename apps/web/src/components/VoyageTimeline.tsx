import React, { useState } from 'react';
import { 
  Navigation, 
  Calendar, 
  User, 
  Ship, 
  MapPin, 
  CheckCircle2, 
  ArrowUpRight, 
  Layers, 
  Compass,
  FileCheck
} from 'lucide-react';
import { Expedition, Asset } from '../../../../packages/shared-types/index.js';

interface VoyageTimelineProps {
  expeditions: Expedition[];
  assets: Asset[];
  onSelectAsset?: (assetId: string) => void;
}

export const VoyageTimeline: React.FC<VoyageTimelineProps> = ({ 
  expeditions, 
  assets,
  onSelectAsset 
}) => {
  const [selectedExpeditionId, setSelectedExpeditionId] = useState<string>(expeditions[0]?.id || 'exp-43-isea');

  const expedition = expeditions.find(e => e.id === selectedExpeditionId) || expeditions[0];
  const linkedAssets = assets.filter(a => expedition?.linkedAssetIds.includes(a.id));

  return (
    <div className="page-container py-12">
      {/* 1. KINDRED-PALETTE PAGE INTRO */}
      <div className="pb-10 border-b border-[var(--border)] mb-8">
        <div className="section-kicker">
          <span>01</span>
          <span>Explore</span>
        </div>
        <h1 className="editorial-title">
          Expeditions & <em className="font-serif italic font-normal text-[var(--signal)]">field voyages.</em>
        </h1>
        <p className="page-intro-desc">
          A closer look at the places, people, and questions behind India's polar field science. Follow each expedition to discover sequential waypoints, research activities, and official data records.
        </p>
      </div>

      {/* 2. EXPEDITION SELECTOR PILLS */}
      <div className="flex flex-wrap items-center gap-2 py-4 mb-8 border-b border-[var(--border)]">
        {expeditions.map((exp, idx) => {
          const isSelected = selectedExpeditionId === exp.id;
          return (
            <button
              key={exp.id}
              onClick={() => setSelectedExpeditionId(exp.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all flex items-center gap-2.5 cursor-pointer ${
                isSelected
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs'
                  : 'bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--secondary)] border border-[var(--border)]'
              }`}
            >
              <span className={`text-[10px] font-bold ${isSelected ? 'text-[var(--signal)]' : 'text-[var(--muted-foreground)]'}`}>
                0{idx + 1}
              </span>
              <span>{exp.title.split('—')[0]}</span>
            </button>
          );
        })}
      </div>

      {expedition && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
          {/* Left Column: Expedition Profile & Objectives (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-[var(--border)] bg-[var(--card)] rounded-xl p-6 shadow-xs">
              {/* Banner Image */}
              <div className="w-full h-48 rounded-lg overflow-hidden mb-5 relative group border border-[var(--border)]">
                <img 
                  src={expedition.bannerImage || '/assets/antarctica-hero.jpg'} 
                  alt={expedition.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--deep)]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[var(--card)] text-[var(--foreground)] text-[11px] font-mono border border-[var(--border)] font-bold shadow-xs">
                    {expedition.programme}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-600 text-white uppercase font-bold shadow-xs">
                    {expedition.status}
                  </span>
                </div>
              </div>

              {/* Title & Metadata */}
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">{expedition.title}</h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-4 font-normal">
                {expedition.publicSummary}
              </p>

              {/* Leader & Vessel Details (Facts List) */}
              <div className="border-t border-b border-[var(--border)] py-3 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted-foreground)] flex items-center">
                    <User className="w-3.5 h-3.5 mr-1.5 text-[var(--signal)]" /> Chief Scientist:
                  </span>
                  <span className="text-[var(--foreground)] font-semibold">{expedition.leadScientist}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted-foreground)] flex items-center">
                    <Ship className="w-3.5 h-3.5 mr-1.5 text-[var(--primary)]" /> Vessel / Base:
                  </span>
                  <span className="text-[var(--foreground)] font-semibold truncate max-w-[200px]">{expedition.vesselOrBase}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted-foreground)] flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-[var(--signal)]" /> Dates:
                  </span>
                  <span className="text-[var(--foreground)]">{expedition.startDate} to {expedition.endDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted-foreground)] flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-[var(--primary)]" /> Region:
                  </span>
                  <span className="text-[var(--foreground)]">{expedition.region}</span>
                </div>
              </div>

              {/* Scientific Objectives List */}
              <div className="mt-4">
                <div className="text-xs font-mono uppercase text-[var(--foreground)] font-bold tracking-wider mb-2 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  Key Scientific Objectives
                </div>
                <ul className="space-y-1.5">
                  {expedition.scientificObjectives.map((obj, i) => (
                    <li key={i} className="text-xs text-[var(--muted-foreground)] flex items-start gap-2 font-normal leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] mt-1.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Linked Research Assets Card */}
            {linkedAssets.length > 0 && (
              <div className="border border-[var(--border)] bg-[var(--card)] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2">
                  <span className="text-xs font-mono text-[var(--foreground)] font-bold uppercase tracking-wider flex items-center">
                    <Layers className="w-3.5 h-3.5 mr-1 text-[var(--signal)]" />
                    Linked Research Assets ({linkedAssets.length})
                  </span>
                  <span className="text-[10px] text-[var(--muted-foreground)] font-mono">FAIR Compliant</span>
                </div>

                <div className="space-y-2">
                  {linkedAssets.map((asset) => (
                    <div 
                      key={asset.id}
                      onClick={() => onSelectAsset && onSelectAsset(asset.id)}
                      className="p-3 rounded-lg border border-[var(--border)] bg-[var(--secondary)]/40 hover:bg-[var(--secondary)] cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--signal)] transition-colors">
                        <span className="truncate max-w-[240px]">{asset.title}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 ml-1 text-[var(--muted-foreground)] group-hover:text-[var(--signal)]" />
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[var(--muted-foreground)] font-mono">
                        <span className="uppercase px-1.5 py-0.5 rounded-md bg-[var(--card)] border border-[var(--border)]">
                          {asset.type}
                        </span>
                        <span>{asset.authoritativeProvider}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Waypoint Timeline (7 Cols) */}
          <div className="lg:col-span-7 border border-[var(--border)] bg-[var(--card)] rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
              <div>
                <h4 className="text-lg font-semibold text-[var(--foreground)]">Voyage Milestones & Field Stations</h4>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Sequential coordinates, sensor deployments, and ice operations</p>
              </div>
              <span className="text-xs font-mono text-[var(--foreground)] bg-[var(--secondary)] px-3 py-1 rounded-full border border-[var(--border)] font-semibold">
                {expedition.waypoints.length} Waypoints
              </span>
            </div>

            {/* Vertical Timeline Track */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--border)]">
              {expedition.waypoints.map((wp) => (
                <div key={wp.id} className="relative group">
                  {/* Waypoint Beacon Node */}
                  <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-[var(--card)] border-2 border-[var(--signal)] flex items-center justify-center group-hover:scale-125 transition-transform shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[var(--signal)]" />
                  </div>

                  {/* Waypoint Content Card */}
                  <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--secondary)]/30 group-hover:border-[var(--ring)] transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h5 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--signal)] transition-colors">
                        {wp.name}
                      </h5>
                      <div className="flex items-center space-x-2 text-[11px] font-mono text-[var(--muted-foreground)]">
                        <span>{wp.date}</span>
                        <span>•</span>
                        <span className="flex items-center text-[var(--foreground)] font-medium">
                          <MapPin className="w-3 h-3 mr-0.5 text-[var(--signal)]" />
                          {wp.latitude}°, {wp.longitude}°
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-3">
                      {wp.description}
                    </p>

                    {wp.scientificActivity && (
                      <div className="bg-[var(--card)] rounded-lg p-2.5 border border-[var(--border)] text-xs text-[var(--foreground)] flex items-start gap-2 shadow-2xs">
                        <Compass className="w-3.5 h-3.5 text-[var(--signal)] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[var(--foreground)]">Scientific Activity: </span>
                          <span className="text-[var(--muted-foreground)]">{wp.scientificActivity}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Standardized Bottom Container */}
      <div className="bottom-box-container">
        <div className="flex items-start gap-3.5">
          <FileCheck className="w-5 h-5 text-[var(--signal)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--foreground)]">Official Expedition Record & Data Stewardship</h4>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
              Coordinate waypoints, ice station measurements, and sensor deployments are logged under NCPOR scientific cruise summaries. For full access to CTD casts, bathymetric rasters, and raw sensor archives, consult the National Polar Data Centre.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
