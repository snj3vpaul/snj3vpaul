'use client';
/* Header, mobile menu, reading progress, and the "jump to a section" control. */
import { useEffect, useRef, useState } from 'react';
import { nav, mobileNav } from '@/lib/content';

export default function SiteChrome() {
  const [menu, setMenu] = useState(false);
  const [jumpOn, setJumpOn] = useState(false);
  const [jumpOpen, setJumpOpen] = useState(false);
  const [current, setCurrent] = useState<{ id: string; name: string } | null>(null);
  const [chapters, setChapters] = useState<{ id: string; name: string }[]>([]);
  const bar = useRef<HTMLSpanElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const jumpBtn = useRef<HTMLButtonElement>(null);
  const jump = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter-name]'));
    setChapters(els.map(s => ({ id: s.id, name: s.dataset.chapterName! })));
    let ticking = false;
    const onScroll = () => {
      ticking = false; const d = document.documentElement, max = d.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
      const on = scrollY > innerHeight * .8; setJumpOn(on); if (!on) setJumpOpen(false);
      let cur: HTMLElement | null = null;
      for (const s of els) if (s.offsetParent !== null && s.getBoundingClientRect().top < innerHeight * .4) cur = s;
      setCurrent(cur ? { id: cur.id, name: cur.dataset.chapterName! } : null);
    };
    const sched = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
    addEventListener('scroll', sched, { passive: true }); addEventListener('resize', sched); onScroll();
    const onKey = (e: KeyboardEvent) => { if (e.key !== 'Escape') return; setMenu(m => { if (m) menuBtn.current?.focus(); return false; }); setJumpOpen(o => { if (o) jumpBtn.current?.focus(); return false; }); };
    const onClick = (e: MouseEvent) => { if (jump.current && !jump.current.contains(e.target as Node)) setJumpOpen(false); };
    document.addEventListener('keydown', onKey); document.addEventListener('click', onClick);
    return () => { removeEventListener('scroll', sched); removeEventListener('resize', sched); document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); };
  }, []);

  const cur = (href: string) => (current && href === `#${current.id}` ? 'true' : undefined);
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="bar" id="top">
        <a className="wordmark" href="#top" aria-label="Sanjeev K Paul, back to top">Sanjeev K Paul</a>
        <nav className="nav" aria-label="Primary navigation">
          {nav.map(n => <a key={n.href} href={n.href} aria-current={cur(n.href)}>{n.label}</a>)}
          <a href="cv.pdf" target="_blank" rel="noopener noreferrer" data-track="resume-nav">Résumé ↗</a>
        </nav>
        <a className="bar-cta" href="#contact" data-track="contact-header">Get in touch</a>
        <button ref={menuBtn} className={`menu-toggle${menu ? ' is-open' : ''}`} type="button" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(m => !m)}><span /><span /></button>
        <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" hidden={!menu} onClick={e => { if ((e.target as Element).closest('a')) setMenu(false); }}>
          {mobileNav.map(n => <a key={n.href} href={n.href}>{n.label}</a>)}
          <a href="cv.pdf" target="_blank" rel="noopener noreferrer" data-track="resume-nav">Résumé ↗</a>
          <a href="#contact">Let’s talk</a>
        </nav>
      </header>
      <div className="progress" aria-hidden="true"><span ref={bar} /></div>
      <div className={`jump${jumpOn ? ' is-on' : ''}`} ref={jump} inert={!jumpOn}>
        <button ref={jumpBtn} className="jump-btn" type="button" aria-expanded={jumpOpen} aria-controls="jump-list" onClick={() => setJumpOpen(o => !o)}>
          <span className="sr-only">Jump to a section. Current section: </span><span>{current?.name ?? 'About'}</span>
          <svg className="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 10l4-4 4 4" /></svg>
        </button>
        <nav className="jump-list" id="jump-list" aria-label="All sections" hidden={!jumpOpen} onClick={e => { if ((e.target as Element).closest('a')) setJumpOpen(false); }}>
          {chapters.map(c => <a key={c.id} href={`#${c.id}`} aria-current={current?.id === c.id ? 'true' : undefined}>{c.name}</a>)}
        </nav>
      </div>
    </>
  );
}
