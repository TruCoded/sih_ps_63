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
  FileCheck,
  Radio,
  Snowflake,
  Anchor,
  Activity,
  Globe2
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

  // Determine a crisp, authentic polar image for the selected expedition
  const getExpeditionImage = (exp: Expedition) => {
    const text = (exp.id + ' ' + exp.title + ' ' + exp.programme + ' ' + exp.region).toLowerCase();
    if (text.includes('arctic') || text.includes('svalbard') || text.includes('himadri')) {
      return '/assets/polar-hero-clear.jpg';
    }
    if (text.includes('himalaya') || text.includes('himansh') || text.includes('chandra')) {
      return '/assets/himansh-himalayas.jpg';
    }
    if (text.includes('ocean') || text.includes('sagar nidhi') || text.includes('soe')) {
      return '/assets/research-ship.jpg';
    }
    // Default Antarctic expedition (43-ISEA)
    return '/assets/bharati-station.jpg';
  };

  return (
    <div className="page-container py-10">
      
      {/* ── 1. POLAR EXPEDITION BANNER & INTRO ───────────────────────────────── */}
      <div className="pb-8 border-b border-[var(--border)] mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-400/30">
            <Snowflake className="w-3.5 h-3.5 text-sky-500 animate-spin-slow" />
            <span>POLAR FIELD TRAVERSES &bull; INDIA EXPEDITION LOGS</span>
          </div>
          <div className="text-xs font-mono text-[var(--muted-foreground)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NCPOR Polar Flight &amp; Ice-Breaker Registry</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
          Voyage Explorer &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-600 to-indigo-600">Field Stations</span>
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-2 max-w-2xl leading-relaxed">
          Follow historical and active Indian polar science voyages across Antarctica, the Arctic, the Southern Ocean, and the High Himalayas. Trace sequential waypoints, ice conditions, sensor deployments, and scientific outputs.
        </p>
      </div>

      {/* ── 2. POLAR EXPEDITION SELECTOR STRIP ───────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2.5 p-2 rounded-2xl bg-[var(--card)] border border-[var(--border)] mb-8 shadow-xs overflow-x-auto">
        {expeditions.map((exp, idx) => {
          const isSelected = selectedExpeditionId === exp.id;
          return (
            <button
              key={exp.id}
              onClick={() => setSelectedExpeditionId(exp.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-slate-900 text-sky-300 font-bold border border-sky-400/40 shadow-sm'
                  : 'bg-transparent text-[var(--foreground)] hover:bg-[var(--secondary)] border border-transparent'
              }`}
            >
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isSelected ? 'bg-sky-500/20 text-sky-300' : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'
              }`}>
                0{idx + 1}
              </span>
              <span>{exp.title.split('—')[0]}</span>
            </button>
          );
        })}
      </div>

      {expedition && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-4">
          
          {/* ── LEFT COLUMN: EXPEDITION PROFILE & OBJECTIVES (5 COLS) ───────── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-[var(--border)] bg-[var(--card)] rounded-2xl p-6 shadow-sm overflow-hidden">
              
              {/* Polar Hero Banner Image */}
              <div className="w-full h-56 rounded-xl overflow-hidden mb-5 relative group border border-[var(--border)] bg-slate-950">
                <img 
                  src={getExpeditionImage(expedition)} 
                  alt={expedition.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-sky-300 text-[10px] font-mono border border-sky-400/30 font-bold shadow-sm flex items-center gap-1.5">
                    <Snowflake className="w-3 h-3 text-sky-400" />
                    {expedition.programme}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-200 truncate max-w-[200px]">
                    {expedition.region}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/90 text-white uppercase font-bold shadow-xs">
                    {expedition.status}
                  </span>
                </div>
              </div>

              {/* Title & Summary */}
              <h3 className="text-xl font-black text-[var(--foreground)] tracking-tight mb-2">
                {expedition.title}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-5 font-normal">
                {expedition.publicSummary}
              </p>

              {/* Polar Technical Facts List */}
              <div className="rounded-xl bg-[var(--secondary)]/40 border border-[var(--border)] p-4 space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted-foreground)] flex items-center">
                    <User className="w-3.5 h-3.5 mr-2 text-sky-600" /> Chief Scientist:
                  </span>
                  <span className="text-[var(--foreground)] font-bold">{expedition.leadScientist}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted-foreground)] flex items-center">
                    <Ship className="w-3.5 h-3.5 mr-2 text-teal-600" /> Vessel / Base:
                  </span>
                  <span className="text-[var(--foreground)] font-bold truncate max-w-[210px]">{expedition.vesselOrBase}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted-foreground)] flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-2 text-indigo-600" /> Expedition Period:
                  </span>
                  <span className="text-[var(--foreground)] font-semibold">{expedition.startDate} &bull; {expedition.endDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted-foreground)] flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-amber-600" /> Sector:
                  </span>
                  <span className="text-[var(--foreground)] font-semibold">{expedition.region}</span>
                </div>
              </div>

              {/* Key Scientific Objectives */}
              <div className="mt-6">
                <div className="text-xs font-mono uppercase text-[var(--foreground)] font-bold tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Scientific Objectives</span>
                </div>
                <ul className="space-y-2">
                  {expedition.scientificObjectives.map((obj, i) => (
                    <li key={i} className="text-xs text-[var(--muted-foreground)] flex items-start gap-2.5 font-normal leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Linked Research Assets Card */}
            {linkedAssets.length > 0 && (
              <div className="border border-[var(--border)] bg-[var(--card)] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2.5">
                  <span className="text-xs font-mono text-[var(--foreground)] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                    Linked Datasets &amp; Evidence ({linkedAssets.length})
                  </span>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    FAIR Verified
                  </span>
                </div>

                <div className="space-y-2.5">
                  {linkedAssets.map((asset) => (
                    <div 
                      key={asset.id}
                      onClick={() => onSelectAsset && onSelectAsset(asset.id)}
                      className="p-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)]/30 hover:bg-[var(--secondary)] hover:border-sky-400 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-[var(--foreground)] group-hover:text-sky-600 transition-colors">
                        <span className="truncate max-w-[240px]">{asset.title}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 ml-1 text-[var(--muted-foreground)] group-hover:text-sky-600" />
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[var(--muted-foreground)] font-mono">
                        <span className="uppercase px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] font-bold">
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

          {/* ── RIGHT COLUMN: POLAR NAUTICAL WAYPOINT TIMELINE (7 COLS) ────── */}
          <div className="lg:col-span-7 border border-[var(--border)] bg-[var(--card)] rounded-2xl p-6 sm:p-8 shadow-sm">
            
            {/* Polar Nautical Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-[var(--border)] pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-sky-600 animate-spin" style={{ animationDuration: '24s' }} />
                  <h4 className="text-lg font-black text-[var(--foreground)] tracking-tight">
                    Voyage Milestones &amp; Polar Stations
                  </h4>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 font-mono">
                  Coordinates, High-Latitude Field Operations &bull; Antarctic Grid
                </p>
              </div>
              <span className="text-xs font-mono text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-3 py-1.5 rounded-full border border-sky-200 dark:border-sky-800 font-bold flex items-center gap-1.5">
                <Anchor className="w-3.5 h-3.5 text-sky-600" />
                {expedition.waypoints.length} Polar Waypoints
              </span>
            </div>

            {/* Vertical Polar Timeline Track with Glowing Azure Line */}
            <div className="relative pl-7 sm:pl-9 space-y-7 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-[3px] before:bg-gradient-to-b before:from-sky-500 before:via-teal-400 before:to-indigo-500 before:rounded-full">
              {expedition.waypoints.map((wp, index) => (
                <div key={wp.id} className="relative group">
                  
                  {/* Glowing Polar Waypoint Node */}
                  <div className="absolute -left-7 sm:-left-9 top-1.5 w-7 h-7 rounded-full bg-slate-900 border-2 border-sky-400 flex items-center justify-center group-hover:scale-125 transition-transform shadow-md shadow-sky-500/30">
                    <span className="text-[10px] font-mono font-black text-sky-300">
                      {index + 1}
                    </span>
                  </div>

                  {/* Polar Waypoint Card with Frosted Icy Styling */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-[var(--secondary)]/30 group-hover:border-sky-400 group-hover:shadow-md transition-all">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
                      <h5 className="text-base font-bold text-[var(--foreground)] group-hover:text-sky-600 transition-colors">
                        {wp.name}
                      </h5>
                      <div className="flex items-center space-x-2 text-[11px] font-mono">
                        <span className="text-[var(--muted-foreground)]">{wp.date}</span>
                        <span className="text-[var(--border)]">&bull;</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 font-bold">
                          <MapPin className="w-3 h-3 mr-1 text-sky-600" />
                          {wp.latitude}&deg;, {wp.longitude}&deg;
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-3.5">
                      {wp.description}
                    </p>

                    {/* Scientific Activity - Styled like an authentic Polar Field Log */}
                    {wp.scientificActivity && (
                      <div className="p-3 rounded-xl bg-sky-500/10 border-l-4 border-sky-500 text-xs">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1.5 mb-1">
                          <Activity className="w-3.5 h-3.5" />
                          <span>Scientific Field Operations:</span>
                        </div>
                        <div className="text-slate-700 dark:text-slate-200 font-medium">
                          {wp.scientificActivity}
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

    </div>
  );
};
