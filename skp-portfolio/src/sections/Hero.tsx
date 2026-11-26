import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { HERO, LINKS, MAILTO } from '@/content';
import { Split, Marquee, useMagnetic } from '@/components/fx';
import { RestoreCard, type SceneReport } from '@/components/RestoreCard';
import { useOttawaClock } from '@/lib/clock';
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/env';

const loadScene = () => import('@/three/HeroScene');
const HeroScene = lazy(loadScene);

function webglOk() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const clock = useOttawaClock();
  const [report, setReport] = useState<SceneReport>({ state: 'loading' });
  const [show3d, setShow3d] = useState(false);
  const [ready, setReady] = useState(false);
  const t0 = useRef(0);
  const cta = useMagnetic<HTMLAnchorElement>(0.3), li = useMagnetic<HTMLAnchorElement>(0.4), gh = useMagnetic<HTMLAnchorElement>(0.4);

  /* load the 3D scene after first paint, and measure exactly what it cost */
  useEffect(() => {
    if (!webglOk()) { setReport({ state: 'fallback', reason: 'This browser can’t draw WebGL, so you’re seeing the rendered still of the scene instead.' }); return; }
    const start = () => { t0.current = performance.now(); loadScene().then(() => setShow3d(true)).catch(() => setReport({ state: 'fallback', reason: 'The 3D scene didn’t load here, so you’re seeing its rendered still instead.' })); };
    const idle = (window as unknown as { requestIdleCallback?: (f: () => void, o?: object) => number }).requestIdleCallback;
    if (idle) idle(start, { timeout: 600 }); else setTimeout(start, 120);
  }, []);
  const onReady = () => {
    const ms = performance.now() - t0.current;
    const entries = (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
      .filter(e => e.startTime >= t0.current - 5 && /\.(m?js|tsx?)(\?|$)/.test(new URL(e.name).pathname));
    const bytes = entries.reduce((a, e) => a + (e.transferSize || 0), 0);
    const body = entries.reduce((a, e) => a + (e.encodedBodySize || e.decodedBodySize || 0), 0);
    const netEnd = entries.reduce((a, e) => Math.max(a, e.responseEnd), t0.current);
    setReady(true);
    setReport({ state: 'done', bytes: bytes || body, cached: bytes === 0 && body > 0, ms, netMs: Math.max(1, netEnd - t0.current) });
  };

  /* scroll: the headline drifts and the still/scene fades as the hero leaves */
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-28%']);
  const fade = useTransform(scrollYProgress, [0.35, 0.9], [1, 0]);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const play = () => gsap.from('.hero [data-in]', { y: 30, autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.35 });
      if (document.documentElement.classList.contains('intro')) window.addEventListener('intro:done', play, { once: true }); else play();
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="home" aria-labelledby="hero-title" ref={section}>
      <div className="hero-stage" aria-hidden="true">
        <img className={`hero-still${ready ? ' is-gone' : ''}`} src="/img/still-life.webp" srcSet="/img/still-life-m.webp 600w, /img/still-life.webp 900w" sizes="(max-width: 900px) 90vw, 50vw" alt="" width="900" height="1200" decoding="async" fetchPriority="high" />
        {show3d && <Suspense fallback={null}><HeroScene onReady={onReady} still={prefersReducedMotion()} eventSource={section.current} /></Suspense>}
      </div>

      <div className="hero-meta" data-in>
        <p className="eyebrow"><span className="idx">(01)</span> {HERO.hello}</p>
        <p className="eyebrow hero-where"><span>{HERO.where}</span><span className="hero-now"><span className="state" aria-hidden="true" /><span>{clock?.time ?? 'Eastern Time'}</span> ET</span></p>
      </div>

      <motion.div className="hero-title-wrap" style={{ y: titleY }}>
        <Split as="h1" id="hero-title" className="display hero-title" onIntro chars delay={0.1}>
          I build things that make technology feel <em>effortless.</em>
        </Split>
      </motion.div>

      <motion.div className="hero-card" style={{ opacity: fade }}><RestoreCard scene={report} /></motion.div>

      <div className="hero-intro" data-in>
        <p className="lead">{HERO.lead}</p>
        <div className="actions">
          <a className="btn btn-solid" href={MAILTO} data-track="contact-hero" ref={cta}><span>Get in touch</span></a>
          <a className="icon-link" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Sanjeev K Paul on LinkedIn" data-track="linkedin-header" ref={li}>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
          </a>
          <a className="icon-link" href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="Sanjeev K Paul on GitHub" data-track="github-header" ref={gh}>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
          </a>
          <a className="text-link" href={LINKS.cv} target="_blank" rel="noopener noreferrer" data-track="resume-header">Résumé ↗</a>
        </div>
      </div>

      <div className="hero-foot" data-in>
        <p className="tagline">{HERO.tagline}</p>
        <a className="scroll-cue" href="#work" data-track="hero-cta-work"><span>View selected work</span><i aria-hidden="true">↓</i></a>
        {clock && <div className="daylight" role="img" aria-label={`Today’s daylight in Ottawa: sunrise ${clock.rise}, sunset ${clock.set}`}>
          <div className="light" aria-hidden="true"><i style={{ left: `${clock.dayLeft}%`, width: `${clock.dayWidth}%` }} /><b style={{ left: `${clock.now}%` }} /></div>
          <p className="light-row mono" aria-hidden="true"><span>Sunrise {clock.rise}</span><span>Sunset {clock.set}</span></p>
        </div>}
      </div>

      <Marquee className="hero-marquee" items={HERO.stack} />
      <p className="sr-only">Hero image: a still life of 3D geometric shapes in low golden light — a plaster sphere, a gold torus, a charcoal cube, a terracotta cone, a sand column, a frosted glass sphere and a gold knot.</p>
    </section>
  );
}
