import { Link, useRouterState } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const links = [
  { to: '/expeditions', label: 'Expeditions' },
  { to: '/library', label: 'Knowledge library' },
  { to: '/stories', label: 'Field stories' },
  { to: '/about', label: 'About' },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: state => state.location.pathname });
  const menuRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key !== 'Tab' || !menuRef.current) return;
      const focusables = [triggerRef.current, ...menuRef.current.querySelectorAll<HTMLAnchorElement>('a')].filter((item): item is HTMLButtonElement | HTMLAnchorElement => Boolean(item));
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first && last) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last && first) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); };
  }, [open]);

  const isCurrent = (to: string) => pathname.replace(/\/$/, '') === to;
  const close = () => setOpen(false);
  return <header className="site-header">
    <div className="site-header-inner">
      <Link to="/" className="brand" aria-label="PolarConnect home" onClick={close}><span className="brand-symbol" aria-hidden="true"><i/><i/><i/></span><span>POLAR<span className="brand-light">CONNECT</span><small>SCIENCE, SHARED.</small></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <Link key={link.to} to={link.to} activeProps={{ className: 'active' }} activeOptions={{ exact: true }}>{link.label}</Link>)}</nav>
      <Button asChild variant="nav" size="sm" className="header-explore"><Link to="/library">Explore the archive <ArrowUpRight size={15}/></Link></Button>
      <Button ref={triggerRef} variant="iconPlain" size="icon" className="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} aria-controls="mobile-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</Button>
    </div>
    {open && <nav ref={menuRef} id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
      <div className="mobile-nav-inner">
        <p className="mobile-nav-eyebrow"><span>01</span> / Explore PolarConnect</p>
        <div className="mobile-nav-primary">
          <Link to="/" onClick={close} aria-current={isCurrent('/') ? 'page' : undefined}><span>Home</span><ArrowUpRight aria-hidden="true"/></Link>
          {links.map(link => <Link key={link.to} to={link.to} onClick={close} aria-current={isCurrent(link.to) ? 'page' : undefined}><span>{link.label}</span><ArrowUpRight aria-hidden="true"/></Link>)}
        </div>
        <div className="mobile-nav-secondary">
          <div><span className="mobile-nav-label">Regions</span><Link to="/expeditions/antarctica" onClick={close} aria-current={isCurrent('/expeditions/antarctica') ? 'page' : undefined}>Antarctica <ArrowRight aria-hidden="true"/></Link><Link to="/expeditions/southern-ocean" onClick={close} aria-current={isCurrent('/expeditions/southern-ocean') ? 'page' : undefined}>Southern Ocean <ArrowRight aria-hidden="true"/></Link></div>
          <div><span className="mobile-nav-label">From the field</span><Link to="/stories/reading-the-ice" onClick={close} aria-current={isCurrent('/stories/reading-the-ice') ? 'page' : undefined}>Reading the ice <ArrowRight aria-hidden="true"/></Link></div>
        </div>
        <p className="mobile-nav-footnote">An independent introduction to polar science.</p>
      </div>
    </nav>}
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-main page-container"><div><Link to="/" className="brand footer-brand"><span className="brand-symbol" aria-hidden="true"><i/><i/><i/></span><span>POLAR<span className="brand-light">CONNECT</span><small>SCIENCE, SHARED.</small></span></Link><p>Connecting the people, places and evidence behind polar science.</p></div><div><span className="footer-label">Explore</span><Link to="/expeditions">Expeditions</Link><Link to="/library">Knowledge library</Link><Link to="/stories">Field stories</Link></div><div><span className="footer-label">Learn</span><Link to="/about">About the platform</Link><a href="https://www.ncpor.res.in/" target="_blank" rel="noreferrer">NCPOR <ArrowUpRight size={13}/></a><a href="https://npdc.ncpor.res.in/npdc/homepage.action" target="_blank" rel="noreferrer">National Polar Data Centre <ArrowUpRight size={13}/></a></div></div><div className="footer-bottom page-container"><span>© {new Date().getFullYear()} PolarConnect. A concept for accessible polar science.</span><span>Independent prototype · Not an official NCPOR website</span></div></footer>;
}
