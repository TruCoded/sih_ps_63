import React from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <div>
      {/* 1. Original Kindred Hero */}
      <section className="hero">
        <img
          className="hero-image"
          src="/assets/antarctica-hero.jpg"
          alt="Antarctic ice cliffs and a research vessel on the water"
          width={1920}
          height={1080}
        />
        <div className="hero-content page-container">
          <div className="hero-index">An open window into polar science</div>
          <h1>
            Science at the<br />ends of the <em>Earth.</em>
          </h1>
          <p>
            Explore the expeditions, discoveries and people shaping our understanding of the polar regions.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('expeditions')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--hero-foreground)] text-[var(--deep)] hover:bg-[var(--ice)] px-7 py-3 text-sm font-semibold cursor-pointer transition-all shadow-sm hover:shadow-md"
            >
              <span>Explore expeditions</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('rag')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 text-sm font-medium cursor-pointer transition-all backdrop-blur-sm"
            >
              <span>Ask PolarAI Assistant</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="hero-bottom">
            <span>PolarConnect / India’s polar story</span>
            <span className="scroll-cue">Scroll to discover <ArrowDown size={15} /></span>
          </div>
        </div>
      </section>

      {/* 2. Original Kindred Intro Grid */}
      <section className="section page-container">
        <div className="intro-grid">
          <div>
            <div className="section-kicker">
              <span>01</span>
              <span>Our purpose</span>
            </div>
            <h2 className="editorial-title">
              The story behind the <em>science.</em>
            </h2>
          </div>
          <div>
            <p>
              From the ice sheets of Antarctica to the waters of the Southern Ocean, polar research helps us understand a changing planet. PolarConnect brings the stories and their sources together in one place.
            </p>
            <button
              onClick={() => onNavigate('catalogue')}
              className="text-link"
            >
              Get to know the platform <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Original Kindred Feature Band */}
      <div className="feature-band">
        <div className="feature-grid page-container">
          <div className="feature-item cursor-pointer" onClick={() => onNavigate('expeditions')}>
            <span className="feature-number">01</span>
            <h3>Follow the journey</h3>
            <p>Discover where expeditions go, what they study, and what happens beyond the field.</p>
          </div>
          <div className="feature-item cursor-pointer" onClick={() => onNavigate('catalogue')}>
            <span className="feature-number">02</span>
            <h3>Find the evidence</h3>
            <p>Move from an accessible story to reports, observations and original research sources.</p>
          </div>
          <div className="feature-item cursor-pointer" onClick={() => onNavigate('rag')}>
            <span className="feature-number">03</span>
            <h3>Share responsibly</h3>
            <p>Understand where information comes from and follow the source’s rights and access terms.</p>
          </div>
        </div>
      </div>

      {/* 4. Original Kindred Explore Regions (Story Grid) */}
      <section className="section page-container">
        <div className="section-kicker">
          <span>02</span>
          <span>Explore the regions</span>
        </div>
        <div className="section-heading">
          <h2>
            Beyond the map.<br /><em>Into the field.</em>
          </h2>
          <button
            onClick={() => onNavigate('expeditions')}
            className="text-link"
          >
            All expeditions <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="story-grid">
          <div
            onClick={() => onNavigate('expeditions')}
            className="story-card"
          >
            <div className="story-image">
              <img
                src="/assets/southern-ocean.jpg"
                alt="Research vessel moving through Southern Ocean sea ice"
                loading="lazy"
              />
            </div>
            <div className="story-meta">
              <span>01 / Southern Ocean</span>
              <span>Expedition focus</span>
            </div>
            <h3>Where the ocean meets the ice</h3>
            <p>Trace the questions, voyages and research behind a vital part of our planet.</p>
            <span className="story-cta">
              Explore the journey <ArrowUpRight size={15} />
            </span>
          </div>

          <div
            onClick={() => onNavigate('expeditions')}
            className="story-card"
          >
            <div className="story-image">
              <img
                src="/assets/polar-station.jpg"
                alt="Polar research station surrounded by Antarctic snow and mountains"
                loading="lazy"
              />
            </div>
            <div className="story-meta">
              <span>02 / Antarctica</span>
              <span>Research focus</span>
            </div>
            <h3>Life and science on the ice</h3>
            <p>Get closer to the stations and fieldwork that make long-term polar observations possible.</p>
            <span className="story-cta">
              Explore the journey <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </section>

      {/* 5. Original Kindred Dark Section (Knowledge Library) */}
      <section className="dark-section section">
        <div className="page-container">
          <div className="section-kicker">
            <span>03</span>
            <span>Knowledge library</span>
          </div>
          <div className="section-heading">
            <h2>
              Every discovery has <em>a source.</em>
            </h2>
            <div>
              <p>Find original research through a curated doorway to authoritative polar information.</p>
              <button
                onClick={() => onNavigate('catalogue')}
                className="text-link spaced-link"
              >
                Browse the library <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
          <div className="source-grid">
            <a
              className="source-tile"
              href="https://npdc.ncpor.res.in/npdc/homepage.action"
              target="_blank"
              rel="noreferrer"
            >
              <span>01 / Data portal</span>
              <h3>National Polar Data Centre</h3>
              <div>
                <span>NCPOR / NPDC</span>
                <ArrowUpRight size={18} />
              </div>
            </a>
            <a
              className="source-tile"
              href="https://npdc.ncpor.res.in/npdc/cruiseSummary.jsp"
              target="_blank"
              rel="noreferrer"
            >
              <span>02 / Expedition records</span>
              <h3>Cruise summaries</h3>
              <div>
                <span>NCPOR / NPDC</span>
                <ArrowUpRight size={18} />
              </div>
            </a>
            <a
              className="source-tile"
              href="https://data.ncpor.res.in/PolarDirectory/home"
              target="_blank"
              rel="noreferrer"
            >
              <span>03 / Research directory</span>
              <h3>Polar Directory</h3>
              <div>
                <span>NCPOR Polar Directory</span>
                <ArrowUpRight size={18} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Original Kindred Quote Section */}
      <section className="section quote-section page-container">
        <div className="section-kicker">
          <span>04</span>
          <span>A connected perspective</span>
        </div>
        <blockquote>
          “From scattered records to a living account of polar science.”
        </blockquote>
        <p>
          Research deserves to be discoverable, understandable and always connected to the evidence behind it.
        </p>
        <button
          onClick={() => onNavigate('education')}
          className="text-link spaced-link"
        >
          Read field stories <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
};
