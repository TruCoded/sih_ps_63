import React from 'react';
import {
  Map,
  BookOpen,
  MessageSquare,
  Radio,
  PenTool,
  Compass,
  ArrowRight,
  Zap,
  Shield,
  Globe,
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
}

const MODULES = [
  {
    id: 'expeditions',
    icon: Compass,
    title: 'Voyage Explorer',
    desc: 'Timelines, routes and linked datasets for each expedition.',
    imgAlt: 'Antarctic ice cliffs panorama',
    imgSrc: '/assets/southern-ocean.jpg',
    color: '#1e6fa8',
  },
  {
    id: 'catalogue',
    icon: BookOpen,
    title: 'Knowledge Library',
    desc: 'FAIR/CARE catalogue with licences and citations.',
    imgAlt: 'Researcher on polar ice',
    imgSrc: '/assets/polar-station.jpg',
    color: '#0e7e6b',
  },
  {
    id: 'studio',
    icon: PenTool,
    title: 'Content Studio',
    desc: 'Evidence-based press and outreach drafts for review.',
    imgAlt: 'Research vessel at sea',
    imgSrc: '/assets/southern-ocean.jpg',
    color: '#7b3fa0',
  },
  {
    id: 'command',
    icon: Radio,
    title: 'Station Telemetry',
    desc: 'Live NCPOR/IMD readings from four polar stations.',
    imgAlt: 'Scientists at polar station',
    imgSrc: '/assets/polar-station.jpg',
    color: '#b85c00',
  },
];

const BADGES = [
  { icon: Shield, label: 'Permission-filtered access per NCPOR policy' },
  { icon: Zap, label: 'Live telemetry from Maitri, Bharati, Himadri & Kadakhstan' },
  { icon: Globe, label: 'FAIR / CARE data principles with W3C PROV-O audit trail' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <div className="pc-landing">

      {/* ── TOP WELCOME BAND ─────────────────────────────────────────────── */}
      <section className="pc-welcome-band">
        <div className="pc-welcome-inner">
          <h1 className="pc-welcome-title">
            Welcome to the <span className="pc-brand-accent">PolarConnect</span> Knowledge Hub
          </h1>
          <p className="pc-welcome-sub">
            One trusted place to explore India's polar expeditions, search the scientific
            catalogue and ask cited questions about the science.
          </p>
          <div className="pc-badges-row">
            {BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="pc-badge">
                <Icon size={13} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO PRIMARY CTA CARDS ─────────────────────────────────────────── */}
      <section className="pc-cta-section">
        <div className="pc-cta-inner">

          <div className="pc-cta-card pc-cta-orange">
            <div className="pc-cta-card-top">
              <div className="pc-cta-card-icon-wrap pc-icon-orange">
                <Map size={20} />
              </div>
              <div className="pc-cta-card-body">
                <h2>Explore Expeditions</h2>
                <p>
                  Follow voyages from Cape Town to Maitri and Bharati on a live timeline.
                  View waypoints, linked datasets and media for every leg.
                </p>
              </div>
            </div>
            <button
              id="cta-explore-expeditions"
              className="pc-cta-btn pc-cta-btn-orange"
              onClick={() => onNavigate('expeditions')}
            >
              Explore now <ArrowRight size={14} />
            </button>
          </div>

          <div className="pc-cta-card pc-cta-dark">
            <div className="pc-cta-card-top">
              <div className="pc-cta-card-icon-wrap pc-icon-dark">
                <MessageSquare size={20} />
              </div>
              <div className="pc-cta-card-body">
                <h2>Ask PolarAI</h2>
                <p>
                  Permission-filtered answers with page and timestamp citations.
                  Grounded in NCPOR corpus — no hallucinations.
                </p>
              </div>
            </div>
            <button
              id="cta-ask-polarai"
              className="pc-cta-btn pc-cta-btn-dark"
              onClick={() => onNavigate('rag')}
            >
              Ask now <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </section>

      {/* ── KEY MODULES GRID ──────────────────────────────────────────────── */}
      <section className="pc-modules-section">
        <div className="pc-modules-inner">
          <h2 className="pc-modules-heading">Key Modules</h2>
          <div className="pc-modules-grid">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  id={`module-card-${mod.id}`}
                  className="pc-module-card"
                  onClick={() => onNavigate(mod.id)}
                >
                  <div className="pc-module-thumb">
                    <img src={mod.imgSrc} alt={mod.imgAlt} loading="lazy" />
                  </div>
                  <div className="pc-module-text">
                    <div className="pc-module-icon-row">
                      <div className="pc-module-icon-wrap" style={{ color: mod.color, background: `${mod.color}18` }}>
                        <Icon size={15} />
                      </div>
                      <h3 style={{ color: mod.color }}>{mod.title}</h3>
                    </div>
                    <p>{mod.desc}</p>
                    <span className="pc-module-cta" style={{ color: mod.color }}>
                      Open module <ArrowRight size={12} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="pc-flow-section">
        <div className="pc-flow-inner">
          <h2 className="pc-flow-heading">How it works</h2>
          <div className="pc-flow-steps">
            {[
              {
                num: '01',
                head: 'Select an Expedition',
                body: 'Pick any NCPOR voyage on the Voyage Explorer timeline to see route, waypoints and linked data.',
                tab: 'expeditions',
                cta: 'Open Voyage Explorer',
                color: '#1e6fa8',
              },
              {
                num: '02',
                head: 'Browse the Catalogue',
                body: 'Every expedition links to FAIR-tagged datasets, reports and media with role-based access control.',
                tab: 'catalogue',
                cta: 'Open Knowledge Library',
                color: '#0e7e6b',
              },
              {
                num: '03',
                head: 'Ask PolarAI',
                body: 'Get page-cited, permission-filtered answers from the entire NCPOR corpus — powered by RAG.',
                tab: 'rag',
                cta: 'Open PolarAI',
                color: '#7b3fa0',
              },
            ].map((step) => (
              <div key={step.num} className="pc-flow-step" style={{ borderTopColor: step.color }}>
                <span className="pc-flow-num" style={{ color: step.color }}>{step.num}</span>
                <h3>{step.head}</h3>
                <p>{step.body}</p>
                <button
                  id={`flow-step-${step.num}`}
                  className="pc-flow-link"
                  style={{ color: step.color }}
                  onClick={() => onNavigate(step.tab)}
                >
                  {step.cta} <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
