import { useRef } from 'react';
import { HERO, LINKS } from '@/content';
import { Split } from '@/components/fx';
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/env';

/* A circle (or ellipse) as a path, so pathLength-based drawing works in every browser. */
const ring = (cx: number, cy: number, rx: number, ry = rx) =>
  `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0`;

/* The still life as a hairline drawing: cylinder, sphere, cube and ring on one ground line, one bronze point.
   Static in the HTML; with motion allowed the lines draw in once after the intro. */
function LineStill() {
  return (
    <svg className="hero-lines" viewBox="0 0 480 540" aria-hidden="true" focusable="false">
      <g className="hl-guide">
        <path pathLength={1} d="M0 500H480" />
        <path pathLength={1} d="M250 150V520" />
        <path pathLength={1} d="M20 180H200" />
      </g>
      <g className="hl-ink">
        <path pathLength={1} d={ring(95, 180, 35, 9)} />
        <path pathLength={1} d="M60 180V500M130 180V500" />
        <path pathLength={1} d="M60 500a35 9 0 0 0 70 0" />
        <path pathLength={1} d={ring(250, 400, 100)} />
        <path pathLength={1} d="M150 400a100 26 0 0 0 200 0" />
        <path pathLength={1} d="M340 380H450V500H340ZM340 380L365 358H470L450 380M470 358V478L450 500" />
        <path pathLength={1} d={ring(405, 294, 62)} />
        <path pathLength={1} d={ring(405, 294, 34)} />
      </g>
      <circle className="hl-dot" cx="250" cy="284" r="16" />
    </svg>
  );
}

/* Chapter 1 · Hero. The statement, who and where, and three ways in. */
export function Hero() {
  const section = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const play = () => {
        gsap.from('[data-in]', { y: 14, autoAlpha: 0, duration: 1.4, ease: 'power3.out', stagger: 0.1, delay: 0.5 });
        gsap.from('.hl-guide', { autoAlpha: 0, duration: 2, ease: 'power2.out', delay: 0.2 });
        gsap.from('.hl-ink path', { strokeDashoffset: 1, duration: 2.2, ease: 'power2.inOut', stagger: 0.12, delay: 0.3 });
        gsap.from('.hl-dot', { scale: 0, transformOrigin: '50% 50%', duration: 1, ease: 'power3.out', delay: 1.8 });
      };
      if (document.documentElement.classList.contains('intro')) window.addEventListener('intro:done', play, { once: true }); else play();
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="home" aria-labelledby="hero-title" ref={section}>
      <div className="hero-art" aria-hidden="true">
        <LineStill />
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
