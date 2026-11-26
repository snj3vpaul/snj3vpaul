import { createElement, useRef, type ElementType, type ReactNode, type RefObject } from 'react';
import { gsap, SplitText, ScrollTrigger, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/env';

/* ---------- Split heading: lines rise out of their own mask as the heading arrives (GSAP SplitText) ---------- */
export function Split({ as = 'h2', className, children, id, delay = 0, onIntro = false, chars = false }: {
  as?: ElementType; className?: string; children: ReactNode; id?: string; delay?: number; onIntro?: boolean; chars?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let tween: gsap.core.Animation | undefined, started = !onIntro;
    const split = SplitText.create(el, {
      type: chars ? 'lines,words,chars' : 'lines,words', mask: 'lines', autoSplit: true, aria: 'auto',
      onSplit(self) {
        const targets = chars ? self.chars : self.lines;
        tween = gsap.from(targets, {
          yPercent: 105, duration: chars ? 1.2 : 1.4, ease: 'expo.out', stagger: chars ? 0.014 : 0.1, delay,
          paused: !started,
          scrollTrigger: onIntro ? undefined : { trigger: el, start: 'top 88%', once: true },
        });
        return tween;
      },
    });
    const go = () => { started = true; tween?.play(); };
    if (onIntro) { if (!document.documentElement.classList.contains('intro')) go(); else window.addEventListener('intro:done', go, { once: true }); }
    return () => { window.removeEventListener('intro:done', go); split.revert(); };
  }, [chars, delay, onIntro]);
  return createElement(as, { ref, className, id }, children);
}

/* ---------- Reveal: children fade and rise in a short stagger as the block enters ---------- */
export function useReveal(scope: RefObject<HTMLElement | null>, selector = '[data-reveal]', opts: { y?: number; stagger?: number } = {}) {
  useIsoLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(selector, root);
      gsap.set(items, { autoAlpha: 0, y: opts.y ?? 16 });
      ScrollTrigger.batch(items, {
        start: 'top 90%', once: true,
        onEnter: batch => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: opts.stagger ?? 0.08, overwrite: true }),
      });
      // keyboard users never land on something still invisible
      const onFocus = (e: FocusEvent) => { const t = (e.target as Element).closest?.(selector); if (t) gsap.set(t, { autoAlpha: 1, y: 0 }); };
      root.addEventListener('focusin', onFocus);
      return () => root.removeEventListener('focusin', onFocus);
    }, root);
    return () => ctx.revert();
  }, []);
}

/* ---------- Draw: line drawings stroke themselves in as they scroll into view ---------- */
export function useDraw(scope: RefObject<HTMLElement | null>, scrub: boolean | number = false) {
  useIsoLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<SVGSVGElement>('.line-art', root).forEach(svg => {
        const strokes = svg.querySelectorAll('[pathLength]');
        gsap.fromTo(strokes, { strokeDasharray: 1, strokeDashoffset: 1 }, {
          strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.04,
          scrollTrigger: scrub ? { trigger: svg, start: 'top 90%', end: 'top 35%', scrub } : { trigger: svg, start: 'top 88%', once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
}
