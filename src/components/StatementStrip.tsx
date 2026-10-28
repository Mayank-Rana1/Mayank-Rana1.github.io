import { useEffect, useRef } from 'react';

const WORDS = ['THOUGHT', 'STRUCTURE', 'SYSTEM', 'RESULT'];

/**
 * Sticky scroll-linked statement: the concept sentence slides horizontally
 * with scroll position (never autoplays). Pure rAF transform, no hijack.
 */
export default function StatementStrip() {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced =
    typeof window !== 'undefined' &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.motion === 'reduced');

  useEffect(() => {
    if (reduced) return;
    const o = outer.current;
    const t = track.current;
    if (!o || !t) return;
    let raf = 0;
    const measure = () => {
      const r = o.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = r.height - vh;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      const max = Math.max(0, t.scrollWidth - o.clientWidth + 48);
      t.style.transform = `translateX(${(-p * max).toFixed(1)}px)`;
    };
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(() => {
        queued = false;
        measure();
      });
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={outer} className="strip-wrap" aria-hidden="true">
      <div className="strip-sticky">
        <div ref={track} className="strip-track">
          {WORDS.map((w, i) => (
            <span key={w} className="strip-word">
              {w}
              {i < WORDS.length - 1 ? <span className="strip-arrow">&rarr;</span> : null}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
