import { createElement, useEffect, useRef, type ElementType, type ReactNode, type RefObject } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { gsap, SplitText, ScrollTrigger, prefersReducedMotion, hasFinePointer, useIsoLayoutEffect } from '@/lib/env';

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
          yPercent: 115, rotate: chars ? 6 : 2, duration: chars ? 1.1 : 1.25, ease: 'expo.out', stagger: chars ? 0.018 : 0.09, delay,
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
      gsap.set(items, { autoAlpha: 0, y: opts.y ?? 48 });
      ScrollTrigger.batch(items, {
        start: 'top 90%', once: true,
        onEnter: batch => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: opts.stagger ?? 0.09, overwrite: true }),
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

/* ---------- Magnetic: the control leans toward the pointer, then springs back ---------- */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * strength); yTo((e.clientY - r.top - r.height / 2) * strength); };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [strength]);
  return ref;
}
export function Magnetic({ children, strength }: { children: (ref: RefObject<HTMLAnchorElement | null>) => ReactNode; strength?: number }) {
  const ref = useMagnetic<HTMLAnchorElement>(strength);
  return <>{children(ref)}</>;
}

/* ---------- Cursor: a ring that trails the pointer and says what a click will do ---------- */
export function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 }), sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });
  const ring = useRef<HTMLDivElement>(null), label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    document.documentElement.classList.add('has-cursor');
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      const t = e.target instanceof Element ? e.target : null;
      const hint = t?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? document.body.dataset.cursorHint ?? '';
      const link = !!t?.closest('a, button, [role="tab"], label, summary');
      const r = ring.current; if (!r) return;
      r.dataset.state = hint ? 'label' : link ? 'link' : '';
      if (label.current && label.current.textContent !== hint) label.current.textContent = hint;
      r.classList.remove('is-hidden');
    };
    const out = () => ring.current?.classList.add('is-hidden');
    const down = () => ring.current?.classList.add('is-down'), up = () => ring.current?.classList.remove('is-down');
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', out); window.addEventListener('pointerdown', down); window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', out); window.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); };
  }, [x, y]);
  return (
    <motion.div className="cursor" aria-hidden="true" style={{ x: sx, y: sy }}>
      <div className="cursor-ring is-hidden" ref={ring}><span className="cursor-label" ref={label} /></div>
    </motion.div>
  );
}

/* ---------- Marquee: an endless line whose speed and lean follow the scroll ---------- */
export function Marquee({ items, className = '', speed = 40, sep = '✳' }: { items: string[]; className?: string; speed?: number; sep?: string }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    let x = 0, last = performance.now(), skew = 0, raf = 0, visible = true;
    const half = () => el.scrollWidth / 2;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); } });
    io.observe(el);
    let prevY = window.scrollY;
    function tick(now: number) {
      raf = 0;
      const dt = Math.min(64, now - last) / 1000; last = now;
      const dy = window.scrollY - prevY; prevY = window.scrollY;
      const boost = Math.max(-8, Math.min(8, dy * 0.25));
      x -= (speed + Math.abs(boost) * 40) * dt * (boost < 0 ? -1 : 1);
      const w = half(); if (w > 0) { if (x <= -w) x += w; if (x > 0) x -= w; }
      skew += (boost * -0.9 - skew) * 0.12;
      el!.style.transform = `translate3d(${x.toFixed(1)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    const vis = () => { if (!document.hidden && visible && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    document.addEventListener('visibilitychange', vis);
    return () => { cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, [speed]);
  const row = items.flatMap((t, i) => [<span key={`t${i}`}>{t}</span>, <i key={`s${i}`} aria-hidden="true">{sep}</i>]);
  return (
    <div className={`marquee ${className}`}>
      <p className="sr-only">{items.join(' · ')}</p>
      <div className="marquee-track" ref={track} aria-hidden="true"><div className="marquee-row">{row}</div><div className="marquee-row">{row}</div></div>
    </div>
  );
}
