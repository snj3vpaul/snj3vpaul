import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { NAV, MOBILE_NAV, LINKS } from '@/content';
import { gsap, useIsoLayoutEffect } from '@/lib/env';
import { scrollToTarget, setScrollLock } from '@/lib/scroll';
import { useMagnetic } from './fx';

/* ---------- Intro: S N J V and a counter, then the paper lifts. Once per visit, never under reduced motion. ---------- */
export function Intro() {
  const root = useRef<HTMLDivElement>(null), count = useRef<HTMLSpanElement>(null);
  useIsoLayoutEffect(() => {
    const html = document.documentElement;
    const done = () => { html.classList.remove('intro'); window.dispatchEvent(new Event('intro:done')); };
    if (!html.classList.contains('intro')) { window.dispatchEvent(new Event('intro:done')); return; }
    const el = root.current!; const n = { v: 0 };
    const tl = gsap.timeline({ onComplete: done });
    tl.from('.intro-letter', { yPercent: 120, duration: 0.9, ease: 'expo.out', stagger: 0.07 }, 0)
      .to(n, { v: 100, duration: 1.5, ease: 'power3.inOut', onUpdate: () => { if (count.current) count.current.textContent = String(Math.round(n.v)).padStart(3, '0'); } }, 0)
      .to('.intro-bar i', { scaleX: 1, duration: 1.5, ease: 'power3.inOut' }, 0)
      .add(() => { void document.fonts?.ready; })
      .to('.intro-letter', { yPercent: -120, duration: 0.6, ease: 'expo.in', stagger: 0.04 }, 1.55)
      .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, 1.9);
    return () => { tl.kill(); };
  }, []);
  return (
    <div className="intro" ref={root} aria-hidden="true">
      <p className="intro-word">{'SNJV'.split('').map(c => <span className="intro-mask" key={c}><span className="intro-letter">{c}</span></span>)}</p>
      <div className="intro-foot"><span className="eyebrow">Portfolio · Ottawa</span><div className="intro-bar"><i /></div><span className="mono intro-count" ref={count}>000</span></div>
    </div>
  );
}

/* ---------- Header: wordmark, section links that know where you are, a magnetic call to action, a full-screen menu ---------- */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState('');
  const cta = useMagnetic<HTMLAnchorElement>(0.3);
  const menuBtn = useRef<HTMLButtonElement>(null), menu = useRef<HTMLElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener('scroll', on, { passive: true });
    const ids = NAV.map(n => n.href.slice(1));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setCurrent(e.target.id); }), { rootMargin: '-40% 0px -55% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { window.removeEventListener('scroll', on); io.disconnect(); };
  }, []);

  useEffect(() => {
    setScrollLock(open);
    if (open) setTimeout(() => menu.current?.querySelector('a')?.focus(), 60);
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) { setOpen(false); menuBtn.current?.focus(); } };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [open]);

  return (
    <>
      <header className={`bar${scrolled ? ' is-scrolled' : ''}`} id="top">
        <a className="wordmark" href="#top" aria-label="Sanjeev K Paul, back to top">Sanjeev <i>K</i> Paul</a>
        <nav className="nav" aria-label="Primary navigation">
          {NAV.map(n => (
            <a key={n.href} href={n.href} aria-current={current === n.href.slice(1) ? 'true' : undefined}>
              {n.label}
              {current === n.href.slice(1) && <motion.span className="nav-dot" layoutId="nav-dot" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
            </a>
          ))}
          <a href={LINKS.cv} target="_blank" rel="noopener noreferrer" data-track="resume-nav">Résumé ↗</a>
        </nav>
        <a className="bar-cta" href="#contact" data-track="contact-header" ref={cta}><span>Get in touch</span></a>
        <button ref={menuBtn} className={`menu-toggle${open ? ' is-open' : ''}`} type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(o => !o)}><span /><span /></button>
      </header>
      <nav ref={menu} className={`mobile-nav${open ? ' is-open' : ''}`} id="mobile-nav" aria-label="Mobile navigation" aria-hidden={!open} inert={!open}
        onClick={e => { if ((e.target as Element).closest('a')) setOpen(false); }}>
        {[...MOBILE_NAV, { href: LINKS.cv, label: 'Résumé ↗' }, { href: '#contact', label: 'Let’s talk' }].map((n, i) => (
          <a key={n.href} href={n.href} style={{ transitionDelay: open ? `${0.25 + i * 0.04}s` : '0s' }} {...(n.href === LINKS.cv ? { target: '_blank', rel: 'noopener noreferrer', 'data-track': 'resume-nav' } : {})}>
            <span className="mono">{String(i + 1).padStart(2, '0')}</span>{n.label}
          </a>
        ))}
      </nav>
    </>
  );
}

/* ---------- Scroll progress hairline ---------- */
export function Progress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return <motion.div className="progress" aria-hidden="true" style={{ scaleX }} />;
}

/* ---------- Jump list: the current chapter, and a way to any other ---------- */
export function Jump() {
  const [chapters, setChapters] = useState<{ id: string; name: string }[]>([]);
  const [current, setCurrent] = useState('Work');
  const [on, setOn] = useState(false);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null), btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const secs = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter-name]'));
    setChapters(secs.map(s => ({ id: s.id, name: s.dataset.chapterName! })));
    const update = () => {
      setOn(window.scrollY > window.innerHeight * 0.8);
      let c: HTMLElement | null = null;
      for (const s of secs) if (s.getBoundingClientRect().top < window.innerHeight * 0.4) c = s;
      if (c) setCurrent(c.dataset.chapterName!);
    };
    update(); window.addEventListener('scroll', update, { passive: true });
    const click = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(o => { if (o) btn.current?.focus(); return false; }); } };
    document.addEventListener('click', click); document.addEventListener('keydown', key);
    return () => { window.removeEventListener('scroll', update); document.removeEventListener('click', click); document.removeEventListener('keydown', key); };
  }, []);
  return (
    <div className={`jump${on ? ' is-on' : ''}`} ref={box}>
      <button ref={btn} className="jump-btn" type="button" aria-expanded={open} aria-controls="jump-list" onClick={() => setOpen(o => !o)}>
        <span className="sr-only">Jump to a section. Current section: </span>
        <motion.span key={current} className="jump-label" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35 }}>{current}</motion.span>
        <svg className="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 10l4-4 4 4" /></svg>
      </button>
      <nav className="jump-list" id="jump-list" aria-label="All sections" hidden={!open} onClick={e => { if ((e.target as Element).closest('a')) setOpen(false); }}>
        {chapters.map(c => <a key={c.id} href={`#${c.id}`} aria-current={c.name === current ? 'true' : undefined}>{c.name}</a>)}
      </nav>
    </div>
  );
}

/* ---------- In-page links glide (Lenis) and open the right project; hashes on load land correctly ---------- */
export function useAnchors() {
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const id = decodeURIComponent(a.getAttribute('href')!.slice(1));
      if (!id) return;
      e.preventDefault();
      history.pushState(null, '', `${location.search}#${id}`);
      scrollToTarget(id === 'top' ? '#top' : `#${CSS.escape(id)}`);
      if (id !== 'top') { const t = document.getElementById(id); if (t) { t.setAttribute('tabindex', t.getAttribute('tabindex') ?? '-1'); setTimeout(() => t.focus({ preventScroll: true }), 50); } }
    };
    document.addEventListener('click', click);
    if (location.hash) requestAnimationFrame(() => scrollToTarget(`#${CSS.escape(decodeURIComponent(location.hash.slice(1)))}`, true));
    const pop = () => { if (location.hash) scrollToTarget(`#${CSS.escape(decodeURIComponent(location.hash.slice(1)))}`, true); };
    window.addEventListener('popstate', pop);
    return () => { document.removeEventListener('click', click); window.removeEventListener('popstate', pop); };
  }, []);
}
