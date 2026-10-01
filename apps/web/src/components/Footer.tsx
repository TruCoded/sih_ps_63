import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-main page-container">
        <div>
          <div className="brand footer-brand">
            <span className="brand-symbol" aria-hidden="true">
              <i /><i /><i />
            </span>
            <div>
              <span>POLAR<span className="brand-light">CONNECT</span></span>
              <small>SCIENCE, SHARED.</small>
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
