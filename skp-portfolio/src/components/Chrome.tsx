import { useEffect, useRef, useState } from 'react';
import { NAV, LINKS } from '@/content';
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/env';
import { scrollToTarget, setScrollLock } from '@/lib/scroll';

/* ---------- Intro: the SNJV monogram, once per visit, never under reduced motion. Short and quiet. ---------- */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const html = document.documentElement;
    const done = () => { html.classList.remove('intro'); window.dispatchEvent(new Event('intro:done')); };
    if (!html.classList.contains('intro')) { window.dispatchEvent(new Event('intro:done')); return; }
    const tl = gsap.timeline({ onComplete: done, defaults: { ease: 'expo.out' } });
    tl.from('.intro-letter', { yPercent: 110, duration: 1, stagger: 0.06 }, 0)
      .to('.intro-rule', { scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, 0.1)
      .to(root.current, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, 1.35);
    return () => { tl.kill(); };
  }, []);
  return (
    <div className="intro" ref={root} aria-hidden="true">
      <p className="intro-word">{'SNJV'.split('').map(c => <span className="intro-mask" key={c}><span className="intro-letter">{c}</span></span>)}</p>
      <span className="intro-rule" />
    </div>
  );
}

/* ---------- Header: wordmark, five chapters, résumé; a full-screen index on small screens ---------- */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState('');
  const menuBtn = useRef<HTMLButtonElement>(null), menu = useRef<HTMLElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener('scroll', on, { passive: true });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setCurrent(e.target.id); }), { rootMargin: '-45% 0px -50% 0px' });
    NAV.forEach(n => { const el = document.getElementById(n.href.slice(1)); if (el) io.observe(el); });
    return () => { window.removeEventListener('scroll', on); io.disconnect(); };
  }, []);

  useEffect(() => {
    setScrollLock(open);
    if (open) setTimeout(() => menu.current?.querySelector<HTMLAnchorElement>('li a')?.focus(), 150);
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) { setOpen(false); menuBtn.current?.focus(); } };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [open]);

  return (
    <>
      <header className={`masthead${scrolled ? ' is-scrolled' : ''}`} id="top">
        <a className="wordmark" href="#top" aria-label="Sanjeev K Paul, back to top">Sanjeev K Paul</a>
        <nav className="nav" aria-label="Chapters">
          {NAV.map(n => <a key={n.href} href={n.href} aria-current={current === n.href.slice(1) ? 'true' : undefined}>{n.label}</a>)}
        </nav>
        <a className="masthead-cv" href={LINKS.cv} target="_blank" rel="noopener noreferrer" data-track="resume-nav">Résumé</a>
        <button ref={menuBtn} className={`menu-toggle${open ? ' is-open' : ''}`} type="button" aria-expanded={open} aria-controls="index-nav" onClick={() => setOpen(o => !o)}>
          <span className="menu-word">{open ? 'Close' : 'Index'}</span>
        </button>
      </header>
      <nav ref={menu} className={`index-nav${open ? ' is-open' : ''}`} id="index-nav" aria-label="Chapters, full screen" aria-hidden={!open} inert={!open}
        onClick={e => { if ((e.target as Element).closest('a')) setOpen(false); }}>
        <ol>
          {NAV.map((n, i) => (
            <li key={n.href} style={{ transitionDelay: open ? `${0.12 + i * 0.05}s` : '0s' }}>
              <a href={n.href}><span className="index-n">{n.n}</span>{n.label}</a>
            </li>
          ))}
        </ol>
        <p className="index-foot"><a href={LINKS.cv} target="_blank" rel="noopener noreferrer" data-track="resume-nav">Résumé (PDF)</a><a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a><a href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </nav>
    </>
  );
}

/* ---------- Reading progress: a single hairline ---------- */
export function Progress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const set = () => { raf = 0; const max = document.documentElement.scrollHeight - innerHeight; if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`; };
    const on = () => { if (!raf) raf = requestAnimationFrame(set); };
    set(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
  return <div className="progress" aria-hidden="true" ref={bar} />;
}

/* ---------- In-page links: weighted glide (Lenis), focus moves to the target; old hashes still land ---------- */
const ALIASES: Record<string, string> = {
  'professional-work': 'work', impact: 'work', 'personal-projects': 'projects', sports: 'rsfc',
  practice: 'approach', experience: 'journey', life: 'beyond', about: 'beyond', outside: 'beyond', hello: 'beyond', field: 'cricket',
};
export function useAnchors() {
  useEffect(() => {
    const resolve = (id: string) => (document.getElementById(id) ? id : ALIASES[id] ?? id);
    const go = (raw: string, immediate = false) => {
      const id = resolve(raw);
      if (id === 'top') { scrollToTarget('#top', immediate); return; }
      const t = document.getElementById(id); if (!t) return;
      scrollToTarget(t, immediate);
      if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
      setTimeout(() => t.focus({ preventScroll: true }), immediate || prefersReducedMotion() ? 0 : 60);
    };
    const click = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const id = decodeURIComponent(a.getAttribute('href')!.slice(1));
      if (!id) return;
      e.preventDefault();
      history.pushState(null, '', `${location.search}#${id}`);
      go(id);
    };
    document.addEventListener('click', click);
    /* a hash on arrival: jump now, and again once the intro has lifted (the page is scroll-locked while it plays) */
    const arrive = () => { if (location.hash) go(decodeURIComponent(location.hash.slice(1)), true); };
    requestAnimationFrame(arrive);
    window.addEventListener('intro:done', arrive, { once: true });
    const pop = () => { if (location.hash) go(decodeURIComponent(location.hash.slice(1)), true); };
    window.addEventListener('popstate', pop);
    return () => { document.removeEventListener('click', click); window.removeEventListener('popstate', pop); window.removeEventListener('intro:done', arrive); };
  }, []);
}
