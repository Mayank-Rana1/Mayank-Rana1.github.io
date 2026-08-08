import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/portfolio';
import { useScrollProgress } from '../lib/reveal';

type LogLine = { ms: number; text: string; kind?: 'err' | 'ok' };

/**
 * Thought → system: a rough whiteboard sketch crossfades into the polished
 * live route. Packets travel; on arrival at the polished stage a provider
 * briefly fails once, on its own, and traffic moves — then the visitor can
 * replay it. Reduced motion: static polished route, manual replay only.
 */
export default function GatewayVisual({ reduced }: { reduced: boolean }) {
  const project = projects[0];
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const stage = reduced ? 1 : progress < 0.4 ? 0 : progress < 0.78 ? 1 : 2;
  const [phase, setPhase] = useState<'idle' | 'running' | 'failed'>('idle');
  const [log, setLog] = useState<LogLine[]>([{ ms: 0, text: 'gateway listening' }]);
  const [failoverMs, setFailoverMs] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  const t0 = useRef(0);
  const autoFired = useRef(false);

  useEffect(() => () => {
    timers.current.forEach((id) => window.clearTimeout(id));
  }, []);

  const push = (text: string, kind?: 'err' | 'ok') => {
    const ms = Math.round(performance.now() - t0.current);
    setLog((prev) => [...prev.slice(-6), { ms, text, kind }]);
  };

  const run = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setLog([]);
    setFailoverMs(null);
    setPhase('running');
    t0.current = performance.now();
    const steps: [number, string, 'err' | 'ok' | undefined][] = [
      [0, 'outbound request received', undefined],
      [380, 'primary provider timeout', 'err'],
      [760, 'circuit breaker OPEN', 'err'],
      [1140, 'failover provider engaged', 'ok'],
      [1520, 'stream normalized — 200 OK', 'ok'],
    ];
    if (reduced) {
      steps.forEach(([, text, kind]) => push(text, kind));
      setFailoverMs(0);
      setPhase('failed');
      return;
    }
    steps.forEach(([at, text, kind], i) => {
      timers.current.push(window.setTimeout(() => {
        push(text, kind);
        if (i === steps.length - 1) {
          setFailoverMs(Math.round(performance.now() - t0.current));
          setPhase('failed');
        }
      }, at));
    });
  };

  useEffect(() => {
    if (stage === 2 && !autoFired.current && !reduced) {
      autoFired.current = true;
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const failed = phase !== 'idle';
  const failedDone = phase === 'failed';

  return (
    <div ref={ref}>
      <div className="fig" style={{ '--pcc': 'var(--p-green)' } as React.CSSProperties}>
        <div className="fig-cap"><span>FIG. 01 — REQUEST PATH</span><span>{stage === 0 ? 'SKETCH' : 'LIVE'}</span></div>
        <div className="stage-cross">
          <pre className="fig-sketch" style={{ opacity: stage === 0 ? 1 : 0 }} aria-hidden={stage !== 0}>{'Client\n  |\n API?  -- what shape?\n  |\nProvider'}</pre>
          <div style={{ opacity: stage === 0 ? 0 : 1 }} aria-hidden={stage === 0}>
            <svg viewBox="0 0 300 190" style={{ width: '100%', height: 'auto' }} role="presentation">
              <path d="M150 8 V182" stroke="var(--p-green)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />
              {!reduced ? (
                <>
                  <circle r="4" fill="var(--p-green-bright)">
                    <animateMotion dur="2.6s" repeatCount="indefinite" path="M150 8 V182" />
                  </circle>
                  <circle r="4" fill="var(--p-green-bright)" opacity="0.7">
                    <animateMotion dur="2.6s" begin="1.3s" repeatCount="indefinite" path="M150 8 V182" />
                  </circle>
                </>
              ) : null}
            </svg>
            <div className="diagline" style={{ marginTop: 6 }}>
              <div><span className="k">01 </span>CLIENT · one JSON contract</div>
              <div><span className="k">02 </span>GATEWAY · FastAPI + AsyncIO</div>
              <div><span className="k">03 </span>ROUTER · <span className={failed ? 'err' : 'ok'}>{failed ? 'PRIMARY DOWN → FAILOVER' : 'PRIMARY HEALTHY'}</span></div>
              <div><span className="k">04 </span>SSE STREAM · normalized</div>
            </div>
          </div>
        </div>
      </div>
      <div className="diagline" style={{ marginTop: 12 }}>
        <div><span className="k">CIRCUIT </span><span className={failed ? 'err' : 'ok'}>{failed ? 'OPEN' : 'CLOSED'}</span>
        {failoverMs !== null ? <span> · FAILOVER IN {failoverMs}MS</span> : null}</div>
        {log.slice(-3).map((l, i) => (
          <div key={i}><span className="k">t+{l.ms}ms </span><span className={l.kind ?? ''}>{l.text}</span></div>
        ))}
      </div>
      {failedDone ? <p className="presult" style={{ fontSize: '1rem' }}>{project.outcome}</p> : null}
      <div className="demo-row">
        <button type="button" className="dbtn" style={{ '--pcc': 'var(--p-green)' } as React.CSSProperties} disabled={phase === 'running'} onClick={run}>
          {phase === 'idle' ? 'SIMULATE PROVIDER FAILURE' : phase === 'failed' ? 'REPLAY FAILOVER' : 'RUNNING…'}
        </button>
      </div>
    </div>
  );
}
