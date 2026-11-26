import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './env';

/* Smooth scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock.
   Under reduced motion there is no Lenis at all: the browser scrolls natively. */
let lenis: Lenis | null = null;

export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return null;
  lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true, touchMultiplier: 1.2 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;
export const scrollVelocity = () => lenis?.velocity ?? 0;

const OFFSET = -88;
export function scrollToTarget(target: string | HTMLElement | number, immediate = false) {
  const el = typeof target === 'string' ? (target === '#top' ? 0 : document.querySelector<HTMLElement>(target)) : target;
  if (el === null || el === undefined) return;
  const y = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY + OFFSET;
  if (lenis && !immediate) { lenis.scrollTo(y, { duration: 1.4 }); return; }
  /* immediate jumps go through the browser, then Lenis is told where we are (force: its own state may already match) */
  window.scrollTo({ top: y, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' });
  lenis?.scrollTo(y, { immediate: true, force: true });
}
export function setScrollLock(locked: boolean) {
  if (lenis) { if (locked) lenis.stop(); else lenis.start(); }
  document.documentElement.classList.toggle('menu-open', locked);
}
