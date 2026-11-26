import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react';
import { SIDE, APPROACH, JOURNEY, WRITING, LINKS } from '@/content';
import { Art } from '@/components/Art';
import { Split, useReveal, useDraw, useMagnetic } from '@/components/fx';
import { gsap, hasFinePointer, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/env';

/* ================= SIDE PROJECTS: tilting cards in a staggered spread ================= */
function Tilt({ children, className }: { children: React.ReactNode; className: string }) {
  const rx = useMotionValue(0), ry = useMotionValue(0), gx = useMotionValue(50), gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 150, damping: 15 }), sry = useSpring(ry, { stiffness: 150, damping: 15 });
  const glare = useMotionTemplate`radial-gradient(60% 60% at ${gx}% ${gy}%, rgba(255,250,240,.55), transparent 60%)`;
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 14); rx.set((0.5 - py) * 12); gx.set(px * 100); gy.set(py * 100);
  };
  const leave = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div className={className} style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }} onPointerMove={move} onPointerLeave={leave}>
      {children}
      <motion.span className="tilt-glare" aria-hidden="true" style={{ background: glare }} />
    </motion.div>
  );
}

export function Side() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref); useDraw(ref);
  return (
    <section className="sec sports" id="sports" data-chapter-name="Sports projects" aria-labelledby="sports-title" ref={ref}>
      <span className="anchor" id="canterbury-cricket-club" aria-hidden="true" />
      <header className="sec-head split">
        <p className="eyebrow"><span className="idx">(05)</span> On my own time</p>
        <Split className="display" id="sports-title">Side <em>projects.</em></Split>
        <p className="lead sec-aside" data-reveal>{SIDE.lead}</p>
      </header>
      <div className="spread">
        {SIDE.items.map((s, i) => (
          <article className={`side side-${'abc'[i]}`} aria-labelledby={s.id} key={s.id} data-reveal>
            <Tilt className="side-art"><Art name={s.art} /><span className="case-cap mono">{s.cap}</span><span className="side-num" aria-hidden="true">0{i + 1}</span></Tilt>
            <div className="side-copy">
              <p className="eyebrow">{s.kicker}</p>
              <h3 id={s.id}>{s.title}</h3>
              <p>{s.text}</p>
              <dl className="spec">{s.spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              {'pending' in s && s.pending && <p className="pending eyebrow">{s.pending}</p>}
              {s.links.length > 0 && <p className="links">{s.links.map(l => <LinkBtn key={l.href} {...l} />)}</p>}
            </div>
            {'quote' in s && s.quote && <blockquote className="pull"><p className="eyebrow">The idea behind it</p><p>{s.quote}</p></blockquote>}
          </article>
        ))}
      </div>
    </section>
  );
}
function LinkBtn({ href, text, track, primary, external }: { href: string; text: string; track: string; primary?: boolean; external?: boolean }) {
  const ref = useMagnetic<HTMLAnchorElement>(0.3);
  return <a href={href} className={primary ? 'btn btn-line' : 'text-link'} data-track={track} ref={primary ? ref : undefined} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{primary ? <span>{text}</span> : text}</a>;
}

/* ================= APPROACH: the evening band; each principle draws itself ================= */
export function Approach() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref); useDraw(ref, 0.8);
  return (
    <section className="sec band-dark approach" id="approach" data-chapter-name="Approach" aria-labelledby="approach-title" ref={ref}>
      <span className="anchor" id="practice" aria-hidden="true" />
      <div className="band-inner">
        <header className="sec-head">
          <p className="eyebrow"><span className="idx">(06)</span> The approach</p>
          <Split className="display" id="approach-title">Standards are detailed. People are <em>complicated.</em></Split>
          <p className="lead sec-aside" data-reveal>{APPROACH.lead}</p>
        </header>
        <ol className="principles">
          {APPROACH.principles.map((p, i) => (
            <li key={p.k} data-reveal>
              <span className="principle-num" aria-hidden="true" data-n={`0${i + 1}`} />
              <Art name={p.art} />
              <p className="eyebrow">{p.k}</p><h3>{p.h[0]}<em>{p.h[1]}</em></h3><p>{p.p}</p>
            </li>
          ))}
        </ol>
        <p className="sec-foot"><a className="text-link" href={LINKS.cv} target="_blank" rel="noopener noreferrer" data-track="resume-approach">More about my background — résumé ↗</a></p>
      </div>
    </section>
  );
}

/* ================= JOURNEY: a line that fills as you read; credentials that ink in ================= */
export function Journey() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.path-rail i', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.path', start: 'top 70%', end: 'bottom 60%', scrub: 0.5 } });
      gsap.utils.toArray<HTMLElement>('.badges dt').forEach(dt => {
        gsap.fromTo(dt, { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', ease: 'none', scrollTrigger: { trigger: dt, start: 'top 85%', end: 'top 45%', scrub: 0.6 } });
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section className="sec journey" id="journey" data-chapter-name="Journey" aria-labelledby="journey-title" ref={ref}>
      <span className="anchor" id="experience" aria-hidden="true" />
      <header className="sec-head split">
        <p className="eyebrow"><span className="idx">(07)</span> Along the way</p>
        <Split className="display" id="journey-title">Not quite a <em>straight line.</em></Split>
        <p className="lead sec-aside" data-reveal>{JOURNEY.lead}</p>
      </header>
      <div className="path-wrap">
        <div className="path-rail" aria-hidden="true"><i /></div>
        <ol className="path">
          {JOURNEY.path.map(p => <li key={p.years} data-reveal><h3>{p.years}</h3><p>{p.role}</p><span className="path-org eyebrow">{p.org}</span></li>)}
        </ol>
      </div>
      <div className="creds">
        <p className="eyebrow" data-reveal>Credentials</p>
        <dl className="badges">{JOURNEY.creds.map(([k, v]) => <div key={k} data-reveal><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <p className="creds-foot" data-reveal>{JOURNEY.credsFoot} <a className="text-link" href={LINKS.cv} target="_blank" rel="noopener noreferrer" data-track="resume-journey">Full résumé ↗</a></p>
      </div>
    </section>
  );
}

/* ================= WRITING ================= */
export function Writing() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section className="sec writing" id="writing" data-chapter-name="Writing" aria-labelledby="writing-title" ref={ref}>
      <header className="sec-head row">
        <p className="eyebrow"><span className="idx">(08)</span> Field notes</p>
        <Split className="display display-sm" id="writing-title">Thinking <em>out loud.</em></Split>
        <a className="text-link sec-side" href={LINKS.medium} target="_blank" rel="noopener noreferrer">All writing ↗</a>
      </header>
      <ul className="entries">
        {WRITING.map(w => (
          <li key={w.href} data-reveal><a href={w.href} target="_blank" rel="noopener noreferrer" data-cursor="Read">
            <small className="eyebrow">{w.meta}</small><strong>{w.title}</strong><span className="arrow" aria-hidden="true">↗</span>
          </a></li>
        ))}
      </ul>
    </section>
  );
}
