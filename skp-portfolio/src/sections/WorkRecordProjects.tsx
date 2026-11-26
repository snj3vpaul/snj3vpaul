import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { WORK, WORK_LEAD, WORK_NOTE, RECORD, PIPELINE, PROJECTS, LINKS } from '@/content';
import { Art } from '@/components/Art';
import { Split, useReveal, useDraw, useMagnetic } from '@/components/fx';
import { gsap, ScrollTrigger, prefersReducedMotion, hasFinePointer, useIsoLayoutEffect } from '@/lib/env';

const Mark = ({ s }: { s: 'valid' | 'pending' | 'lead' }) => <span className={`mark mark-${s}`} aria-hidden="true" />;

/* ================= WORK: a typographic index; a drawing follows the cursor ================= */
export function Work() {
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22 }), sy = useSpring(y, { stiffness: 180, damping: 22 });
  const rot = useSpring(0, { stiffness: 120, damping: 14 });
  useReveal(ref);
  useEffect(() => {
    if (!hasFinePointer()) return;
    let lx = 0;
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); rot.set(Math.max(-12, Math.min(12, (e.clientX - lx) * 0.6))); lx = e.clientX; };
    window.addEventListener('pointermove', move, { passive: true });
    const off = () => setHover(null);
    window.addEventListener('scroll', off, { passive: true });
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('scroll', off); };
  }, [x, y, rot]);
  return (
    <section className="sec works" id="work" data-chapter-name="Work" aria-labelledby="work-title" ref={ref}>
      <span className="anchor" id="professional-work" aria-hidden="true" />
      <span className="anchor" id="personal-projects" aria-hidden="true" />
      <header className="sec-head split">
        <p className="eyebrow"><span className="idx">(02)</span> Selected work · At Fortinet</p>
        <Split className="display" id="work-title">Selected <em>Work</em></Split>
        <div className="sec-aside" data-reveal>
          <p className="lead">{WORK_LEAD.split('prove').flatMap((t, i) => (i ? [<em key={i}>prove</em>, t] : [t]))}</p>
          <p className="legend"><Mark s="valid" />Validated by NIST <Mark s="pending" />In review</p>
        </div>
      </header>
      <ol className="index" onPointerLeave={() => setHover(null)}>
        {WORK.map((w, i) => (
          <li className={`case${hover !== null && hover !== i ? ' is-dim' : ''}`} id={w.id} key={w.id} data-reveal data-cursor="View" onPointerEnter={() => setHover(i)}>
            <span className="case-fill" aria-hidden="true" />
            <span className="case-num mono" aria-hidden="true">0{i + 1}</span>
            <div className="case-main">
              <p className="eyebrow">{w.kicker}</p>
              <h3 id={w.hid}><a href={w.href} data-track={w.track} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>{w.title}</a></h3>
              <p className="case-desc">{w.desc}</p>
            </div>
            <p className="case-status"><Mark s={w.status} />{w.statusText}</p>
            <span className="case-go" aria-hidden="true">Explore project <i>→</i></span>
            <div className="case-art" aria-hidden="true"><Art name={w.art} /><span className="case-cap mono">{w.cap}</span></div>
          </li>
        ))}
      </ol>
      <motion.div className="preview" aria-hidden="true" style={{ x: sx, y: sy, rotate: rot }}>
        <AnimatePresence>
          {hover !== null && (
            <motion.div key={hover} className="preview-inner" initial={{ clipPath: 'inset(100% 0 0 0 round 18px)', scale: 0.9 }} animate={{ clipPath: 'inset(0% 0 0 0 round 18px)', scale: 1 }}
              exit={{ clipPath: 'inset(0 0 100% 0 round 18px)', scale: 0.95 }} transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}>
              <Art name={WORK[hover].art} className="draw-now" />
              <span className="case-cap mono">{WORK[hover].cap}</span>
              <span className="preview-num">0{hover + 1}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <p className="endnote" data-reveal>{WORK_NOTE}</p>
    </section>
  );
}

/* ================= ON THE RECORD: numbers that count themselves up ================= */
export function Record() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.numerals [data-n]').forEach(el => {
        const n = { v: 0 }, end = Number(el.dataset.n);
        gsap.to(n, { v: end, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true }, onUpdate: () => { el.textContent = String(Math.round(n.v)); } });
      });
      gsap.fromTo('.pipeline-line i', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.pipeline', start: 'top 80%', end: 'top 35%', scrub: 0.6 } });
      gsap.from('.pipeline li', { y: 30, autoAlpha: 0, stagger: 0.12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.pipeline', start: 'top 75%', once: true } });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section className="sec record band-beige" id="impact" data-chapter-name="On the record" aria-labelledby="impact-title" ref={ref}>
      <div className="band-inner">
        <header className="sec-head row">
          <p className="eyebrow"><span className="idx">(03)</span> From my work at Fortinet</p>
          <Split className="display display-sm" id="impact-title">On the <em>record.</em></Split>
          <a className="text-link sec-side" href={LINKS.cv} target="_blank" rel="noopener noreferrer" data-track="resume-impact">Full résumé ↗</a>
        </header>
        <dl className="numerals">
          {RECORD.map((r, i) => (
            <div key={i} data-reveal>
              <dd><span data-n={r.value}>{r.value}</span>{r.suffix === 'st' ? <sup>st</sup> : r.suffix}</dd>
              <dt>{r.label}{r.link && <a className="text-link" href={r.link.href} data-track={r.link.track}>{r.link.text}</a>}</dt>
            </div>
          ))}
        </dl>
        <div className="pipeline" role="group" aria-label="Where each module stands">
          <p className="eyebrow">Where each module stands</p>
          <div className="pipeline-line" aria-hidden="true"><i /></div>
          <ol>
            {PIPELINE.map(p => (
              <li key={p.stage}><b>{p.stage}</b>{p.items.map(it => <em key={it.t}><Mark s={it.s} />{it.t}</em>)}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ================= PROJECTS: three panels that stack as you scroll ================= */
export function Projects() {
  const ref = useRef<HTMLElement>(null);
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (min-height: 700px)', () => {
      const panels = gsap.utils.toArray<HTMLElement>('.stack-panel', ref.current!);
      panels.forEach((p, i) => {
        if (i === panels.length - 1) return;
        gsap.fromTo(p.querySelector('.stack-card'), { scale: 1, filter: 'brightness(1)' }, {
          scale: 0.92, filter: 'brightness(0.86)', ease: 'none', immediateRender: false,
          scrollTrigger: { trigger: panels[i + 1], start: 'top bottom', end: 'top 110px', scrub: true },
        });
      });
      panels.forEach(p => {
        gsap.fromTo(p.querySelector('.stage video, .stage img'), { yPercent: -6, scale: 1.08 }, { yPercent: 6, scale: 1.08, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      ScrollTrigger.refresh();
    });
    return () => mm.revert();
  }, []);
  /* recordings play only while on screen, never under reduced motion */
  useEffect(() => {
    const vids = Array.from(ref.current!.querySelectorAll('video'));
    if (prefersReducedMotion()) return;
    const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target as HTMLVideoElement; if (e.isIntersecting && !document.hidden) v.play().catch(() => {}); else v.pause(); }), { threshold: 0.2 });
    vids.forEach(v => io.observe(v));
    return () => io.disconnect();
  }, []);
  return (
    <section className="sec projects" id="projects" data-chapter-name="Projects" aria-labelledby="projects-title" ref={ref}>
      <header className="sec-head row">
        <p className="eyebrow"><span className="idx">(04)</span> Projects · Built on my own time</p>
        <Split className="display" id="projects-title">Things I’ve <em>built.</em></Split>
        <nav className="chips sec-side" aria-label="Projects">{PROJECTS.map((p, i) => <a key={p.id} href={`#${p.id}`} className="chip"><span className="mono">0{i + 1}</span>{p.title.join('').replace('.', '')}</a>)}</nav>
      </header>
      <div className="stack">
        {PROJECTS.map((p, i) => <ProjectPanel key={p.id} p={p} i={i} />)}
      </div>
    </section>
  );
}

function ProjectPanel({ p, i }: { p: (typeof PROJECTS)[number]; i: number }) {
  const primary = useMagnetic<HTMLAnchorElement>(0.3);
  return (
    <article className="stack-panel" id={p.id} aria-labelledby={`${p.id}-title`} tabIndex={-1}>
      <div className={`stack-card tone-${i}`}>
        <figure className="stage" aria-hidden="true">
          <video muted playsInline loop preload="none" poster={`/img/loops/${p.video}-poster.webp`}><source src={`/img/loops/${p.video}.mp4`} type="video/mp4" /></video>
          <figcaption className="eyebrow">{p.caption}</figcaption>
          <span className="stage-num">0{i + 1}</span>
        </figure>
        <div className="stage-copy">
          <p className="eyebrow">{p.kicker}</p>
          <h3 className="panel-title" id={`${p.id}-title`}>{p.title[0]}<em>{p.title[1]}</em></h3>
          <p className="lead">{p.lead}</p>
          <ol className="tools">{p.tools.map(([h, t]) => <li key={h}><h4>{h}</h4><p>{t}</p></li>)}</ol>
          <dl className="spec">{p.spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          {p.links.length > 0 && <p className="links">{p.links.map(l => (
            <a key={l.href} href={l.href} className={l.primary ? 'btn btn-solid' : 'text-link'} data-track={l.track} ref={l.primary ? primary : undefined}
              {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.primary ? <span>{l.text}</span> : l.text}</a>
          ))}</p>}
        </div>
      </div>
    </article>
  );
}

export function useDrawIn(ref: React.RefObject<HTMLElement | null>) { useDraw(ref); }
