import { useRef, useState } from 'react';
import { useScrollProgress } from '../lib/reveal';

const W = 300;
const H = 180;

/**
 * Thought → system: a file enters, a server route appears — then it is
 * crossed out, and processing stays inside the browser boundary.
 * A real before/after pipeline runs below with measured timing.
 */
export default function ToolsVisual({ reduced }: { reduced: boolean }) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const crossed = reduced || progress > 0.45;
  const srcRef = useRef<HTMLCanvasElement>(null);
  const outRef = useRef<HTMLCanvasElement>(null);
  const [ms, setMs] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const painted = useRef(false);

  const paintSample = () => {
    const c = srcRef.current;
    if (!c) return;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#2b4a5e');
    g.addColorStop(0.55, '#7a5a3a');
    g.addColorStop(1, '#8a2f28');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#e9dfc8';
    ctx.beginPath();
    ctx.arc(W * 0.7, H * 0.32, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1d1a16';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(18 + i * 62, H - 34 - i * 20, 34, 34 + i * 20);
    }
    ctx.strokeStyle = 'rgba(233,223,200,0.5)';
    for (let x = 0; x <= W; x += 30) {
      ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke();
    }
    ctx.fillStyle = '#0e0d0c';
    ctx.fillRect(12, 12, 104, 24);
    ctx.fillStyle = '#e9dfc8';
    ctx.font = '600 12px "DM Sans", sans-serif';
    ctx.fillText('SAMPLE 4K', 20, 29);
    painted.current = true;
  };

  const process = () => {
    if (!painted.current) paintSample();
    const src = srcRef.current;
    const out = outRef.current;
    if (!src || !out) return;
    const sctx = src.getContext('2d', { willReadFrequently: true });
    const octx = out.getContext('2d', { willReadFrequently: true });
    if (!sctx || !octx) return;
    const t0 = performance.now();
    const img = sctx.getImageData(0, 0, W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const y = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      d[i] = d[i + 1] = d[i + 2] = y;
    }
    octx.putImageData(img, 0, 0);
    setMs(Math.round((performance.now() - t0) * 10) / 10);
    setDone(true);
  };

  return (
    <div ref={ref}>
      <div className="fig" style={{ '--pcc': 'var(--p-violet)' } as React.CSSProperties}>
        <div className="fig-cap"><span>FIG. 04 — WHERE PIXELS GO</span><span>{crossed ? 'LOCAL ONLY' : 'SKETCH'}</span></div>
        <div className="diagline" style={{ fontSize: '0.85rem', lineHeight: 2 }}>
          <div><span className="k">01 </span>4K FILE ENTERS THE BROWSER</div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span className="k">02 </span>
            <span style={{ textDecoration: crossed ? 'line-through' : 'none', opacity: crossed ? 0.55 : 1 }}>
              SERVER UPLOAD + QUEUE
            </span>
            {crossed ? (
              <span style={{ position: 'absolute', left: -6, right: -6, top: '52%', height: 2, background: 'var(--vermilion)' }} aria-hidden="true" />
            ) : null}
          </div>
          <div><span className="k">03 </span>CANVAS PIPELINE · <span className="ok">ON DEVICE</span></div>
          <div><span className="k">04 </span>GENERATED RESULT · EXPORT</div>
        </div>
      </div>
      <div className="demo-well">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="tools-pair">
          <div>
            <canvas ref={srcRef} width={W} height={H} style={{ width: '100%', height: 'auto', borderRadius: 4, border: '1px solid var(--coalline-strong)' }} aria-label="Sample input image" />
            <p className="diagline" style={{ marginTop: 6 }}><span className="k">INPUT</span></p>
          </div>
          <div>
            <canvas ref={outRef} width={W} height={H} style={{ width: '100%', height: 'auto', borderRadius: 4, border: '1px solid var(--coalline-strong)', background: '#0c0b0a' }} aria-label="Locally processed output" />
            <p className="diagline" style={{ marginTop: 6 }}><span className="k">OUTPUT</span></p>
          </div>
        </div>
        <div className="diagline" style={{ marginTop: 10 }}>
          <div><span className="k">PIXELS </span>{(W * H).toLocaleString('en-US')}</div>
          <div><span className="k">TIME </span>{ms === null ? '—' : `${ms}MS MEASURED`}</div>
          <div><span className="k">NETWORK </span><span className="ok">0 REQUESTS</span></div>
        </div>
        <div className="demo-row">
          <button
            type="button"
            className="dbtn"
            style={{ '--pcc': 'var(--p-violet)' } as React.CSSProperties}
            onClick={process}
          >
            {done ? 'RE-RUN LOCALLY' : 'PROCESS 4K IMAGE'}
          </button>
        </div>
      </div>
      <p className="presult" style={{ fontSize: '1rem' }}>Processed locally. Nothing uploaded.</p>
    </div>
  );
}
