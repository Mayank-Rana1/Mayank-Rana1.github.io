import { journey, profile } from '../data/portfolio';
import { IconFile } from './icons';
import { useInView } from '../lib/reveal';

/**
 * The finale: an almost entirely dark section, one large question,
 * direct channels - then the signature line completes into the MR
 * monogram. No folding books, no cinema.
 */
export default function Contact() {
  const { ref, visible } = useInView<HTMLDivElement>(0.25);
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title" style={{ padding: 'clamp(72px, 12vh, 140px) 0 30px' }}>
      <div className="wrap" ref={ref}>
        <p className="eyebrow" style={{ color: 'var(--vermilion)' }}>Contact</p>
        <h2 id="contact-title" className="contact-title" style={{ marginTop: 14 }}>
          <span className={`rv${visible ? ' in' : ''}`}><span className="rv-in">Have a difficult system</span></span>
          <span className={`rv${visible ? ' in' : ''}`}><span className="rv-in">worth building?</span></span>
        </h2>
        <p className="contact-sub">
          I am open to software engineering internships, technical collaborations,
          open-source work, and ambitious product ideas.
        </p>
        <div className="contact-actions">
          <a className="btn btn-vermilion" href={`mailto:${profile.email}`}>
            Email Mayank
          </a>
          <a className="btn btn-light" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="btn btn-light" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="btn btn-light" href={profile.resume} download="Mayank_Rana_SWE.pdf">
            <IconFile size={15} /> Resume
          </a>
        </div>
        <ul className="contact-links">
          <li><a href="https://www.codechef.com/users/mayank_rana17" target="_blank" rel="noopener noreferrer">CodeChef</a></li>
          <li><a href="https://leetcode.com/u/Mayank_Rana/" target="_blank" rel="noopener noreferrer">LeetCode</a></li>
          <li><a href="https://codeforces.com/profile/Mayank_Rana7" target="_blank" rel="noopener noreferrer">Codeforces</a></li>
          <li><span style={{ color: 'var(--ivory-faint)' }}>{profile.location}</span></li>
        </ul>
        <div className={`mono-finale draw${visible ? ' in' : ''}`}>
          <svg viewBox="0 0 560 120" role="presentation" aria-hidden="true">
            <path pathLength={1} d="M40 100 H250" fill="none" stroke="var(--vermilion)" strokeWidth="2" />
            <circle pathLength={1} cx="410" cy="60" r="44" fill="none" stroke="var(--vermilion)" strokeWidth="2" />
            <text x="410" y="72" textAnchor="middle" fontFamily="Newsreader, Georgia, serif" fontWeight="700" fontSize="34" fill="var(--ivory)">MR</text>
          </svg>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.68rem', letterSpacing: '0.24em', color: 'var(--ivory-faint)', marginTop: 6 }}>
            BUILT FROM FIRST PRINCIPLES
          </p>
        </div>
        <footer className="footer-min">
          <span>&copy; 2026 MAYANK RANA &middot; BHOPAL, INDIA</span>
          <span>CODECHEF {journey.cp.codechef} &middot; {profile.education.cgpa} CGPA</span>
        </footer>
      </div>
    </section>
  );
}

