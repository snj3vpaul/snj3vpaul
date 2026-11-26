import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { HERO, LINKS } from '@/content';
import { Split } from '@/components/fx';
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/env';

const loadScene = () => import('@/three/HeroScene');
const HeroScene = lazy(loadScene);

/* Chapter 1 · Hero. The statement, who and where, and three ways in. The 3D still life is atmosphere only:
   it loads after first paint, sits behind a rendered still until its first frame, and is hidden from assistive tech. */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const [show3d, setShow3d] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let ok = false; try { const c = document.createElement('canvas'); ok = !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { ok = false; }
    if (!ok) return;
    const start = () => loadScene().then(() => setShow3d(true)).catch(() => {});
    const idle = (window as unknown as { requestIdleCallback?: (f: () => void, o?: object) => number }).requestIdleCallback;
    if (idle) idle(start, { timeout: 900 }); else setTimeout(start, 200);
  }, []);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const play = () => gsap.from('[data-in]', { y: 14, autoAlpha: 0, duration: 1.4, ease: 'power3.out', stagger: 0.1, delay: 0.5 });
      if (document.documentElement.classList.contains('intro')) window.addEventListener('intro:done', play, { once: true }); else play();
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="home" aria-labelledby="hero-title" ref={section}>
      <div className="hero-art" aria-hidden="true">
        <img className={`hero-still${ready ? ' is-gone' : ''}`} src="/img/still-life.webp" srcSet="/img/still-life-m.webp 600w, /img/still-life.webp 900w"
          sizes="(max-width: 900px) 80vw, 44vw" alt="" width="900" height="1200" decoding="async" fetchPriority="high" />
        {show3d && <Suspense fallback={null}><HeroScene onReady={() => setReady(true)} still={prefersReducedMotion()} eventSource={section.current} /></Suspense>}
      </div>

      <p className="label hero-name" data-in>{HERO.name}</p>
      <Split as="h1" id="hero-title" className="hero-title" onIntro delay={0.15}>
        {HERO.statement[0]}<em>{HERO.statement[1]}</em>{HERO.statement[2]}
      </Split>

      <div className="hero-body">
        <p className="hero-intro" data-in>{HERO.intro}</p>
        <dl className="hero-facts" data-in>
          {HERO.facts.map(([k, v]) => <div key={k}><dt className="label">{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <p className="hero-links" data-in>
          <a className="link-arrow" href="#work" data-track="hero-cta-work">Selected work <span aria-hidden="true">↓</span></a>
          <a className="link-arrow" href={LINKS.cv} target="_blank" rel="noopener noreferrer" data-track="resume-header">Résumé <span aria-hidden="true">↗</span></a>
          <a className="link-arrow" href="#contact" data-track="contact-hero">Contact <span aria-hidden="true">→</span></a>
        </p>
      </div>
      <p className="hero-tagline" data-in>{HERO.tagline}</p>
    </section>
  );
}
