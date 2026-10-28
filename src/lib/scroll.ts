type ScrollTask = () => void;

const tasks = new Set<ScrollTask>();
let frame = 0;
let queued = false;

function flush() {
  queued = false;
  for (const task of tasks) task();
}

function requestFlush() {
  if (queued) return;
  queued = true;
  frame = requestAnimationFrame(flush);
}

function onScroll() {
  requestFlush();
}

function onResize() {
  requestFlush();
}

/**
 * One passive scroll/resize pair for the whole site. Every scroll-linked
 * component subscribes here instead of adding its own listener, so Lenis
 * and native scrolling both drive a single rAF pass.
 */
export function onScrollFrame(task: ScrollTask): () => void {
  if (typeof window === 'undefined') return () => undefined;
  tasks.add(task);
  if (tasks.size === 1) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
  }
  task();
  return () => {
    tasks.delete(task);
    if (tasks.size === 0) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
      queued = false;
    }
  };
}

/** Clamp a number to a range. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** 0..1 progress of an element travelling through the viewport. */
export function elementProgress(el: HTMLElement, viewport = window.innerHeight): number {
  const rect = el.getBoundingClientRect();
  const total = viewport + rect.height;
  if (total <= 0) return 0;
  return clamp((viewport - rect.top) / total, 0, 1);
}
