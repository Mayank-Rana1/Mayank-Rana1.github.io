import { useInView } from '../lib/reveal';

const METRICS: { value: string; small?: string; label: string; doodle: React.ReactNode }[] = [
  {
    value: '800+', label: 'Algorithmic problems solved',
    doodle: (
      <svg viewBox="0 0 44 26" aria-hidden="true" fill="none" stroke="var(--vermilion)" strokeWidth="1.6">
        <circle cx="8" cy="8" r="3.5" /><circle cx="24" cy="6" r="3.5" /><circle cx="37" cy="10" r="3.5" />
        <circle cx="15" cy="19" r="3.5" /><circle cx="31" cy="20" r="3.5" />
        <path d="M11 9.5 21 7M27.5 7 34 9M10 11l3.5 5M22 9.5l-4 6.5M26.5 9.5l2.5 7M34 13.5l-1.5 4" opacity="0.7" />
      </svg>
    ),
  },
  {
    value: '25', small: '%', label: 'Lower gateway latency',
    doodle: (
      <svg viewBox="0 0 44 26" aria-hidden="true" fill="none" stroke="var(--vermilion)" strokeWidth="1.6">
        <path d="M3 20 H18 L24 8 H41" />
        <path d="M35 8h6v6" />
        <circle cx="8" cy="20" r="2.4" fill="var(--vermilion)" stroke="none" />
      </svg>
    ),
  },
  {
    value: '97', small: '%', label: 'Neural-network accuracy',
    doodle: (
      <svg viewBox="0 0 44 26" aria-hidden="true" fill="none" stroke="var(--vermilion)" strokeWidth="1.6">
        <path d="M3 22 C12 22 14 14 22 14 C30 14 30 6 41 5" />
        <circle cx="41" cy="5" r="2.4" fill="var(--vermilion)" stroke="none" />
      </svg>
    ),
  },
  {
    value: '60', small: ' FPS', label: 'On budget Android hardware',
    doodle: (
      <svg viewBox="0 0 44 26" aria-hidden="true" fill="none" stroke="var(--vermilion)" strokeWidth="1.6">
        <path d="M4 20V10M12 20V6M20 20V12M28 20V6M36 20V6" />
        <path d="M2 6H42" opacity="0.7" />
      </svg>
    ),
  },
];

/**
 * Immediate proof strip: four bold evidence blocks with tiny line
 * drawings. Concise by design - recruiters get proof before case studies.
 */
export default function ProofStrip() {
  const { ref, visible } = useInView<HTMLDivElement>(0.3);
  return (
    <section className="proof" aria-label="Key results">
      <div className="wrap">
        <div ref={ref} className={`proof-grid draw${visible ? ' in' : ''}`}>
          {METRICS.map((m) => (
            <div className="proof-cell" key={m.label}>
              {m.doodle}
              <p className="pv">{m.value}{m.small ? <small>{m.small}</small> : null}</p>
              <p className="pl">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

