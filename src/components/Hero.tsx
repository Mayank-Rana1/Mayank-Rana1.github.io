import { useMemo } from 'react';
import { profile } from '../data/portfolio';
import { IconFile } from './icons';
import { Magnetic, Scramble } from './motion';
import { useInView, useScrollProgress } from '../lib/reveal';

const N = 28;
const X0 = 20;
const X1 = 620;

function stagePoints(stage: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < N; i++) {
    const x = X0 + ((X1 - X0) * i) / (N - 1);
    const t = i / (N - 1);
    let y: number;
    if (stage === 0) {
      // request path: stepped hops
      const step = Math.floor(t * 7) % 2 === 0 ? 0 : -26;
      y = 130 + step + (i % 4 === 3 ? 26 : 0);
    } else if (stage === 1) {
      // neural-network curve
      y = 120 + 72 * Math.sin(t * Math.PI * 3);
    } else if (stage === 2) {
      // frame-time graph: flat line with spikes
      const spike = [0.22, 0.47, 0.71].some((s) => Math.abs(t - s) < 0.03) ? -64 : 0;
      y = 150 + spike + (t > 0.8 ? -14 : 0);
    } else {
      // algorithm tree: binary zigzag search
      const depth = Math.floor(t * 5);
      y = 40 + depth * 32 + (i % 2 === 0 ? -12 : 12);
    }
    pts.push({ x, y });
  }
  return pts;
}

const STAGE_LABELS = ['REQUEST PATH', 'NEURAL CURVE', 'FRAME GRAPH', 'SEARCH TREE'];

/**
 * The signature line: one continuous technical stroke that begins as a
 * request path and evolves - neural curve, frame graph, search tree -
 * responding gently to scroll. Never loops on its own.
 */
function SignatureLine({ reduced }: { reduced: boolean }) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const d = useMemo(() => {
    const p = reduced ? 1 / 3 : progress;
    const f = Math.min(2.999, Math.max(0, p * 3));
    const i0 = Math.floor(f);
    const fr = f - i0;
    const a = stagePoints(i0);
    const b = stagePoints(i0 + 1);
    const pts = a.map((pt, i) => `${(pt.x + (b[i].x - pt.x) * fr).toFixed(1)},${(pt.y + (b[i].y - pt.y) * fr).toFixed(1)}`);
    return {
      poly: pts.join(' '),
      path: 'M' + pts.map((s) => s.replace(',', ' ')).join(' L'),
      label: STAGE_LABELS[Math.round(f)] ?? STAGE_LABELS[0],
    };
  }, [progress, reduced]);

  return (
    <div ref={ref} className="hero-line" aria-hidden="true">
      <svg viewBox="0 0 640 240" role="presentation">
        <polyline
          points={d.poly}
          fill="none"
          stroke="var(--vermilion)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={d.poly}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1"
          opacity="0.25"
          transform="translate(0,14)"
        />
        {!reduced ? (
          <circle r="5" fill="var(--vermilion-deep)">
            <animateMotion dur="7s" repeatCount="indefinite" path={d.path} />
          </circle>
        ) : null}
      </svg>
      <div className="fig-cap">
        <span>FIG. 00 &mdash; FIRST PRINCIPLES</span>
        <span>{d.label}</span>
      </div>
    </div>
  );
}

/**
 * Hero: enormous typographic statement, no floating objects.
 * Masked line reveals; the signature line carries the motion.
 */
export default function Hero({ reduced }: { reduced: boolean }) {
  const { ref, visible } = useInView<HTMLDivElement>(0.2);
  return (
    <section className="hero" aria-labelledby="hero-title" id="top">
      <div className="wrap hero-grid" ref={ref}>
        <div>
          <p className="hero-kicker"><Scramble text="PORTFOLIO  — MAYANK RANA" /></p>
          <h1 id="hero-title" className="hero-title">
            <span className={`rv${visible ? ' in' : ''}`}><span className="rv-in">I turn <em>first principles</em></span></span>
            <span className={`rv${visible ? ' in' : ''}`}><span className="rv-in">into working systems.</span></span>
          </h1>
          <p className="hero-sub">
            Software engineer and CSE (AI) undergraduate at IIIT Bhopal, building backend
            infrastructure, machine-learning systems, browser tools, and performance-sensitive products.
          </p>
          <div className="hero-cta">
            <Magnetic>
              <a className="btn btn-vermilion" href="#work">Explore selected work</a>
            </Magnetic>
            <a className="btn btn-ghost" href={profile.resume} download="Mayank_Rana_SWE.pdf">
              <IconFile size={15} /> Download resume
            </a>
          </div>
          <p className="avail">
            <span className="pulse" aria-hidden="true" />
            Open to software engineering internships
          </p>
        </div>
        <SignatureLine reduced={reduced} />
      </div>
    </section>
  );
}

