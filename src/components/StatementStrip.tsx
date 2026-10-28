import { useEffect, useRef } from 'react';
import { onScrollFrame } from '../lib/scroll';

const WORDS = ['THOUGHT', 'STRUCTURE', 'SYSTEM', 'RESULT'];

/**
 * Sticky scroll-linked statement: the concept sentence slides horizontally
 * with scroll position (never autoplays). Pure rAF transform, no hijack.
 */
export default function StatementStrip({ reduced }: { reduced: boolean }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const o = outer.current;
    const t = track.current;
    if (!o || !t) return;
    return onScrollFrame(() => {
      const r = o.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = r.height - vh;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      const max = Math.max(0, t.scrollWidth - o.clientWidth + 48);
      t.style.transform = `translate3d(${(-p * max).toFixed(1)}px, 0, 0)`;
    });
  }, [reduced]);

  return (
    <div ref={outer} className="strip-wrap" data-reduced={reduced} aria-hidden="true">
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
