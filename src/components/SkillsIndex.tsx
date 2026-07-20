import { skills } from '../data/portfolio';
import { useInView } from '../lib/reveal';

/**
 * A large technical index - numbered rows, never pill clouds. Each
 * category earns a small line-drawn symbol when it enters view.
 */
function Symbol({ index }: { index: number }) {
  const common = {
    viewBox: '0 0 120 54',
    fill: 'none',
    stroke: 'var(--vermilion)',
    strokeWidth: 1.6,
    'aria-hidden': true,
  } as const;
  if (index === 0) {
    return (
      <svg {...common}>
        <path pathLength={1} d="M14 6 H5 V48 H14" />
        <path pathLength={1} d="M106 6 H115 V48 H115" />
        <path pathLength={1} d="M24 27 H96" opacity="0.45" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg {...common}>
        <circle pathLength={1} cx="18" cy="12" r="5" />
        <circle pathLength={1} cx="18" cy="42" r="5" />
        <circle pathLength={1} cx="62" cy="27" r="6" />
        <circle pathLength={1} cx="102" cy="27" r="5" />
        <path pathLength={1} d="M23 14 56 25M23 40 56 29M68 27H97" opacity="0.7" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg {...common}>
        <path pathLength={1} d="M6 44 H44 L58 18 H84 L96 30 H114" />
        <circle pathLength={1} cx="6" cy="44" r="3" fill="var(--vermilion)" stroke="none" />
        <circle pathLength={1} cx="114" cy="30" r="3" fill="var(--vermilion)" stroke="none" />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg {...common}>
        <rect pathLength={1} x="6" y="16" width="26" height="22" rx="2" />
        <rect pathLength={1} x="47" y="16" width="26" height="22" rx="2" />
        <rect pathLength={1} x="88" y="16" width="26" height="22" rx="2" />
        <path pathLength={1} d="M32 27H47M73 27H88" opacity="0.7" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path pathLength={1} d="M60 6 V22 M60 22 L32 48 M60 22 V48 M60 22 L88 48" />
      <circle pathLength={1} cx="60" cy="6" r="3.5" />
      <circle pathLength={1} cx="32" cy="48" r="3" />
      <circle pathLength={1} cx="60" cy="48" r="3" />
      <circle pathLength={1} cx="88" cy="48" r="3" />
    </svg>
  );
}

export default function SkillsIndex() {
  const { ref, visible } = useInView<HTMLDivElement>(0.2);
  return (
    <section id="capabilities" className="skills-sec" aria-labelledby="skills-title" style={{ padding: 'clamp(64px, 11vh, 130px) 0' }}>
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Capabilities</p>
          <h2 id="skills-title">
            <span className={`rv${visible ? ' in' : ''}`}><span className="rv-in">A technical index,</span></span>
            <span className={`rv${visible ? ' in' : ''}`}><span className="rv-in">not a sticker wall.</span></span>
          </h2>
          <p className="lead">Five groups, each earning its symbol as it enters the viewport.</p>
        </div>
        <div ref={ref} className={`draw${visible ? ' in' : ''}`} style={{ marginTop: 18 }}>
          {skills.map((s, i) => (
            <div className="skill-row" key={s.group}>
              <span className="sno">0{i + 1}</span>
              <span className="sname">{s.group.toUpperCase()}</span>
              <span className="sitems">{s.items.join(' \u00b7 ')}</span>
              <span className="ssymbol"><Symbol index={i} /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

