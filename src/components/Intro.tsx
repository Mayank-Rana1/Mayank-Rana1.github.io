import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const HOLD_MS = 1250;
const LEAVE_MS = 620;

/**
 * The opening cover: a short editorial title card that lifts away to reveal
 * the hero. Purely decorative, so it is hidden from assistive tech, skipped
 * for hash deep links, and never rendered for reduced motion.
 */
export default function Intro({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const finished = useRef(false);
  const leavingRef = useRef(false);
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    timers.current.forEach((id) => window.clearTimeout(id));
    document.documentElement.classList.remove('intro-open');
    document.documentElement.style.overflow = '';
    onDone();
  }, [onDone]);

  const leave = useCallback(() => {
    if (finished.current || leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    document.documentElement.classList.remove('intro-open');
    document.documentElement.style.overflow = '';
    timers.current.push(window.setTimeout(finish, LEAVE_MS));
  }, [finish]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const pending = timers.current;
    root.classList.add('intro-open');
    root.style.overflow = 'hidden';

    pending.push(window.setTimeout(leave, HOLD_MS));

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        leave();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      pending.forEach((id) => window.clearTimeout(id));
      timers.current = [];
      root.classList.remove('intro-open');
      root.style.overflow = previousOverflow;
    };
  }, [leave]);

  return (
    <div
      className={`intro${leaving ? ' is-leaving' : ''}`}
      aria-hidden="true"
      onClick={leave}
    >
      <div className="intro-grid">
        <div className="intro-top">
          <span className="intro-brand">
            <span className="intro-mark">MR</span>
            <span>Mayank Rana</span>
          </span>
          <span className="intro-edition">PORTFOLIO / 2026</span>
        </div>

        <div className="intro-center">
          <p className="intro-kicker">FIG. 00 &mdash; OPENING</p>
          <p className="intro-title">
            <span><span>Built from</span></span>
            <span><span><em>first principles.</em></span></span>
          </p>
          <div className="intro-rule"><i /></div>
          <p className="intro-note">Software engineer &middot; CSE (AI) at IIIT Bhopal</p>
        </div>

        <div className="intro-foot">
          <span>Bhopal, India &middot; 25.3176 N / 82.9739 E</span>
          <span className="intro-enter">Entering portfolio <i /></span>
        </div>
      </div>
      <div className="intro-progress"><i /></div>
    </div>
  );
}
