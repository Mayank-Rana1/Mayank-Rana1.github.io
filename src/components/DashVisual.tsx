import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/portfolio';
import { useScrollProgress } from '../lib/reveal';
import { Tilt } from './motion';

const W = 520;
const H = 200;
const FIELD_H = 112;
const POOL = 120;

type Dot = { x: number; y: number; vx: number; vy: number; r: number };

/**
 * Thought → system: unstable allocation bars settle as pooling activates.
 * The same entity field runs both ways under one toggle; frame data is
 * measured live, totals are the documented results.
 */
export default function DashVisual({ reduced }: { reduced: boolean }) {
  const project = projects[2];
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const stage = reduced ? 1 : progress < 0.4 ? 0 : 1;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pooled, setPooled] = useState(true);
  const pooledRef = useRef(true);
  const [stats, setStats] = useState({ fps: 60, gc: 0, p95: 17 });
  const started = useRef(false);

  useEffect(() => {
    pooledRef.current = pooled;
  }, [pooled]);

  useEffect(() => {
    if (stage === 0 || started.current || reduced) return;
    started.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    let dots: Dot[] = Array.from({ length: POOL }, () => ({
      x: rand(8, W - 8), y: rand(8, FIELD_H - 8),
      vx: rand(-1.6, 1.6), vy: rand(-1.2, 1.2), r: rand(2, 4.5),
    }));
    const history: number[] = Array.from({ length: 130 }, () => 16.6);
    let gc = 0;
    let raf = 0;
    let last = performance.now();
    let fpsAcc = 60;
    let frame = 0;
    let running = true;

    const draw = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      const dt = Math.min(100, now - last);
      last = now;
      frame++;
      const on = pooledRef.current;
      fpsAcc = fpsAcc * 0.92 + (1000 / Math.max(dt, 0.01)) * 0.08;
      let frameMs = 16.6 + rand(-1.2, 1.2);
      if (!on) {
        const churn = 8 + Math.floor(Math.random() * 8);
        for (let i = 0; i < churn; i++) {
          dots[Math.floor(Math.random() * dots.length)] = {
            x: rand(8, W - 8), y: rand(8, FIELD_H - 8),
            vx: rand(-3, 3), vy: rand(-2.4, 2.4), r: rand(2, 5),
          };
        }
        frameMs += churn * rand(0.4, 1.1);
        if (Math.random() < 0.06) {
          frameMs += rand(24, 40);
          gc++;
        }
      }
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 6 || d.x > W - 6) d.vx *= -1;
        if (d.y < 6 || d.y > FIELD_H - 6) d.vy *= -1;
      });
      history.push(Math.min(frameMs, 60));
      if (history.length > 130) history.shift();
      if (frame % 12 === 0) {
        const sorted = [...history].sort((a, b) => a - b);
        setStats({
          fps: Math.round(Math.min(99, fpsAcc)),
          gc,
          p95: Math.round(sorted[Math.floor(sorted.length * 0.95)]),
        });
      }
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0c0b0a';
      ctx.fillRect(0, 0, W, H);
      dots.forEach((d) => {
        const jitter = on ? 0 : Math.random() * 1.6;
        ctx.fillStyle = on ? 'rgba(224,138,60,0.85)' : 'rgba(217,95,75,0.8)';
        ctx.beginPath();
        ctx.arc(d.x + jitter, d.y + jitter, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.strokeStyle = 'rgba(236,228,210,0.16)';
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(4.5, 4.5, W - 9, FIELD_H - 9);
      ctx.setLineDash([]);
      const gy = FIELD_H + 12;
      const gh = H - gy - 18;
      const yOf = (ms: number) => gy + gh - Math.min(ms / 60, 1) * gh;
      ctx.strokeStyle = 'rgba(236,228,210,0.14)';
      ctx.beginPath();
      ctx.moveTo(0.5, yOf(16.6));
      ctx.lineTo(W, yOf(16.6));
      ctx.stroke();
      ctx.beginPath();
      history.forEach((ms, i) => {
        const x = (i / (history.length - 1)) * W;
        const y = yOf(ms);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = history.some((ms) => ms > 30) ? '#d95f4b' : '#e08a3c';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.lineWidth = 1;
    };

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  return (
    <div ref={ref}>
      <Tilt max={4}><div className="fig" style={{ '--pcc': 'var(--p-orange)' } as React.CSSProperties}>
        <div className="fig-cap"><span>FIG. 03 — FRAME TIMES</span><span>{stage === 0 ? 'UNSTABLE' : 'LIVE RIG'}</span></div>
        <div className="stage-cross">
          <svg viewBox="0 0 300 120" style={{ width: '100%', height: 'auto', opacity: stage === 0 ? 1 : 0 }} aria-hidden={stage !== 0}>
            {[46, 88, 34, 96, 52, 110, 40, 92].map((h, i) => (
              <rect key={i} x={14 + i * 34} y={112 - h} width={20} height={h} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
            ))}
            <line x1="6" y1="112" x2="294" y2="112" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div style={{ opacity: stage === 0 ? 0 : 1 }} aria-hidden={stage === 0}>
            <canvas ref={canvasRef} width={W} height={H} style={{ width: '100%', height: 'auto', borderRadius: 4, background: '#0c0b0a' }} aria-label="Entity field and frame-time graph simulation" />
          </div>
        </div>
      </div>
      </Tilt>
      <div className="demo-well">
        <div className="diagline">
          <div><span className="k">POOLING </span><span className={pooled ? 'ok' : 'err'}>{pooled ? 'ON — REUSE' : 'OFF — ALLOCATE'}</span></div>
          <div><span className="k">FPS </span>{reduced ? '60 (STATIC)' : stats.fps} · <span className="k">P95 </span>{reduced ? '17MS' : `${stats.p95}MS`} · <span className="k">GC </span>{reduced ? 'DOCUMENTED BELOW' : `${stats.gc} EVENTS`}</div>
        </div>
        <div className="demo-row">
          <button
            type="button"
            className="dbtn"
            style={{ '--pcc': 'var(--p-orange)' } as React.CSSProperties}
            onClick={() => setPooled((v) => !v)}
            aria-pressed={pooled}
          >
            POOLING: {pooled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
      <p className="presult" style={{ fontSize: '1rem' }}>{project.outcome}</p>
    </div>
  );
}
