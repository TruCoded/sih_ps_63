import React, { useState, useRef, useEffect } from 'react';
import { 
  Wind, 
  ArrowUpRight, 
  Menu, 
  X,
  Compass, 
  Activity, 
  Layers, 
  Bot, 
  Share2, 
  FileCheck, 
  ShieldCheck, 
  BookOpen, 
  ChevronDown,
  User,
  GraduationCap,
  FlaskConical,
  GitBranch,
  Sparkles,
  Check
} from 'lucide-react';
import { UserRole, StationTelemetry } from '../../../../packages/shared-types/index.js';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stations: StationTelemetry[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  stations
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(event.target as Node)) {
        setWorkspaceMenuOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleMeta: Record<UserRole, { label: string; badge: string; icon: any; desc: string }> = {
    public_visitor: { label: 'Public Visitor', badge: 'Public', icon: Compass, desc: 'Open research, stories & field media' },
    student: { label: 'School Student', badge: 'Student', icon: GraduationCap, desc: 'Curriculum quizzes & interactive AI tutor' },
    researcher: { label: 'Accredited Researcher', badge: 'Science', icon: FlaskConical, desc: 'Full time-series, DOIs & BibTeX' },
    contributor: { label: 'Field Contributor', badge: 'Ingest', icon: FileCheck, desc: 'Raw dataset & sensor ingest wizard' },
    curator: { label: 'Data Curator', badge: 'Curator', icon: ShieldCheck, desc: 'Validation & quarantine queue' },
    comms_reviewer: { label: 'Comms Reviewer', badge: 'Press', icon: Share2, desc: 'Press releases & social graphics' },
    admin: { label: 'System Admin', badge: 'Admin', icon: User, desc: 'PROV-O audit & system governance' }
  };

  const primaryNavItems = [
    { id: 'command', label: 'Overview' },
    { id: 'expeditions', label: 'Expeditions' },
    { id: 'catalogue', label: 'Knowledge library' },
    { id: 'rag', label: 'PolarAI' },
    { id: 'education', label: 'Education Hub' },
  ];

  const workspaceNavItems = [
    { id: 'studio', label: 'Content Studio', desc: 'Evidence-grounded press & outreach drafts', icon: Share2 },
    { id: 'ingest', label: 'Field Ingest', desc: 'Telemetry & dataset ingest wizard', icon: FileCheck },
    { id: 'curation', label: 'Curator Queue', desc: 'Dataset compliance & embargo reviews', icon: ShieldCheck, showFor: ['curator', 'admin'] },
    { id: 'audit', label: 'Provenance Graph', desc: 'W3C PROV-O audit lineage graph', icon: GitBranch },
  ];

  const isWorkspaceActive = workspaceNavItems.some(item => item.id === activeTab);

  return (
    <header className="site-header">
      {/* 1. Sleek Live Telemetry Top Strip (Light Kindred Theme) */}
      <div className="bg-[var(--secondary)]/80 backdrop-blur-xs border-b border-[var(--border)] px-4 sm:px-8 py-1.5 text-xs text-[var(--muted-foreground)] flex items-center justify-between overflow-x-auto select-none">
        <div className="flex items-center space-x-4 sm:space-x-6 min-w-max">
          <span className="flex items-center text-[var(--signal)] font-mono uppercase tracking-wider text-[10px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[var(--signal)] animate-pulse mr-2" />
            LIVE POLAR TELEMETRY:
          </span>
          {stations.map((st, idx) => (
            <div key={st.stationId} className="flex items-center space-x-2 font-mono text-[11px] text-[var(--foreground)]">
              {idx > 0 && <span className="text-[var(--border)] select-none">|</span>}
              <span className="text-[var(--muted-foreground)] font-normal">{st.name.replace(' Station', '').replace(' Research', '')}:</span>
              <span className="font-bold">
                {st.temperatureC}°C
              </span>
              <span className="text-[var(--muted-foreground)] flex items-center text-[10px]">
                <Wind className="w-3 h-3 mr-0.5 text-[var(--muted-foreground)]" /> {st.windSpeedKnots} kts
              </span>
            </div>
          ))}
        </div>
        <div className="text-[10.5px] text-[var(--muted-foreground)] pl-6 whitespace-nowrap hidden lg:flex items-center space-x-2 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>NPDC Federated Discovery • MoES / NCPOR</span>
        </div>
      </div>

      {/* 2. Main Kindred-Palette Site Header Inner */}
      <div className="site-header-inner">
        {/* Brand Logo & Rotating Orbital Symbol */}
        <div 
          onClick={() => onTabChange('command')}
          className="brand"
          aria-label="PolarConnect home"
        >
          <svg
            width="32" height="32" viewBox="0 0 64 64" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2.5" fill="none"/>
            <ellipse cx="32" cy="32" rx="28" ry="6.5" stroke="currentColor" strokeWidth="1.8" fill="none"/>
            <ellipse cx="32" cy="20" rx="21" ry="4.5" stroke="currentColor" strokeWidth="1.3" fill="none"/>
            <ellipse cx="32" cy="44" rx="21" ry="4.5" stroke="currentColor" strokeWidth="1.3" fill="none"/>
            <line x1="32" y1="4" x2="32" y2="60" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M 32 4 Q 11 32 32 60" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            <path d="M 32 4 Q 53 32 32 60" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          </svg>
          <div>
            <div className="font-extrabold text-[15px] tracking-[0.035em] leading-none text-[var(--foreground)]">
              POLAR<span className="brand-light">CONNECT</span>
            </div>
            <small>SCIENCE, SHARED.</small>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main navigation">
          {primaryNavItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={isActive ? 'active' : ''}
              >
                {item.label}
              </button>
            );
          })}

          {/* Workspace Dropdown for Specialist Tools */}
          <div ref={workspaceRef} className="relative">
            <button
              onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
              className={`flex items-center gap-1.5 ${isWorkspaceActive ? 'active' : ''}`}
            >
              <span>Workspace</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${workspaceMenuOpen ? 'rotate-180 text-[var(--signal)]' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {workspaceMenuOpen && (
              <div className="absolute top-full left-0 mt-3 w-72 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] font-bold border-b border-[var(--border)] mb-1">
                  Scientific Tools & Governance
                </div>
                {workspaceNavItems.map(item => {
                  if (item.showFor && !item.showFor.includes(currentRole)) return null;
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setWorkspaceMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-3 transition-colors cursor-pointer ${
                        isActive 
                          ? 'bg-[var(--secondary)] text-[var(--foreground)] font-semibold' 
                          : 'text-[var(--foreground)] hover:bg-[var(--secondary)]'
                      }`}
                    >
                      <span className={`p-1.5 rounded-lg mt-0.5 ${isActive ? 'bg-[var(--signal)] text-white' : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold leading-tight">{item.label}</div>
                        <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 line-clamp-1">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Section: Role Selector + Explore Archive Action Button */}
        <div className="flex items-center gap-3">
          {/* User Role Selector Dropdown */}
          <div ref={roleRef} className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 bg-[var(--card)] hover:bg-[var(--secondary)] border border-[var(--border)] px-3.5 py-1.5 rounded-full text-xs text-[var(--foreground)] transition-all shadow-2xs hover:shadow-xs cursor-pointer"
              aria-label="Switch User Role"
            >
              {React.createElement(roleMeta[currentRole].icon, { className: 'w-3.5 h-3.5 text-[var(--signal)]' })}
              <span className="font-semibold hidden sm:inline">{roleMeta[currentRole].label}</span>
              <span className="sm:hidden font-semibold">{roleMeta[currentRole].badge}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)] hidden md:inline border border-[var(--border)] font-medium">
                {roleMeta[currentRole].badge}
              </span>
              <ChevronDown className="w-3 h-3 text-[var(--muted-foreground)]" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] font-bold border-b border-[var(--border)] mb-1">
                  Simulate Platform Persona
                </div>
                {Object.entries(roleMeta).map(([roleKey, meta]) => {
                  const Icon = meta.icon;
                  const isCurrent = currentRole === roleKey;
                  return (
                    <button
                      key={roleKey}
                      onClick={() => {
                        onRoleChange(roleKey as UserRole);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        isCurrent 
                          ? 'bg-[var(--secondary)] font-bold text-[var(--foreground)]' 
                          : 'text-[var(--foreground)] hover:bg-[var(--secondary)]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[var(--signal)]' : 'text-[var(--muted-foreground)]'}`} />
                        <div>
                          <div className="font-semibold leading-tight">{meta.label}</div>
                          <div className="text-[10px] text-[var(--muted-foreground)] line-clamp-1">{meta.desc}</div>
                        </div>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)]">
                          {meta.badge}
                        </span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-[var(--signal)]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Signature Kindred-Palette "Explore the archive" Button */}
          <button
            onClick={() => onTabChange('catalogue')}
            className="header-explore hidden md:inline-flex rounded-full"
          >
            <span>Explore the archive</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)] cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[var(--border)] py-4 px-6 bg-[var(--background)]">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
            <span className="text-[var(--signal)] mr-1.5">01 /</span> Explore PolarConnect
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {primaryNavItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-[var(--radius)] text-xs font-medium text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--secondary)] text-[var(--signal)] font-bold border border-[var(--border)]'
                      : 'text-[var(--foreground)] hover:bg-[var(--secondary)]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-3 h-3 text-[var(--muted-foreground)]" />
                </button>
              );
            })}
          </div>

          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
            <span className="text-[var(--signal)] mr-1.5">02 /</span> Workspace & Governance
          </p>
          <div className="grid grid-cols-2 gap-2">
            {workspaceNavItems.map(item => {
              if (item.showFor && !item.showFor.includes(currentRole)) return null;
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-[var(--radius)] text-xs font-medium text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--secondary)] text-[var(--signal)] font-bold border border-[var(--border)]'
                      : 'text-[var(--foreground)] hover:bg-[var(--secondary)]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                    {item.label}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-[var(--muted-foreground)]" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
