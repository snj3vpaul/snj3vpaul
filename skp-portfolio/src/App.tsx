import { useEffect } from 'react';
import { Intro, Header, Progress, Jump, useAnchors } from '@/components/Chrome';
import { Cursor } from '@/components/fx';
import { Hero } from '@/sections/Hero';
import { Work, Record, Projects } from '@/sections/WorkRecordProjects';
import { Side, Approach, Journey, Writing } from '@/sections/SideApproachJourney';
import { Interlude, Life, Field, Contact, Footer } from '@/sections/LifeFieldContact';
import { startSmoothScroll } from '@/lib/scroll';
import { ScrollTrigger, track } from '@/lib/env';
import './styles/app.css';

export default function App() {
  useAnchors();
  useEffect(() => {
    startSmoothScroll();
    // analytics: one delegated listener for every data-track element
    const click = (e: MouseEvent) => { const t = (e.target as Element)?.closest?.<HTMLElement>('[data-track]'); if (t?.dataset.track) track(t.dataset.track); };
    document.addEventListener('click', click);
    const vis = () => document.documentElement.classList.toggle('is-hidden-tab', document.hidden);
    document.addEventListener('visibilitychange', vis);
    // fonts change line lengths: re-measure every trigger once they're in
    // measure again once the intro has lifted (the page is scroll-locked while it plays), after fonts, and after load
    // (Motion's useScroll re-measures on resize, so a synthetic resize brings its progress values up to date too)
    const refresh = () => requestAnimationFrame(() => { window.dispatchEvent(new Event('resize')); ScrollTrigger.refresh(); });
    document.fonts?.ready.then(refresh);
    window.addEventListener('intro:done', refresh);
    window.addEventListener('load', refresh);
    const late = setTimeout(refresh, 1200);
    return () => { document.removeEventListener('click', click); document.removeEventListener('visibilitychange', vis); window.removeEventListener('intro:done', refresh); window.removeEventListener('load', refresh); clearTimeout(late); };
  }, []);
  return (
    <>
      <Intro />
      <a className="skip-link" href="#main">Skip to content</a>
      <Cursor />
      <Header />
      <Progress />
      <Jump />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Work />
        <Record />
        <Projects />
        <Side />
        <Approach />
        <Journey />
        <Writing />
        <Interlude />
        <Life />
        <Field />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
