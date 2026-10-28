import { profile } from '../data/portfolio';
import { useInView } from '../lib/reveal';

/**
 * Asymmetric about: a large statement left, the person right -
 * plus education and coursework, never a giant biography.
 */
export default function About() {
  const { ref, visible } = useInView<HTMLDivElement>(0.25);
  return (
    <section id="about" aria-labelledby="about-title" style={{ padding: 'var(--section-y) 0' }}>
      <div className="wrap" ref={ref}>
        <p className="eyebrow">About</p>
        <div className="about-grid" style={{ marginTop: 16 }}>
          <div>
            <h2 id="about-title" className="about-state">
              <span className={`rv${visible ? ' in' : ''}`}><span className="rv-in">Curiosity is useful only</span></span>
              <span className={`rv${visible ? ' in' : ''}`} style={{ '--rd': '80ms' } as React.CSSProperties}><span className="rv-in">when it becomes implementation.</span></span>
            </h2>
            <ol className="principles">
              <li><span className="pn">01</span><span>Understand the system before touching it.</span></li>
              <li><span className="pn">02</span><span>Measure the change, not the effort.</span></li>
              <li><span className="pn">03</span><span>Ship the smallest dependable version.</span></li>
            </ol>
          </div>
          <div className={`about-body stag${visible ? ' in' : ''}`}>
            <p><strong>CSE (AI) undergraduate at IIIT Bhopal</strong>, interested in backend infrastructure and machine learning.</p>
            <p>Enjoys understanding internal systems &mdash; then making them dependable, measurable, and useful. Focuses on measurable improvements, and is open to engineering opportunities.</p>
            <div className="edu">
              <h3>{profile.education.school}</h3>
              <p>{profile.education.degree}<br />CGPA {profile.education.cgpa} &middot; Expected {profile.education.graduation}</p>
              <p style={{ marginTop: 8 }}><strong>Coursework:</strong> {profile.education.coursework.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

