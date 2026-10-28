import Lenis from 'lenis';

type ScrollTarget = HTMLElement | string;

let lenis: Lenis | null = null;
let raf = 0;
let locked = false;

const REDUCED = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.dataset.motion === 'reduced');

function navOffset(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n + 8 : 72;
}

function resolve(target: ScrollTarget): HTMLElement | null {
  if (typeof target !== 'string') return target;
  if (target.startsWith('#')) return document.getElementById(target.slice(1));
  try {
    return document.querySelector<HTMLElement>(target);
  } catch {
    return null;
  }
}

/**
 * Scroll to an element. When Lenis is mounted it owns the animation;
 * otherwise this falls back to native scrolling with the nav offset.
 */
export function scrollToElement(
  target: ScrollTarget,
  opts: { immediate?: boolean; offset?: number } = {}
) {
  const el = resolve(target);
  if (!el) return;
  const offset = opts.offset ?? -navOffset();
  const top = Math.max(0, window.scrollY + el.getBoundingClientRect().top + offset);
  if (lenis && !opts.immediate) {
    lenis.scrollTo(top, { duration: 1.05 });
    return;
  }
  if (lenis && opts.immediate) {
    lenis.scrollTo(top, { immediate: true, force: true });
    return;
  }
  window.scrollTo({ top, behavior: opts.immediate || REDUCED() ? 'auto' : 'smooth' });
}

/** Smooth-scroll to a hash, used by the global anchor handler and deep links. */
export function scrollToHash(hash: string, immediate = false) {
  if (!hash || hash === '#') return;
  scrollToElement(hash, { immediate });
}

/** Lock page scrolling for the mobile menu without losing position. */
export function setScrollLocked(next: boolean) {
  if (typeof document === 'undefined') return;
  if (locked === next) return;
  locked = next;
  if (next) {
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.documentElement.style.overflow = '';
    lenis?.start();
  }
}

/**
 * Mount the smooth-scroll engine. Wheel input is interpolated; touch stays
 * native. Reduced motion gets no engine at all, so the page scrolls exactly
 * as the operating system asks it to.
 */
export function initSmoothScroll(reduced: boolean): () => void {
  if (typeof window === 'undefined' || reduced || REDUCED()) return () => undefined;

  const instance = new Lenis({
    lerp: 0.11,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.15,
    anchors: false,
    autoRaf: false,
    respectReducedMotion: true,
  });
  lenis = instance;
  document.documentElement.classList.add('lenis', 'lenis-smooth');

  const loop = (time: number) => {
    instance.raf(time);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!anchor) return;
    if (anchor.classList.contains('skip-link')) return;
    if (anchor.target && anchor.target !== '_self') return;
    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;
    if (!document.getElementById(hash.slice(1))) return;
    event.preventDefault();
    if (locked) setScrollLocked(false);
    scrollToHash(hash);
    try {
      if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    } catch {
      /* history can be restricted in sandboxed previews */
    }
  };
  document.addEventListener('click', onClick);

  return () => {
    document.removeEventListener('click', onClick);
    cancelAnimationFrame(raf);
    if (locked) setScrollLocked(false);
    instance.destroy();
    lenis = null;
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
  };
}
