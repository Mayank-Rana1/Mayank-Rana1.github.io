import { useCallback, useEffect, useState } from 'react';

export type MotionPref = 'full' | 'reduced';

const KEY = 'mr-motion';

function systemPrefersReduced(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useMotionPreference() {
  const [pref, setPref] = useState<MotionPref>(() => {
    try {
      const stored = window.localStorage.getItem(KEY);
      if (stored === 'full' || stored === 'reduced') return stored;
    } catch {
      /* private mode — fall through to system */
    }
    return systemPrefersReduced() ? 'reduced' : 'full';
  });

  useEffect(() => {
    document.documentElement.dataset.motion = pref;
    try {
      window.localStorage.setItem(KEY, pref);
    } catch {
      /* ignore */
    }
  }, [pref]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (window.localStorage.getItem(KEY)) return; // explicit choice wins
      } catch {
        /* ignore */
      }
      setPref(e.matches ? 'reduced' : 'full');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => setPref((p) => (p === 'full' ? 'reduced' : 'full')), []);
  return { pref, toggle, reduced: pref === 'reduced' };
}
