import { useEffect, useState } from 'react';
import { useInView } from '../lib/reveal';

type Metric = {
  no: string;
  value: number;
  suffix: string;
  label: string;
  note?: string;
  lead?: boolean;
  doodle: React.ReactNode;
};

const METRICS: Metric[] = [
  {
    no: '01',
    value: 800,
    suffix: '+',
    label: 'Algorithmic problems solved',
    note: 'CodeChef 1624 · Codeforces 1324',
    lead: true,
    doodle: (
      <svg viewBox="0 0 74 42" aria-hidden="true" fill="none" stroke="var(--vermilion)" strokeWidth="1.6">
        <circle pathLength={1} cx="12" cy="12" r="5" /><circle pathLength={1} cx="38" cy="8" r="5" /><circle pathLength={1} cx="62" cy="16" r="5" />
        <circle pathLength={1} cx="24" cy="32" r="5" /><circle pathLength={1} cx="52" cy="34" r="5" />
        <path pathLength={1} d="M17 14 33 9M43 9 57 15M15 17l5 10M33 13l-5 14M43 12l4 17M57 21l-3 8" opacity="0.7" />
      </svg>
    ),
  },
  {
    no: '02',
    value: 25,
    suffix: '%',
    label: 'Lower gateway latency',
    doodle: (
      <svg viewBox="0 0 44 26" aria-hidden="true" fill="none" stroke="var(--vermilion)" strokeWidth="1.6">
        <path pathLength={1} d="M3 20 H18 L24 8 H41" />
        <path pathLength={1} d="M35 8h6v6" />
        <circle pathLength={1} cx="8" cy="20" r="2.4" fill="var(--vermilion)" stroke="none" />
      </svg>
    ),
  },
  {
    no: '03',
    value: 97,
    suffix: '%',
    label: 'Neural-network accuracy',
    doodle: (
      <svg viewBox="0 0 44 26" aria-hidden="true" fill="none" stroke="var(--vermilion)" strokeWidth="1.6">
        <path pathLength={1} d="M3 22 C12 22 14 14 22 14 C30 14 30 6 41 5" />
        <circle pathLength={1} cx="41" cy="5" r="2.4" fill="var(--vermilion)" stroke="none" />
      </svg>
    ),
  },
  {
    no: '04',
    value: 60,
    suffix: ' FPS',
    label: 'On budget Android hardware',
    doodle: (
      <svg viewBox="0 0 44 26" aria-hidden="true" fill="none" stroke="var(--vermilion)" strokeWidth="1.6">
        <path pathLength={1} d="M4 20V10M12 20V6M20 20V12M28 20V6M36 20V6" />
        <path pathLength={1} d="M2 6H42" opacity="0.7" />
      </svg>
    ),
  },
];

function useCountUp(target: number, active: boolean, reduced: boolean): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1250;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, reduced]);

  if (!active) return 0;
  return reduced ? target : value;
}

function Counter({ metric, active, reduced }: { metric: Metric; active: boolean; reduced: boolean }) {
  const shown = useCountUp(metric.value, active, reduced);
  return (
    <p className="pv" aria-label={`${metric.value}${metric.suffix} ${metric.label}`}>
      <span aria-hidden="true">
        {shown.toLocaleString('en-US')}
        {metric.suffix}
      </span>
    </p>
  );
}

/**
 * Immediate proof: four bold evidence blocks in an asymmetric bento.
 * Numbers count once when the strip enters view; the drawings draw
 * themselves at the same moment. Reduced motion renders final values.
 */
export default function ProofStrip({ reduced }: { reduced: boolean }) {
  const { ref, visible } = useInView<HTMLDivElement>(0.3);
  return (
    <section className="proof" aria-label="Key results">
      <div className="wrap">
        <div className="proof-head" aria-hidden="true">
          <span><strong>EVIDENCE</strong> / 01&ndash;04</span>
          <span>MEASURED, NOT CLAIMED</span>
        </div>
        <div ref={ref} className={`proof-grid draw${visible ? ' in' : ''}`}>
          {METRICS.map((m) => (
            <div className={`proof-cell${m.lead ? ' proof-lead' : ''}`} key={m.label}>
              <span className="pno">{m.no}</span>
              {m.doodle}
              <Counter metric={m} active={visible} reduced={reduced} />
              <p className="pl">{m.label}</p>
              {m.note ? <p className="pl" style={{ marginTop: 4, opacity: 0.65, fontFamily: 'var(--mono)', fontSize: '0.66rem', letterSpacing: '0.08em' }}>{m.note}</p> : null}
              {m.lead ? (
                <a className="plink" href="#journey">
                  TRACE THE PRACTICE <span aria-hidden="true">&rarr;</span>
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
