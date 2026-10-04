import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-main page-container">
        <div>
          <div className="brand footer-brand flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-400">
              <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" fill="none"/>
                <ellipse cx="32" cy="32" rx="28" ry="7" stroke="currentColor" strokeWidth="2.2" fill="none"/>
                <ellipse cx="32" cy="20" rx="21" ry="5" stroke="currentColor" strokeWidth="1.8" fill="none"/>
                <ellipse cx="32" cy="44" rx="21" ry="5" stroke="currentColor" strokeWidth="1.8" fill="none"/>
                <line x1="32" y1="4" x2="32" y2="60" stroke="currentColor" strokeWidth="2.2"/>
              </svg>
            </div>
            <div>
              <div className="font-black text-xl tracking-tight text-white">
                POLAR<span className="text-sky-400 font-black">CONNECT</span>
              </div>
              <small className="text-[10px] tracking-widest text-slate-300 uppercase font-mono font-semibold">SCIENCE, SHARED. • MoES / NCPOR</small>
            </div>
          </div>
          <p>Connecting the people, places and evidence behind polar science.</p>
        </div>
        <div>
          <span className="footer-label">Explore</span>
          <span className="cursor-pointer text-[var(--ice)] hover:text-[var(--hero-foreground)] text-xs">Expeditions & field voyages</span>
          <span className="cursor-pointer text-[var(--ice)] hover:text-[var(--hero-foreground)] text-xs">Knowledge library</span>
          <span className="cursor-pointer text-[var(--ice)] hover:text-[var(--hero-foreground)] text-xs">PolarAI Grounded Assistant</span>
          <span className="cursor-pointer text-[var(--ice)] hover:text-[var(--hero-foreground)] text-xs">Smart Polar Learning Hub</span>
        </div>
        <div>
          <span className="footer-label">Learn</span>
          <a href="https://www.ncpor.res.in/" target="_blank" rel="noreferrer">
            NCPOR <ArrowUpRight size={13} />
          </a>
          <a href="https://npdc.ncpor.res.in/npdc/homepage.action" target="_blank" rel="noreferrer">
            National Polar Data Centre <ArrowUpRight size={13} />
          </a>
          <a href="https://data.ncpor.res.in/PolarDirectory/home" target="_blank" rel="noreferrer">
            Polar Directory <ArrowUpRight size={13} />
          </a>
          <a href="https://moes.gov.in/" target="_blank" rel="noreferrer">
            Ministry of Earth Sciences <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
      <div className="footer-bottom page-container">
        <span>© {new Date().getFullYear()} PolarConnect • MoES / NCPOR Outreach & Knowledge Repository.</span>
        <span>National Polar Data Centre Federated Prototype • SIH26063</span>
      </div>
    </footer>
  );
};
