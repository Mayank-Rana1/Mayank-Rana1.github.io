import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/portfolio';
import { IconClose, IconFile, IconMenu } from './icons';
import { onScrollFrame } from '../lib/scroll';
import { setScrollLocked } from '../lib/smooth';

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Sticky navigation: identity left, sections center, GitHub + Resume right.
 * Glass over content, a hairline progress line and a floating mobile menu.
 * gets logo, Resume, and an accessible menu - nothing hidden.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#top');
  const menuBtn = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => onScrollFrame(() => {
    setScrolled(window.scrollY > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
  }), []);

  /* Scrollspy: highlight the section actually on screen. */
  useEffect(() => {
    const ids = ['work', 'about', 'capabilities', 'journey', 'contact'];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${(e.target as HTMLElement).id}`);
        }
      },
      { rootMargin: '-38% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* Mobile menu: lock the page, trap focus, restore on close. */
  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    const focusTimer = window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLButtonElement>('.menu-close')?.focus();
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuBtn.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
      setScrollLocked(false);
    };
  }, [open]);

  return (
    <>
      <header className={`sitenav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <a className="brand" href="#top" aria-label="Mayank Rana, back to top">
            <span className="brand-mark" aria-hidden="true">MR</span>
            <span className="brand-name">Mayank Rana</span>
          </a>
          <nav aria-label="Sections">
            <ul className="nav-links">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} aria-current={active === l.href ? 'location' : undefined} data-active={active === l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav-actions">
            <a className="btn btn-ghost hide-mobile" style={{ minHeight: 42, padding: '6px 16px', fontSize: '0.8rem' }} href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a className="btn btn-primary hide-mobile" style={{ minHeight: 42, padding: '6px 16px', fontSize: '0.8rem' }} href={profile.resume} download="Mayank_Rana_SWE.pdf">
              <IconFile size={14} /> Resume
            </a>
            <button
              ref={menuBtn}
              type="button"
              className="btn btn-ghost menu-btn"
              style={{ minHeight: 44, padding: '6px 14px' }}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <IconClose /> : <IconMenu />} Menu
            </button>
          </div>
        </div>
        <div className="nav-progress" aria-hidden="true">
          <i ref={barRef} />
        </div>
      </header>
      <div
        ref={menuRef}
        id="mobile-menu"
        className="mobile-menu"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
      >
        {open ? (
          <>
            <button type="button" className="btn btn-ghost menu-close" onClick={() => setOpen(false)} aria-label="Close menu">
              <IconClose /> Close
            </button>
            {[{ label: 'Top', href: '#top' }, ...LINKS].map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => {
                  setOpen(false);
                  window.setTimeout(() => menuBtn.current?.focus(), 0);
                }}
              >
                {l.label}
              </a>
            ))}
            <div className="mobile-menu-foot">
              <a
                className="btn btn-primary"
                href={profile.resume}
                download="Mayank_Rana_SWE.pdf"
                onClick={() => setOpen(false)}
              >
                <IconFile size={15} /> Download resume
              </a>
              <p className="menu-meta">BHOPAL, INDIA &middot; OPEN TO INTERNSHIPS</p>
              <div className="menu-elsewhere">
                <a href={`mailto:${profile.email}`} onClick={() => setOpen(false)}>Email</a>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>GitHub</a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>LinkedIn</a>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
