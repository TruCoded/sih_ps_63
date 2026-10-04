import React from 'react';
import {
  Map,
  BookOpen,
  MessageSquare,
  Radio,
  Compass,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Navigation,
  Activity,
  Layers,
  Sparkles,
  Thermometer
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
}

const MODULES = [
  {
    id: 'expeditions',
    icon: Compass,
    badge: 'EXPEDITIONS',
    title: 'Voyage Explorer',
    desc: '44+ voyages with interactive routes, waypoints & field logs.',
    imgAlt: 'Red polar icebreaker expedition vessel navigating sea ice',
    imgSrc: '/assets/research-ship.jpg',
    color: '#0284c7',
  },
  {
    id: 'command',
    icon: Radio,
    badge: 'LIVE TELEMETRY',
    title: 'Station Telemetry',
    desc: 'Live IMD weather & solar sensors from India’s polar observatories.',
    imgAlt: 'India Bharati Research Station in Antarctica with satellite arrays',
    imgSrc: '/assets/bharati-station.jpg',
    color: '#d97706',
  },
  {
    id: 'catalogue',
    icon: BookOpen,
    badge: 'FAIR / CARE DATA',
    title: 'Knowledge Library',
    desc: 'Verified polar datasets, DOIs and provenance audit records.',
    imgAlt: 'Scientists conducting polar glaciology field research',
    imgSrc: '/assets/polar-station.jpg',
    color: '#0d9488',
  },
  {
    id: 'rag',
    icon: MessageSquare,
    badge: 'GROUNDED AI',
    title: 'PolarAI Assistant',
    desc: 'Citation-backed answers grounded in official NCPOR archives.',
    imgAlt: 'Antarctic blue glacier and icebergs panorama',
    imgSrc: '/assets/polar-hero-clear.jpg',
    color: '#7c3aed',
  },
];

const STATIONS = [
  { name: 'Maitri', loc: 'Antarctica (70°S)', temp: '-14.2°C', status: 'Online' },
  { name: 'Bharati', loc: 'Antarctica (69°S)', temp: '-11.8°C', status: 'Online' },
  { name: 'Himadri', loc: 'Arctic / Svalbard (78°N)', temp: '-8.4°C', status: 'Online' },
  { name: 'Himansh', loc: 'Himalayas (4,500m)', temp: '-18.6°C', status: 'Online' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <div className="pc-landing">

      {/* ── 1. CINEMATIC VISUAL HERO BANNER ───────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white border-b border-[var(--border)]">
        
        {/* Crystal Clear Hero Image Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/polar-hero-clear.jpg" 
            alt="Pristine Antarctic icebergs reflecting in calm polar waters" 
            className="w-full h-full object-cover object-center opacity-60 scale-100 transition-transform duration-1000 ease-out hover:scale-105"
          />
          {/* Subtle gradient overlay to ensure perfect readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 flex flex-col items-center text-center">
          
          {/* Project Identity Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-sky-200 mb-5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SMART INDIA HACKATHON 2024 &bull; PS-63</span>
            <span className="text-white/40">|</span>
            <span className="text-slate-300">MoES / NCPOR</span>
          </div>

          {/* Majestic Project Name */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-3">
            POLAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-200">CONNECT</span>
          </h1>

          <p className="text-lg sm:text-2xl font-semibold text-slate-200 max-w-2xl tracking-tight mb-3">
            India's Unified Polar Science &amp; Telemetry Platform
          </p>

          <p className="text-sm sm:text-base text-slate-300/90 max-w-xl mb-8 leading-relaxed">
            Direct access to Antarctica, Arctic and Himalayan expeditions, live sensor telemetry, and verified scientific datasets.
          </p>

          {/* Direct Visual Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <button
              onClick={() => onNavigate('expeditions')}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg hover:shadow-sky-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Expeditions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('rag')}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Ask PolarAI</span>
            </button>
          </div>

          {/* Live Station Status Pills */}
          <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {STATIONS.map((st) => (
              <div 
                key={st.name}
                onClick={() => onNavigate('command')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all text-left cursor-pointer group"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{st.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono">{st.loc}</div>
                </div>
                <div className="text-xs font-mono font-bold text-sky-300 flex items-center">
                  <Thermometer className="w-3 h-3 text-sky-400 mr-0.5" />
                  {st.temp}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 2. VISUAL MODULE CARDS WITH CLEAR IMAGERY ───────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
              Explore the Platform
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              Select an area to explore field logs, live readings, or datasets
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-[var(--muted-foreground)] uppercase hidden sm:inline">
            4 Core Modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onNavigate(mod.id)}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer text-left"
              >
                {/* Clear High-Resolution Image Container */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={mod.imgSrc}
                    alt={mod.imgAlt}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Pill Tag */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {mod.badge}
                  </span>

                  {/* Icon wrap */}
                  <div 
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-white backdrop-blur-md"
                    style={{ backgroundColor: `${mod.color}cc` }}
                  >
                    <Icon size={16} />
                  </div>
                </div>

                {/* Card Content - Clean & Concise */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-sky-600 transition-colors mb-1.5">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-bold" style={{ color: mod.color }}>
                    <span>Launch</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3. VISUAL 3-STEP FLOW (LESS TEXT, MORE CLARITY) ────────────────── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[var(--border)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => onNavigate('expeditions')}
            className="flex items-start gap-4 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-sky-400 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-600 font-mono font-black text-sm flex items-center justify-center shrink-0">
              01
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--foreground)]">Track Expeditions</h4>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Explore voyage routes, Antarctic waypoints &amp; stations.</p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('catalogue')}
            className="flex items-start gap-4 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-teal-400 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-400/30 text-teal-600 font-mono font-black text-sm flex items-center justify-center shrink-0">
              02
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--foreground)]">Access FAIR Data</h4>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Search verified datasets with DOI and W3C PROV-O audit trails.</p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('rag')}
            className="flex items-start gap-4 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/30 text-indigo-600 font-mono font-black text-sm flex items-center justify-center shrink-0">
              03
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--foreground)]">Ask Grounded AI</h4>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Receive page-cited answers from the official NCPOR corpus.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
