import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LIFE, FIELD, CONTACT, EMAIL, MAILTO, LINKS } from '@/content';
import { Split, Marquee, useReveal, useMagnetic } from '@/components/fx';
import { gsap, prefersReducedMotion, useIsoLayoutEffect, track } from '@/lib/env';
import { useOttawaClock } from '@/lib/clock';

const GoldField = lazy(() => import('@/three/GoldField'));

/* ================= INTERLUDE: words surfacing out of a field of golden light ================= */
export function Interlude() {
  const ref = useRef<HTMLElement>(null);
  const [gl, setGl] = useState(false);
  /* the light field (and its share of the 3D code) loads only when the section is a screen away */
  useEffect(() => {
    let ok = false; try { ok = !!document.createElement('canvas').getContext('webgl'); } catch { ok = false; }
    if (!ok) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGl(true); io.disconnect(); } }, { rootMargin: '100% 0px' });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.interlude-words span', { opacity: 0.12, yPercent: 30, filter: 'blur(10px)' }, {
        opacity: 1, yPercent: 0, filter: 'blur(0px)', stagger: 0.35, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'center 45%', scrub: 0.8 },
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <figure className="interlude" aria-labelledby="interlude-cap" ref={ref}>
      <div className="interlude-bg" aria-hidden="true">
        {gl && <Suspense fallback={null}><GoldField still={prefersReducedMotion()} /></Suspense>}
      </div>
      <div className="interlude-copy">
        <figcaption className="eyebrow" id="interlude-cap">{LIFE.gives.label}</figcaption>
        <p className="interlude-words">{LIFE.gives.words.map((w, i) => <span key={w}>{i === 2 ? <em>{w}</em> : w}</span>)}</p>
        <p className="interlude-note">{LIFE.gives.note}</p>
      </div>
    </figure>
  );
}

/* ================= LIFE ================= */
export function Life() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  useReveal(ref);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => { if (!document.hidden) setI(n => (n + 1) % LIFE.greetings.length); }, 2800);
    return () => clearInterval(id);
  }, []);
  const [word, lang] = LIFE.greetings[i];
  const hex = typeof TextEncoder !== 'undefined' ? Array.from(new TextEncoder().encode(word), b => b.toString(16).padStart(2, '0')).join(' ') : '48 65 6c 6c 6f';
  return (
    <section className="sec life" id="life" data-chapter-name="Life" aria-labelledby="life-title" ref={ref}>
      <span className="anchor" id="about" aria-hidden="true" /><span className="anchor" id="outside" aria-hidden="true" /><span className="anchor" id="hello" aria-hidden="true" />
      <header className="sec-head split">
        <p className="eyebrow"><span className="idx">(09)</span> Away from the desk</p>
        <Split className="display" id="life-title">A different kind of <em>field.</em></Split>
      </header>
      <div className="life-grid">
        <div className="life-copy" data-reveal>
          <p className="lead">{LIFE.lead}</p>
          <p className="links">{LIFE.links.map(l => <a key={l.href} className="text-link" href={l.href} target="_blank" rel="noopener noreferrer">{l.text}</a>)}</p>
        </div>
        <div className="hello" aria-hidden="true" data-reveal>
          <span className="eyebrow">Hello, in a few languages</span>
          <span className="hello-word">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={word} initial={{ y: '100%', opacity: 0, filter: 'blur(8px)' }} animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }} exit={{ y: '-100%', opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>{word}</motion.span>
            </AnimatePresence>
          </span>
          <span className="hello-meta"><span>{lang}</span><code className="mono">{hex}</code></span>
        </div>
      </div>
      {/* PHOTO STRIP: none, by choice. */}
      <div className="interests-wrap" aria-label="Interests">
        <Marquee className="interests" items={LIFE.interests} speed={60} sep="/" />
      </div>
    </section>
  );
}

/* ================= ON THE FIELD: the scorebook you can drag ================= */
export function Field() {
  const ref = useRef<HTMLElement>(null), rail = useRef<HTMLUListElement>(null);
  const [cur, setCur] = useState(1);
  const [ends, setEnds] = useState({ start: true, end: false });
  useReveal(ref);
  useEffect(() => {
    const el = rail.current!;
    const items = Array.from(el.children) as HTMLElement[];
    const step = () => (items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : el.clientWidth);
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCur(el.scrollLeft >= max - 2 ? items.length : Math.round(el.scrollLeft / step()) + 1);
      setEnds({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
    };
    update();
    el.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    /* drag to scroll with a mouse; touch and trackpads scroll natively */
    let down = false, sx = 0, sl = 0, moved = 0;
    const pd = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = el.scrollLeft; el.classList.add('is-drag'); };
    const pm = (e: PointerEvent) => { if (!down) return; moved = Math.abs(e.clientX - sx); el.scrollLeft = sl - (e.clientX - sx); };
    const pu = () => { if (!down) return; down = false; el.classList.remove('is-drag'); const s = step(); el.scrollTo({ left: Math.round(el.scrollLeft / s) * s, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }); };
    const clk = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } };
    el.addEventListener('pointerdown', pd); window.addEventListener('pointermove', pm); window.addEventListener('pointerup', pu); el.addEventListener('click', clk, true);
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update); el.removeEventListener('pointerdown', pd); window.removeEventListener('pointermove', pm); window.removeEventListener('pointerup', pu); el.removeEventListener('click', clk, true); };
  }, []);
  const go = (d: number) => { const el = rail.current!; const it = el.children; const s = it.length > 1 ? (it[1] as HTMLElement).offsetLeft - (it[0] as HTMLElement).offsetLeft : el.clientWidth; el.scrollBy({ left: d * s, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }); };
  const prev = useMagnetic<HTMLButtonElement>(0.4), next = useMagnetic<HTMLButtonElement>(0.4);
  return (
    <section className="sec field band-beige" id="field" data-chapter-name="On the field" aria-labelledby="field-title" ref={ref}>
      <div className="band-inner">
        <header className="sec-head split">
          <p className="eyebrow"><span className="idx">(10)</span> On the field</p>
          <Split className="display" id="field-title">A few good <em>seasons.</em></Split>
          <p className="lead sec-aside" data-reveal>{FIELD.lead}</p>
        </header>
        <div className="reel">
          <div className="reel-head">
            <p className="eyebrow">The scorebook <span className="reel-hint">· drag, swipe or use the arrows</span></p>
            <div className="reel-ctrl">
              <p className="reel-count mono" aria-hidden="true"><b>{String(cur).padStart(2, '0')}</b> / {FIELD.reel.length}</p>
              <button type="button" aria-label="Previous accolade" disabled={ends.start} onClick={() => go(-1)} ref={prev}><svg className="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg></button>
              <button type="button" aria-label="Next accolade" disabled={ends.end} onClick={() => go(1)} ref={next}><svg className="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" /></svg></button>
            </div>
          </div>
          <ul className="reel-track" ref={rail} tabIndex={0} aria-label="Cricket and soccer accolades" data-cursor="Drag"
            onKeyDown={e => { const d = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key]; if (d) { e.preventDefault(); go(d); } }}>
            {FIELD.reel.map(([tag, num, h, p], i) => (
              <li key={i}><p className="eyebrow">{tag}</p><p className="reel-num">{num}</p><h3>{h}</h3><p>{p}</p></li>
            ))}
          </ul>
        </div>
        <div className="carry" data-reveal>
          <p className="eyebrow">What carries over</p>
          <dl>{FIELD.carry.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </div>
      </div>
    </section>
  );
}

/* ================= CONTACT: evening; letters that lift under the pointer ================= */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [fb, setFb] = useState('');
  const mail = useMagnetic<HTMLAnchorElement>(0.35), copy = useMagnetic<HTMLButtonElement>(0.35);
  useReveal(ref);
  const doCopy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setFb('Email copied to your clipboard.'); track('contact-copy-success'); }
    catch { setFb(`Copy didn't work here. The address is ${EMAIL}.`); }
    setTimeout(() => setFb(''), 4000);
  };
  useEffect(() => {
    const el = ref.current!; let sent = false;
    const io = new IntersectionObserver(es => { if (!sent && es.some(e => e.isIntersecting)) { sent = true; track('contact-section-view'); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, []);
  const word = (w: string, italic = false) => (
    <span className={`wave${italic ? ' is-em' : ''}`}>{w.split('').map((c, i) => <span key={i} className="wave-ch" aria-hidden="true">{c}</span>)}<span className="sr-only">{w}</span></span>
  );
  return (
    <section className="sec band-dark contact" id="contact" data-chapter-name="Let’s talk" aria-labelledby="contact-title" ref={ref}>
      <div className="band-inner">
        <p className="eyebrow"><span className="idx">(11)</span> {CONTACT.label}</p>
        <h2 id="contact-title" className="display display-xl" data-reveal>{word('Let’s')} {word('make')} {word('it')} {word('provable.', true)}</h2>
        <div className="contact-row">
          <p className="lead" data-reveal>{CONTACT.lead}</p>
          <div data-reveal>
            <p className="contact-email"><a href={MAILTO} data-track="contact-email-text" data-cursor="Write">{EMAIL}</a></p>
            <div className="contact-actions">
              <a className="btn btn-light" href={MAILTO} data-track="contact-email" ref={mail}><span>Email me</span></a>
              <button type="button" className="btn btn-ghost" id="copy-email" data-email={EMAIL} data-track="contact-copy" onClick={doCopy} ref={copy}><span>Copy email</span></button>
              <a className="text-link" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" data-track="linkedin-contact">LinkedIn ↗</a>
              <a className="text-link" href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            </div>
            <p className="copy-feedback" id="copy-feedback" role="status" aria-live="polite">{fb}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const clock = useOttawaClock();
  return (
    <footer className="site-footer band-dark">
      <span className="foot-mark">sanjeev.</span>
      <span>Compliance Analyst · Fortinet · Ottawa</span>
      {clock && <span className="footer-time">Ottawa local time <span>{clock.time}</span></span>}
      <span className="footer-links"><a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href={LINKS.medium} target="_blank" rel="noopener noreferrer">Writing ↗</a></span>
      <span>© {new Date().getFullYear()} Sanjeev K Paul</span>
    </footer>
  );
}
