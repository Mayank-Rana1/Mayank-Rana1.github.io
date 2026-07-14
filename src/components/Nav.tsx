import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/portfolio';
import { IconClose, IconFile, IconMenu } from './icons';
import { usePageProgress } from '../lib/reveal';

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Simple professional sticky navigation: identity left, sections center,
 * GitHub + Resume right. Shrinks + grows a progress line on scroll.
 * Mobile gets logo, Resume, and an accessible menu — nothing hidden.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const progress = usePageProgress();
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open ]);

  return (
    <>
      <header className={`sitenav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <a className="brand" href="#top" aria-label="Mayank Rana — back to top">
            <span className="brand-mark" aria-hidden="true">MR</span>
            <span className="brand-name">Mayank Rana</span>
          </a>
          <nav aria-label="Sections">
            <ul className="nav-links">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav-actions">
            <a className="btn btn-ghost hide-mobile" style={{ minHeight: 40, padding: '6px 16px', fontSize: '0.8rem' }} href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a className="btn btn-primary hide-mobile" style={{ minHeight: 40, padding: '6px 16px', fontSize: '0.8rem' }} href={profile.resume} download="Mayank_Rana_SWE.pdf">
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
          <i style={{ transform: `scaleX(${progress})` }} />
        </div>
      </header>
      <div id="mobile-menu" className="mobile-menu" data-open={open} role="dialog" aria-modal="true" aria-label="Sections" hidden={!open}>
        {open ? (
          <>
            <button type="button" className="btn btn-ghost menu-close" onClick={() => { setOpen(false); menuBtn.current?.focus(); }} aria-label="Close menu">
              <IconClose /> Close
            </button>
            {[{ label: 'Top', href: '#top' }, ...LINKS].map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </>
        ) : null}
      </div>
    </>
  );
}
