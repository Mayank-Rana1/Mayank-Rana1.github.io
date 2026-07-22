import { journey } from '../data/portfolio';
import { useInView, useScrollProgress } from '../lib/reveal';

/**
 * Clean vertical timeline. The signature line draws itself downward
 * with scroll - familiar, connected, and quiet.
 */
const ENTRIES: { year: string; title: string; body: string; stat?: string }[] = [
  { year: '2024', title: 'Started competitive programming', body: 'Entered the arena: graphs, dynamic programming, trees \u2014 the long game of fundamentals.' },
  { year: '800+', title: 'Problems solved', body: `CodeChef max ${journey.cp.codechef} \u00b7 Codeforces max ${journey.cp.codeforces}. Proof of depth, repeated daily.`, stat: '800+' },
  { year: 'CODAME', title: journey.leadership.role, body: `${journey.leadership.org}. ${journey.leadership.period}.` },
  { year: 'OPTIGO', title: 'Inter-IIIT coding competition', body: 'Organized for 5,000+ concurrent student participants across institutes.' },
  { year: '15+', title: 'Original algorithmic problems', body: 'Authored with rigorous edge-case test sets \u2014 setting problems teaches more than solving them.' },
  { year: '50+', title: 'Students mentored', body: 'Taught C++ memory management, OOP, and DSA fundamentals to juniors.' },
  { year: '2028', title: 'Expected B.Tech graduation', body: 'Computer Science & Engineering (Artificial Intelligence), IIIT Bhopal.' },
];

export default function Journey() {
  const { ref: headRef, visible } = useInView<HTMLDivElement>(0.25);
  const { ref: tlRef, progress } = useScrollProgress<HTMLDivElement>();
  return (
    <section id="journey" aria-labelledby="journey-title" style={{ padding: 'clamp(64px, 11vh, 130px) 0' }}>
      <div className="wrap" ref={headRef}>
        <div className="section-head">
          <p className="eyebrow">Journey</p>
          <h2 id="journey-title">
            <span className={`rv${visible ? ' in' : ''}`}><span className="rv-in">Measured in problems,</span></span>
            <span className={`rv${visible ? ' in' : ''}`}><span className="rv-in">people, and contests.</span></span>
          </h2>
        </div>
        <div ref={tlRef} className="timeline">
          <div className="tl-track" aria-hidden="true">
            <i style={{ ['--fill' as string]: progress.toFixed(3) }} />
          </div>
          {ENTRIES.map((e) => (
            <div className="tl-item" key={e.year + e.title}>
              <p className="tl-year">{e.year}</p>
              <h3>{e.title}</h3>
              <p>{e.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

