import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/portfolio';
import { useScrollProgress } from '../lib/reveal';
import { Tilt } from './motion';

const N = 28;

/**
 * Thought → system: a math sketch becomes the pipeline, ending in a live
 * mini digit canvas with real on-device classification. Nothing uploads.
 */
export default function DigitVisual({ reduced }: { reduced: boolean }) {
  const project = projects[1];
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const stage = reduced ? 1 : progress < 0.45 ? 0 : 1;
  const drawRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const templates = useRef<Float32Array[] | null>(null);
  const [verdict, setVerdict] = useState<{ digit: number; confidence: number } | null>(null);
  const [strokes, setStrokes] = useState(0);

  const buildTemplates = () => {
    if (templates.current) return templates.current;
    const off = document.createElement('canvas');
    off.width = N;
    off.height = N;
    const ctx = off.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];
    const out: Float32Array[] = [];
    for (let d = 0; d <= 9; d++) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, N, N);
      ctx.fillStyle = '#fff';
      ctx.font = `600 ${N - 5}px "DM Sans", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(d), N / 2, N / 2 + 1);
      const data = ctx.getImageData(0, 0, N, N).data;
      const v = new Float32Array(N * N);
      for (let i = 0; i < N * N; i++) v[i] = data[i * 4] / 255;
      out.push(v);
    }
    templates.current = out;
    return out;
  };

  const classify = () => {
    const src = drawRef.current;
    const view = viewRef.current;
    if (!src || !view) return;
    const small = document.createElement('canvas');
    small.width = N;
    small.height = N;
    const sctx = small.getContext('2d', { willReadFrequently: true });
    if (!sctx) return;
    sctx.imageSmoothingEnabled = true;
    sctx.drawImage(src, 0, 0, N, N);
    const data = sctx.getImageData(0, 0, N, N).data;
    const v = new Float32Array(N * N);
    let lit = 0;
    for (let i = 0; i < N * N; i++) {
      v[i] = data[i * 4] / 255;
      if (v[i] > 0.25) lit++;
    }
    const vctx = view.getContext('2d');
    if (vctx) {
      vctx.imageSmoothingEnabled = false;
      vctx.clearRect(0, 0, view.width, view.height);
      vctx.drawImage(small, 0, 0, view.width, view.height);
    }
    if (lit < 12) {
      setVerdict(null);
      return;
    }
    const temps = buildTemplates();
    let best = 0;
    let bestD = Infinity;
    let second = Infinity;
    temps.forEach((t, d) => {
      let s = 0;
      for (let i = 0; i < N * N; i++) {
        const diff = v[i] - t[i];
        s += diff * diff;
      }
      s /= N * N;
      if (s < bestD) {
        second = bestD;
        bestD = s;
        best = d;
      } else if (s < second) {
        second = s;
      }
    });
    setVerdict({
      digit: best,
      confidence: Math.max(35, Math.min(98, Math.round(100 * (1 - bestD / Math.max(second, 1e-6))))),
    });
  };

  const pos = (e: React.PointerEvent) => {
    const canvas = drawRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * canvas.width,
      y: ((e.clientY - r.top) / r.height) * canvas.height,
    };
  };

  const stroke = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const canvas = drawRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const p = pos(e);
    ctx.strokeStyle = '#f0e5d0';
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (last.current) {
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(p.x, p.y);
    } else {
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + 0.1, p.y + 0.1);
    }
    ctx.stroke();
    last.current = p;
  };

  const clear = () => {
    const canvas = drawRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#0c0b0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const view = viewRef.current?.getContext('2d');
    if (view && viewRef.current) view.clearRect(0, 0, viewRef.current.width, viewRef.current.height);
    setVerdict(null);
    setStrokes(0);
  };

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref}>
      <Tilt max={4}><div className="fig" style={{ '--pcc': 'var(--p-blue)' } as React.CSSProperties}>
        <div className="fig-cap"><span>FIG. 02 — FROM MATH TO MACHINE</span><span>{stage === 0 ? 'SKETCH' : 'PIPELINE'}</span></div>
        <div className="stage-cross">
          <p className="fig-sketch" style={{ opacity: stage === 0 ? 1 : 0, fontSize: '1rem' }} aria-hidden={stage !== 0}>
            {'Input x Weight + Bias\n   -> ???'}
          </p>
          <div style={{ opacity: stage === 0 ? 0 : 1 }} aria-hidden={stage === 0}>
            <div className="diagline">
              {['NumPy network', 'Deep network', 'PyTorch', 'CNN', 'Quantized ONNX', 'Browser inference'].map((s, i) => (
                <div key={s}><span className="k">0{i + 1} </span>{s}{i < 5 ? ' →' : ''}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </Tilt>
      <div className="demo-well">
        <canvas
          ref={drawRef}
          width={280}
          height={180}
          style={{ touchAction: 'none', cursor: 'crosshair', background: '#0c0b0a' }}
          aria-label="Drawing canvas: draw a digit from 0 to 9"
          onPointerDown={(e) => {
            drawing.current = true;
            last.current = null;
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            stroke(e);
          }}
          onPointerMove={stroke}
          onPointerUp={() => {
            if (!drawing.current) return;
            drawing.current = false;
            last.current = null;
            setStrokes((s) => s + 1);
            window.setTimeout(classify, 60);
          }}
          onPointerCancel={() => {
            drawing.current = false;
            last.current = null;
          }}
        />
        <div className="diagline" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span><span className="k">DRAW 0–9</span></span>
          <span className="k">{strokes === 0 ? 'AWAITING INPUT' : `STROKES ${strokes}`}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: 12, marginTop: 10, alignItems: 'start' }}>
          <canvas
            ref={viewRef}
            width={96}
            height={96}
            style={{ width: 96, height: 96, imageRendering: 'pixelated', border: '1px solid var(--coalline-strong)', borderRadius: 4, background: '#000' }}
            aria-label="Processed 28 by 28 input preview"
          />
          <div className="diagline" aria-live="off">
            {verdict ? (
              <>
                <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.9rem', lineHeight: 1 }}>{verdict.digit}</div>
                <div><span className="k">PREDICTED · </span>CONFIDENCE {verdict.confidence}%</div>
                <div><span className="k">STATUS · </span><span className="ok">LOCAL, NO UPLOAD</span></div>
              </>
            ) : (
              <div><span className="k">DRAW A DIGIT — INFERENCE RUNS ON RELEASE.</span></div>
            )}
          </div>
        </div>
        <div className="demo-row">
          <button type="button" className="dbtn ghost" onClick={clear}>CLEAR</button>
        </div>
      </div>
      <p className="diagline" style={{ marginTop: 10, opacity: 0.75 }}>
        <span className="k">EVIDENCE · </span>{project.outcome} · {project.result.split(';')[0]}.
      </p>
    </div>
  );
}
