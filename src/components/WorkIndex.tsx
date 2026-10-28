import { useRef, useState } from 'react';
import { projects } from '../data/portfolio';
import { useInView } from '../lib/reveal';

/**
 * Fast-scan project index: hovering a row dims the rest and pins a small
 * live diagram preview near the cursor. Clicking jumps to the chapter.
 * Touch devices get the same rows as plain anchor links.
 */
function Preview({ index }: { index: number }) {
  const label = ['GATEWAY ROUTE', 'LAYER STACK', 'FRAME GRAPH', 'LOCAL PIPELINE'][index];
  return (
    <svg viewBox="0 0 220 120" role="presentation" aria-hidden="true">
      {index === 0 ? (
        <g fill="none" stroke="var(--p-green-bright)" strokeWidth="1.6">
          <path d="M20 14 H200" strokeDasharray="5 4" />
          <circle cx="20" cy="14" r="4" fill="var(--p-green-bright)" stroke="none" />
          <circle cx="110" cy="14" r="4" />
          <circle cx="200" cy="14" r="4" />
          <path d="M20 60 H110 L150 92 H200" />
          <circle cx="150" cy="92" r="4" />
          <path d="M20 106 H200" strokeDasharray="3 4" opacity="0.6" />
        </g>
      ) : null}
      {index === 1 ? (
        <g fill="none" stroke="var(--p-blue-bright)" strokeWidth="1.6">
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              {[0, 1, 2].map((c) => (
                <circle key={c} cx={40 + c * 70} cy={22 + r * 26} r="6" />
              ))}
              {r < 3 ? <path d={`M62 ${22 + r * 26} L88 ${48 + r * 26} M132 ${22 + r * 26} L158 ${48 + r * 26}`} opacity="0.55" /> : null}
            </g>
          ))}
        </g>
      ) : null}
      {index === 2 ? (
        <g fill="none" stroke="var(--p-orange-bright)" strokeWidth="1.6">
          <path d="M14 100 V30 M44 100 V14 M74 100 V44 M104 100 V14 M134 100 V14 M164 100 V14 M194 100 V14" />
          <path d="M8 14 H206" opacity="0.7" />
        </g>
      ) : null}
      {index === 3 ? (
        <g fill="none" stroke="var(--p-violet-bright)" strokeWidth="1.6">
          <rect x="14" y="14" width="192" height="92" rx="4" />
          <path d="M14 60 H206" strokeDasharray="6 5" />
          <rect x="34" y="30" width="56" height="44" rx="2" />
          <rect x="130" y="30" width="56" height="44" rx="2" opacity="0.55" />
        </g>
      ) : null}
      <text x="12" y="114" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="2" fill="currentColor" opacity="0.7">
        {label}
      </text>
    </svg>
  );
}

export default function WorkIndex() {
  const [active, setActive] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const wrap = useRef<HTMLDivElement>(null);
  const { ref: inRef, visible } = useInView<HTMLDivElement>(0.18);
  const fine =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const onMove = (e: React.PointerEvent, i: number) => {
    if (!fine) return;
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    const maxX = Math.max(12, r.width - 264);
    const maxY = Math.max(8, r.height - 156);
    setActive(i);
    setPos({
      x: Math.min(Math.max(12, e.clientX - r.left + 24), maxX),
      y: Math.min(Math.max(8, e.clientY - r.top - 70), maxY),
    });
  };

  return (
    <div className="wrap" ref={inRef}>
      <div
        ref={wrap}
        className="work-index"
        data-active={active === null ? 'none' : active}
        data-in={visible}
        onPointerLeave={() => setActive(null)}
      >
        <p className="eyebrow">Selected work &mdash; index</p>
        <ul>
          {projects.map((p, i) => (
            <li key={p.no} data-dim={active !== null && active !== i} style={{ '--rd': `${i * 70}ms` } as React.CSSProperties}>
              <a
                href={`#${p.hash}`}
                onPointerMove={(e) => onMove(e, i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <span className="wi-no">{p.no}</span>
                <span className="wi-title">{p.title}</span>
                <span className="wi-cat">{p.category}</span>
                <span className="wi-outcome">{p.outcome}</span>
              </a>
            </li>
          ))}
        </ul>
        {fine && active !== null ? (
          <div
            className="wi-preview"
            aria-hidden="true"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
          >
            <Preview index={active} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
