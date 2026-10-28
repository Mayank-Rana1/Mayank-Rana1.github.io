import { useEffect, useRef, useState } from 'react';
import { elementProgress, onScrollFrame } from './scroll';
/** Adds `in` class when the element enters the viewport (once). Drives
 *  mask reveals (`.rv`), line drawings (`.draw`) and stagger groups. */
export function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === 'undefined'
  );
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/** 0..1 scroll progress of an element travelling through the viewport.
 *  Subscribes to the shared passive rAF loop and only re-renders when the
 *  value changes meaningfully. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return onScrollFrame(() => {
      const p = elementProgress(el);
      setProgress((prev) => (Math.abs(prev - p) > 0.004 ? p : prev));
    });
  }, []);
  return { ref, progress };
}
