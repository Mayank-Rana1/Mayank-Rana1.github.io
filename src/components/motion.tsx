import { useEffect, useRef, useState, type ReactNode } from 'react';
import { elementProgress, onScrollFrame } from '../lib/scroll';

function motionAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(pointer: coarse)').matches) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (document.documentElement.dataset.motion === 'reduced') return false;
  return true;
}

/**
 * Magnetic wrapper: the child tugs gently toward the pointer within
 * ~120px and springs back. Pointer-fine devices only; inert otherwise.
 */
export function Magnetic({
  children,
  strength = 10,
  radius = 130,
  className,
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let active = false;
    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      if (Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05 && tx === 0 && ty === 0) {
        el.style.transform = '';
        active = false;
        return;
      }
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!active) {
        active = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      if (d < radius && d > 1) {
        tx = (dx / radius) * strength;
        ty = (dy / radius) * strength;
      } else {
        tx = 0;
        ty = 0;
      }
      kick();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [strength, radius]);

  return (
    <span ref={ref} className={className} style={{ display: 'inline-flex' }}>
      {children}
    </span>
  );
}

/**
 * Subtle 3D tilt following the pointer. Decorative only — content is
 * fully legible without it, and it never activates on touch/reduced motion.
 */
export function Tilt({
  children,
  max = 5,
  className,
  style,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const apply = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      el.style.transform = `perspective(900px) rotateX(${cy.toFixed(2)}deg) rotateY(${cx.toFixed(2)}deg)`;
      if (Math.abs(tx - cx) > 0.02 || Math.abs(ty - cy) > 0.02) {
        raf = requestAnimationFrame(apply);
      } else if (tx === 0 && ty === 0) {
        el.style.transform = '';
      } else {
        raf = requestAnimationFrame(apply);
      }
    };
    const kick = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tx = Math.max(-1, Math.min(1, px)) * max;
      ty = Math.max(-1, Math.min(1, -py)) * max;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [max]);

  return (
    <div ref={ref} className={className} style={{ ...style, willChange: 'transform' }}>
      {children}
    </div>
  );
}

/**
 * Scroll-linked depth. The child rises a few pixels and settles at scale 1
 * as it crosses the viewport. Transform only; no layout reads in React.
 */
export function Parallax({
  children,
  distance = 22,
  scale = 0.02,
  className,
}: {
  children: ReactNode;
  distance?: number;
  scale?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    const clear = onScrollFrame(() => {
      const p = elementProgress(el);
      const y = (0.5 - p) * distance;
      const s = 1 - scale + p * scale;
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
    });
    return () => {
      clear();
      el.style.transform = '';
    };
  }, [distance, scale]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}

/**
 * Finale scale-up: a large block arrives slightly small and grows into
 * place. It resolves by the time the block's top reaches the upper third
 * of the viewport, so the last section on the page always finishes.
 */
export function ScaleIn({
  children,
  from = 0.95,
  className,
}: {
  children: ReactNode;
  from?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    const clear = onScrollFrame(() => {
      const vh = window.innerHeight || 1;
      const top = el.getBoundingClientRect().top;
      const raw = Math.min(1, Math.max(0, (vh * 0.9 - top) / (vh * 0.55)));
      const eased = raw * raw * (3 - 2 * raw);
      const s = from + (1 - from) * eased;
      el.style.transform = `scale(${s.toFixed(4)})`;
      el.style.opacity = (0.55 + 0.45 * eased).toFixed(3);
    });
    return () => {
      clear();
      el.style.transform = '';
      el.style.opacity = '';
    };
  }, [from]);

  return (
    <div ref={ref} className={className} style={{ transformOrigin: '50% 0%', willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
}

const GLYPHS = '!<>-_\\/[]{}=+*^?#';

function seed(text: string): string {
  let out = '';
  for (const ch of text) {
    out += ch === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}

function scrambleTick(setText: (s: string) => void, final: string, done: () => void) {
  const timers: number[] = [];
  const total = Math.max(500, final.length * 34);
  const started = performance.now();
  const step = () => {
    const elapsed = performance.now() - started;
    const settled = Math.floor((elapsed / total) * final.length);
    if (settled >= final.length) {
      setText(final);
      done();
      return;
    }
    let out = '';
    for (let i = 0; i < final.length; i++) {
      const ch = final[i];
      if (ch === ' ' || i < settled) out += ch;
      else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }
    setText(out);
    timers.push(window.setTimeout(step, 42));
  };
  step();
  return () => timers.forEach((t) => window.clearTimeout(t));
}

/**
 * One-shot text decode. Runs a single time when scrolled into view;
 * renders instantly under reduced motion or without observers.
 */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const calm = () =>
    typeof window !== 'undefined' &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.motion === 'reduced' ||
      typeof IntersectionObserver === 'undefined');
  const [display, setDisplay] = useState(() => (calm() ? text : seed(text)));

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current || calm()) return;
    let cancel: (() => void) | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !started.current) {
          started.current = true;
          cancel = scrambleTick(setDisplay, text, () => undefined);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancel?.();
    };
  }, [text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
