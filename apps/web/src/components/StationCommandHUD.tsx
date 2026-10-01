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
      {/* 1. KINDRED-PALETTE PAGE INTRO */}
      <div className="pb-10 border-b border-[var(--border)] mb-8">
        <div className="section-kicker">
          <span>05</span>
          <span>Observatories</span>
        </div>
        <h1 className="editorial-title">
          Station Command <em className="font-serif italic font-normal text-[var(--signal)]">HUD.</em>
        </h1>
        <p className="text-[var(--muted-foreground)] text-sm sm:text-base leading-relaxed max-w-2xl mt-3 font-normal">
          Real-time automatic weather station (AWS) feeds, barometric pressures, and high-latitude environmental telemetry across Maitri, Bharati, Himadri, and Himansh.
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

          {/* Stylized Polar Projection Canvas */}
          <div className="relative w-full h-[360px] bg-[var(--secondary)] rounded-xl border border-[var(--border)] flex items-center justify-center overflow-hidden">
            {/* Latitude Grid Circles */}
            <svg className="absolute inset-0 w-full h-full text-[var(--foreground)]/10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="none" />
              <circle cx="50%" cy="50%" r="35%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="50%" cy="50%" r="22%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="50%" cy="50%" r="10%" fill="none" stroke="currentColor" strokeWidth="1" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
            </svg>

            {/* Central Polar Axis Label */}
            <div className="absolute top-3 left-3 text-[10px] font-mono text-[var(--muted-foreground)] bg-[var(--card)] px-2.5 py-1 rounded-full border border-[var(--border)] shadow-2xs">
              Lat: -90°S to +90°N • Station Array
            </div>

            {/* Interactive Station Markers */}
            <div className="relative w-full h-full">
              {filteredStations.map((st) => {
                const isSelected = st.stationId === selectedStationId;
                
                let posX = '50%';
                let posY = '50%';
                if (st.stationId === 'st-maitri') {
                  posX = '42%';
                  posY = '72%';
                } else if (st.stationId === 'st-bharati') {
                  posX = '68%';
                  posY = '76%';
                } else if (st.stationId === 'st-himadri') {
                  posX = '52%';
                  posY = '22%';
                } else if (st.stationId === 'st-himansh') {
                  posX = '74%';
                  posY = '45%';
                } else if (st.stationId === 'st-dg') {
                  posX = '36%';
                  posY = '68%';
                }

                return (
                  <div
                    key={st.stationId}
                    style={{ left: posX, top: posY }}
                    onClick={() => setSelectedStationId(st.stationId)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                  >
                    {/* Beacon Node */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-[var(--signal)]/20 ring-2 ring-[var(--signal)] scale-110' 
                        : 'bg-[var(--card)]/90 hover:bg-[var(--card)] border border-[var(--border)] shadow-xs'
                    }`}>
                      <div className={`w-3.5 h-3.5 rounded-full ${
                        st.status === 'active' 
                          ? isSelected ? 'bg-[var(--signal)] ring-2 ring-white animate-pulse' : 'bg-[var(--signal)]' 
                          : 'bg-slate-400'
                      }`} />
                    </div>

                    {/* Floating Station Tag */}
                    <div className={`absolute left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap transition-all shadow-md ${
                      isSelected
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-bold scale-105'
                        : 'bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] group-hover:border-[var(--ring)]'
                    }`}>
                      {st.name.replace(' Station', '').replace(' Research', '')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Station Quick Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            {stations.map(st => {
              const isSelected = st.stationId === selectedStationId;
              return (
                <button
                  key={st.stationId}
                  onClick={() => setSelectedStationId(st.stationId)}
                  className={`p-3 rounded-lg text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--secondary)] border-[var(--signal)] shadow-xs'
                      : 'bg-[var(--card)] border-[var(--border)] hover:bg-[var(--secondary)]'
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
                <div className="bg-[var(--secondary)] rounded-xl p-3.5 border border-[var(--border)]">
                  <div className="flex items-center text-[var(--muted-foreground)] text-xs mb-1">
                    <Thermometer className="w-3.5 h-3.5 mr-1 text-[var(--signal)]" />
                    <span>Surface Air Temp</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[var(--foreground)]">
                    {selectedStation.temperatureC}°C
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5 font-mono">Pt100 RTD Sensor</div>
                </div>

                {/* Wind */}
                <div className="bg-[var(--secondary)] rounded-xl p-3.5 border border-[var(--border)]">
                  <div className="flex items-center text-[var(--muted-foreground)] text-xs mb-1">
                    <Wind className="w-3.5 h-3.5 mr-1 text-[var(--primary)]" />
                    <span>Wind Velocity</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[var(--foreground)]">
                    {selectedStation.windSpeedKnots} <span className="text-xs font-normal">kts</span>
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5 font-mono">Dir: {selectedStation.windDirectionDeg}° Ultrasonic</div>
                </div>

                {/* Pressure */}
                <div className="bg-[var(--secondary)] rounded-xl p-3.5 border border-[var(--border)]">
                  <div className="flex items-center text-[var(--muted-foreground)] text-xs mb-1">
                    <Gauge className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    <span>Barometric Pressure</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[var(--foreground)]">
                    {selectedStation.pressureHpa} <span className="text-xs font-normal">hPa</span>
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5 font-mono">Digital Barometer</div>
                </div>

                {/* Solar Radiation */}
                <div className="bg-[var(--secondary)] rounded-xl p-3.5 border border-[var(--border)]">
                  <div className="flex items-center text-[var(--muted-foreground)] text-xs mb-1">
                    <Sun className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    <span>Solar Flux</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[var(--foreground)]">
                    {selectedStation.solarRadiationWm2} <span className="text-xs font-normal">W/m²</span>
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5 font-mono">Pyranometer Array</div>
                </div>
              </div>

              {/* Diurnal Trend Chart */}
              <div className="bg-[var(--secondary)]/60 rounded-xl p-4 border border-[var(--border)]">
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
            <div className="border-t border-[var(--border)] pt-4 mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-[11px] font-mono text-[var(--muted-foreground)] flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-[var(--signal)] shrink-0" />
                <span>Last Telemetry Sync: Just now</span>
              </div>

              {onSelectExpeditionByProgramme && (
                <button
                  onClick={() => onSelectExpeditionByProgramme(selectedStation.programme)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--deep)] active:bg-[var(--deep)] text-[var(--primary-foreground)] font-mono text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer min-h-[40px]"
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
