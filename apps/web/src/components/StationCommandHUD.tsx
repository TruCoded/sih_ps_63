import React, { useState } from 'react';
import { 
  Thermometer, 
  Wind, 
  Gauge, 
  Sun, 
  MapPin, 
  Compass, 
  Radio, 
  ShieldCheck, 
  Clock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { StationTelemetry, PolarProgramme } from '../../../../packages/shared-types/index.js';

interface StationCommandHUDProps {
  stations: StationTelemetry[];
  onSelectExpeditionByProgramme?: (prog: PolarProgramme) => void;
}

// ─── Real Polar Stereographic Projection ─────────────────────────────────────
// Uses azimuthal stereographic math: r = 2·R·tan((90° - |lat|) / 2)
// South-pole view (left panel): Maitri, Bharati, Dakshin Gangotri
// North-pole view (right panel): Himadri (Svalbard), Himansh (Himalaya)

interface PolarMapProps {
  stations: StationTelemetry[];
  selectedStationId: string;
  onSelectStation: (id: string) => void;
}

function polarProject(lat: number, lon: number, poleLat: number, size: number): { x: number; y: number } {
  const R = size * 0.46; // max radius = 46% of panel half-width
  const latRad = (Math.abs(lat - poleLat) * Math.PI) / 180; // angular distance from pole
  const lonRad = (lon * Math.PI) / 180;
  const r = 2 * Math.tan(latRad / 2) * R;
  // For south pole: flip lon direction
  const sign = poleLat < 0 ? -1 : 1;
  return {
    x: size / 2 + sign * r * Math.sin(lonRad),
    y: size / 2 - r * Math.cos(lonRad),
  };
}

function GraticuleRings({ cx, cy, R }: { cx: number; cy: number; R: number }) {
  // Rings at 80°, 70°, 60° from pole
  const rings = [10, 20, 30].map(deg => {
    const r = 2 * Math.tan((deg * Math.PI) / 180 / 2) * R;
    return r;
  });
  const meridians = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <>
      {rings.map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke="currentColor" strokeWidth="0.5"
          strokeDasharray={i === 2 ? '3 3' : '2 4'} />
      ))}
      {meridians.map(deg => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={deg}
            x1={cx} y1={cy}
            x2={cx + Math.sin(rad) * rings[2]}
            y2={cy - Math.cos(rad) * rings[2]}
            stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 5" />
        );
      })}
    </>
  );
}

const PolarStereographicMap: React.FC<PolarMapProps> = ({ stations, selectedStationId, onSelectStation }) => {
  const W = 700; const H = 320;
  const leftCx = W * 0.27; const rightCx = W * 0.73; const cy = H / 2;
  const R = H * 0.44;

  // Classify stations by hemisphere
  const southStations = stations.filter(s => s.latitude < 0);
  const northStations = stations.filter(s => s.latitude >= 0);

  const renderMarker = (st: StationTelemetry, proj: { x: number; y: number }, offsetX = 0) => {
    const isSelected = st.stationId === selectedStationId;
    const isActive = st.status === 'active';
    const cx2 = proj.x + offsetX;
    const label = st.name.replace(' Station', '').replace(' Research Station', '').replace(' Station', '');
    return (
      <g key={st.stationId} onClick={() => onSelectStation(st.stationId)} style={{ cursor: 'pointer' }}>
        {/* Pulse ring when selected */}
        {isSelected && (
          <circle cx={cx2} cy={proj.y} r="12" fill="none"
            stroke="#f97316" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
        {/* Outer glow */}
        <circle cx={cx2} cy={proj.y} r="8"
          fill={isSelected ? '#f9731620' : '#ffffff10'}
          stroke={isSelected ? '#f97316' : '#94a3b8'}
          strokeWidth={isSelected ? 1.5 : 1} />
        {/* Inner dot */}
        <circle cx={cx2} cy={proj.y} r={isActive ? 4 : 3}
          fill={isSelected ? '#f97316' : isActive ? '#22c55e' : '#64748b'} />
        {/* Label */}
        <text x={cx2} y={proj.y + 17} textAnchor="middle"
          fontSize="8" fill={isSelected ? '#f97316' : '#64748b'}
          fontFamily="monospace" fontWeight={isSelected ? 'bold' : 'normal'}>
          {label.length > 10 ? label.slice(0, 10) : label}
        </text>
      </g>
    );
  };

  return (
    <div className="relative w-full rounded-xl border border-[var(--border)] bg-[var(--secondary)] overflow-hidden" style={{ height: 320 }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
        className="text-[var(--foreground)]/15">

        {/* Background */}
        <rect width={W} height={H} fill="transparent" />

        {/* Divider */}
        <line x1={W / 2} y1={12} x2={W / 2} y2={H - 12}
          stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />

        {/* ── SOUTH POLE PANEL (Antarctica) ── */}
        <GraticuleRings cx={leftCx} cy={cy} R={R} />
        {/* Ocean fill */}
        <circle cx={leftCx} cy={cy} r={R * 0.67} fill="#1e3a5f" opacity="0.12" />
        {/* Antarctica rough outline (simplified polygon at ~70°S boundary) */}
        <path
          d={`M ${leftCx + R * 0.25} ${cy - R * 0.05}
              L ${leftCx + R * 0.38} ${cy + R * 0.22}
              L ${leftCx + R * 0.18} ${cy + R * 0.42}
              L ${leftCx - R * 0.05} ${cy + R * 0.48}
              L ${leftCx - R * 0.28} ${cy + R * 0.40}
              L ${leftCx - R * 0.44} ${cy + R * 0.18}
              L ${leftCx - R * 0.36} ${cy - R * 0.08}
              L ${leftCx - R * 0.14} ${cy - R * 0.22}
              L ${leftCx + R * 0.10} ${cy - R * 0.20}
              Z`}
          fill="#e2e8f0" fillOpacity="0.25" stroke="#94a3b8" strokeWidth="0.8" />

        {/* South station markers */}
        {southStations.map(st => {
          const proj = polarProject(st.latitude, st.longitude, -90, H);
          return renderMarker(st, { x: proj.x - H / 2 + leftCx, y: proj.y }, 0);
        })}

        {/* Panel label */}
        <text x={leftCx} y={H - 8} textAnchor="middle" fontSize="9"
          fill="#64748b" fontFamily="monospace">
          South Polar — 60°S→90°S
        </text>

        {/* ── NORTH POLE PANEL (Arctic / Himalaya) ── */}
        <GraticuleRings cx={rightCx} cy={cy} R={R} />
        {/* Arctic ocean fill */}
        <circle cx={rightCx} cy={cy} r={R * 0.55} fill="#1e3a5f" opacity="0.12" />

        {/* North station markers */}
        {northStations.map(st => {
          // Himalaya (Himansh ~32°N) is not truly polar — place it on North panel at correct r
          const proj = polarProject(st.latitude, st.longitude, 90, H);
          return renderMarker(st, { x: proj.x - H / 2 + rightCx, y: proj.y }, 0);
        })}

        {/* Panel label */}
        <text x={rightCx} y={H - 8} textAnchor="middle" fontSize="9"
          fill="#64748b" fontFamily="monospace">
          North Polar — 30°N→90°N
        </text>

        {/* Pole markers */}
        <circle cx={leftCx} cy={cy} r="3" fill="#f97316" opacity="0.8" />
        <text x={leftCx + 5} y={cy + 4} fontSize="7" fill="#f97316" fontFamily="monospace">90°S</text>
        <circle cx={rightCx} cy={cy} r="3" fill="#3b82f6" opacity="0.8" />
        <text x={rightCx + 5} y={cy + 4} fontSize="7" fill="#3b82f6" fontFamily="monospace">90°N</text>
      </svg>

      {/* Corner labels */}
      <div className="absolute top-2 left-3 text-[10px] font-mono text-[var(--muted-foreground)] bg-[var(--card)] px-2 py-0.5 rounded-full border border-[var(--border)]">
        WGS84 · Azimuthal Stereographic
      </div>
      <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[10px] font-mono text-[var(--muted-foreground)]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
        Live AWS
      </div>
    </div>
  );
};



export const StationCommandHUD: React.FC<StationCommandHUDProps> = ({ 
  stations,
  onSelectExpeditionByProgramme 
}) => {
  const [selectedStationId, setSelectedStationId] = useState<string>(stations[0]?.stationId || 'st-maitri');
  const [filterRegion, setFilterRegion] = useState<string>('All');

  const selectedStation = stations.find(s => s.stationId === selectedStationId) || stations[0];

  const filteredStations = filterRegion === 'All' 
    ? stations 
    : stations.filter(s => s.programme.toLowerCase() === filterRegion.toLowerCase());

  // Simulated diurnal trend for selected station
  const generateTrend = (baseTemp: number) => {
    const points = [];
    for (let i = 0; i < 24; i += 2) {
      const val = baseTemp + Math.sin((i / 24) * Math.PI * 2) * 2.5;
      points.push({ hour: `${i}:00`, temp: Number(val.toFixed(1)) });
    }
    return points;
  };

  const trendData = selectedStation ? generateTrend(selectedStation.temperatureC) : [];

  return (
    <div className="page-container py-12">
      {/* 1. KINDRED-PALETTE PAGE INTRO WITH HUD DEFINITION */}
      <div className="pb-10 border-b border-[var(--border)] mb-8">
        <div className="section-kicker">
          <span>05</span>
          <span>Observatories</span>
        </div>
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="editorial-title">
            Station Command <em className="font-serif italic font-normal text-[var(--signal)]">HUD.</em>
          </h1>
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] shadow-2xs hover:border-[var(--signal)] hover:bg-[var(--card)] hover:scale-105 transition-all cursor-help"
            title="Heads-Up Display: A real-time scientific telemetry console delivering immediate situational awareness across India's polar observatories"
          >
            <Radio className="w-3 h-3 text-[var(--signal)] animate-pulse" />
            <strong>HUD:</strong> Heads-Up Display Console
          </span>
        </div>
        <p className="text-[var(--muted-foreground)] text-sm sm:text-base leading-relaxed max-w-3xl mt-3 font-normal">
          <span className="font-semibold text-[var(--foreground)]">What is a HUD?</span> The <em>Heads-Up Display</em> is an integrated polar telemetry console delivering live automatic weather station (AWS) feeds, atmospheric barometric pressures, ultrasonic wind vectors, and pyranometer solar flux directly from <strong>Maitri</strong>, <strong>Bharati</strong>, <strong>Himadri</strong>, and <strong>Himansh</strong>.
        </p>
      </div>

      {/* 2. REGION SELECTOR PILLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-[var(--muted-foreground)] font-mono text-[11px] uppercase mr-1">Filter Programme:</span>
          {['All', 'Antarctica', 'Arctic', 'Himalayas'].map(region => (
            <button
              key={region}
              onClick={() => setFilterRegion(region)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
                filterRegion === region
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs'
                  : 'bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--secondary)] border border-[var(--border)]'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted-foreground)]">
          <span className="w-2 h-2 rounded-full bg-[var(--signal)] animate-pulse"></span>
          <span>Direct AWS Satellite Sync</span>
        </div>
      </div>

      {/* 3. MAIN GRID: MAP + TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
        {/* Left Column: Geographic Command Map (7 Cols) */}
        <div className="lg:col-span-7 border border-[var(--border)] bg-[var(--card)] rounded-xl p-6 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[var(--signal)]" />
              <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider font-mono">
                Polar Stereographic Projection
              </span>
            </div>
            <span className="text-[11px] font-mono text-[var(--foreground)] bg-[var(--secondary)] px-3 py-1 rounded-full border border-[var(--border)]">
              WGS84 • Vector Grid
            </span>
          </div>

          {/* Real Polar Stereographic SVG Map */}
          <PolarStereographicMap
            stations={filteredStations}
            selectedStationId={selectedStationId}
            onSelectStation={setSelectedStationId}
          />

          {/* Station Quick Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            {stations.map(st => {
              const isSelected = st.stationId === selectedStationId;
              return (
                <button
                  key={st.stationId}
                  onClick={() => setSelectedStationId(st.stationId)}
                  className={`p-3 rounded-lg text-left transition-all duration-300 border cursor-pointer hover:-translate-y-1 hover:shadow-md ${
                    isSelected
                      ? 'bg-[var(--secondary)] border-[var(--signal)] shadow-sm -translate-y-0.5 ring-1 ring-[var(--signal)]/40'
                      : 'bg-[var(--card)] border-[var(--border)] hover:bg-[var(--secondary)] hover:border-[var(--signal)]/60'
                  }`}
                >
                  <div className="text-[11px] font-semibold text-[var(--foreground)] truncate">{st.name}</div>
                  <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)] mt-1 font-mono">
                    <span>{st.programme}</span>
                    <span className={st.temperatureC < -10 ? 'text-[var(--primary)] font-bold' : 'text-[var(--signal)] font-bold'}>
                      {st.temperatureC}°C
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Telemetry Readout HUD (5 Cols) */}
        {selectedStation && (
          <div className="lg:col-span-5 border border-[var(--border)] bg-[var(--card)] rounded-xl p-6 flex flex-col justify-between shadow-xs">
            <div>
              {/* Station Identity Header */}
              <div className="flex items-start justify-between mb-4 border-b border-[var(--border)] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--foreground)] text-[10px] font-mono border border-[var(--border)] uppercase font-semibold">
                      {selectedStation.programme}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border uppercase ${
                      selectedStation.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 font-bold' 
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}>
                      {selectedStation.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mt-2">{selectedStation.name}</h3>
                  <div className="flex items-center text-xs text-[var(--muted-foreground)] space-x-3 mt-1 font-mono">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-[var(--signal)]" />
                      {selectedStation.latitude}°, {selectedStation.longitude}°
                    </span>
                    <span>Elev: {selectedStation.altitudeMeters}m</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-[var(--muted-foreground)] font-mono">ESTABLISHED</div>
                  <div className="text-lg font-bold text-[var(--foreground)] font-mono">{selectedStation.establishedYear}</div>
                </div>
              </div>

              {/* Big Sensor Gauge Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {/* Temperature */}
                <div className="bg-[var(--secondary)] rounded-xl p-3.5 border border-[var(--border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[var(--signal)] hover:bg-[var(--card)] cursor-default group">
                  <div className="flex items-center text-[var(--muted-foreground)] text-xs mb-1">
                    <Thermometer className="w-3.5 h-3.5 mr-1 text-[var(--signal)] group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-[var(--foreground)] transition-colors">Surface Air Temp</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[var(--foreground)]">
                    {selectedStation.temperatureC}°C
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5 font-mono">Pt100 RTD Sensor</div>
                </div>

                {/* Wind */}
                <div className="bg-[var(--secondary)] rounded-xl p-3.5 border border-[var(--border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[var(--primary)] hover:bg-[var(--card)] cursor-default group">
                  <div className="flex items-center text-[var(--muted-foreground)] text-xs mb-1">
                    <Wind className="w-3.5 h-3.5 mr-1 text-[var(--primary)] group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-[var(--foreground)] transition-colors">Wind Velocity</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[var(--foreground)]">
                    {selectedStation.windSpeedKnots} <span className="text-xs font-normal">kts</span>
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5 font-mono">Dir: {selectedStation.windDirectionDeg}° Ultrasonic</div>
                </div>

                {/* Pressure */}
                <div className="bg-[var(--secondary)] rounded-xl p-3.5 border border-[var(--border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500 hover:bg-[var(--card)] cursor-default group">
                  <div className="flex items-center text-[var(--muted-foreground)] text-xs mb-1">
                    <Gauge className="w-3.5 h-3.5 mr-1 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-[var(--foreground)] transition-colors">Barometric Pressure</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[var(--foreground)]">
                    {selectedStation.pressureHpa} <span className="text-xs font-normal">hPa</span>
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5 font-mono">Digital Barometer</div>
                </div>

                {/* Solar Radiation */}
                <div className="bg-[var(--secondary)] rounded-xl p-3.5 border border-[var(--border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500 hover:bg-[var(--card)] cursor-default group">
                  <div className="flex items-center text-[var(--muted-foreground)] text-xs mb-1">
                    <Sun className="w-3.5 h-3.5 mr-1 text-amber-600 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-[var(--foreground)] transition-colors">Solar Flux</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[var(--foreground)]">
                    {selectedStation.solarRadiationWm2} <span className="text-xs font-normal">W/m²</span>
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5 font-mono">Pyranometer Array</div>
                </div>
              </div>

              {/* Diurnal Trend Chart */}
              <div className="bg-[var(--secondary)]/60 rounded-xl p-4 border border-[var(--border)] transition-all duration-300 hover:shadow-md hover:border-[var(--signal)]/50 hover:bg-[var(--card)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[var(--foreground)] font-semibold flex items-center">
                    <Layers className="w-3 h-3 mr-1 text-[var(--signal)]" />
                    24h Diurnal Temperature Trend
                  </span>
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)]">Modelled AWS Fit</span>
                </div>

                {/* Mini SVG / CSS Bar Chart */}
                <div className="h-16 flex items-end gap-1 pt-2">
                  {trendData.map((pt, i) => {
                    const minTemp = -35;
                    const maxTemp = 5;
                    const heightPercent = Math.max(15, Math.min(100, ((pt.temp - minTemp) / (maxTemp - minTemp)) * 100));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group relative">
                        <div 
                          style={{ height: `${heightPercent}%` }} 
                          className="w-full bg-[var(--primary)]/60 group-hover:bg-[var(--signal)] rounded-t-sm transition-all"
                        />
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-7 bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-[10px] font-mono px-2 py-0.5 rounded-md pointer-events-none transition-opacity shadow-xs z-20">
                          {pt.temp}°C
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[var(--muted-foreground)] mt-1.5">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="border-t border-[var(--border)] pt-4 mt-4 flex items-center justify-between">
              <div className="text-[11px] font-mono text-[var(--muted-foreground)] flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-[var(--signal)]" />
                <span>Last Telemetry Sync: Just now</span>
              </div>

              {onSelectExpeditionByProgramme && (
                <button
                  onClick={() => onSelectExpeditionByProgramme(selectedStation.programme)}
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--deep)] text-[var(--primary-foreground)] font-mono text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>Explore {selectedStation.programme} Voyages</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Standardized Bottom Container */}
      <div className="bottom-box-container">
        <div className="flex items-start gap-3.5">
          <Radio className="w-5 h-5 text-[var(--signal)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--foreground)]">High-Latitude Automatic Weather Station (AWS) Synchronization</h4>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
              Telemetry streams continuously via INSAT/Iridium satellite links directly from Maitri, Bharati, Himadri, and IndARC into the NCPOR / NPDC centralized data repository. All records adhere to WMO (World Meteorological Organization) standards for polar observational metadata.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
