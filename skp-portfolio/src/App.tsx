import { useEffect } from 'react';
import { Intro, Header, Progress, useAnchors } from '@/components/Chrome';
import { Hero } from '@/sections/Hero';
import { Work, Projects, Approach, Beyond, Contact, Footer } from '@/sections/Chapters';
import { startSmoothScroll } from '@/lib/scroll';
import { ScrollTrigger, track } from '@/lib/env';
import './styles/app.css';

/* Six chapters: Hero · Selected work · Projects · Approach & journey · Beyond work · Contact */
export default function App() {
  useAnchors();
  useEffect(() => {
    startSmoothScroll();
    const click = (e: MouseEvent) => { const t = (e.target as Element)?.closest?.<HTMLElement>('[data-track]'); if (t?.dataset.track) track(t.dataset.track); };
    document.addEventListener('click', click);
    // re-measure once the intro has lifted, after fonts, and after load
    const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh());
    document.fonts?.ready.then(refresh);
    window.addEventListener('intro:done', refresh);
    window.addEventListener('load', refresh);
    const late = setTimeout(refresh, 1200);
    return () => { document.removeEventListener('click', click); window.removeEventListener('intro:done', refresh); window.removeEventListener('load', refresh); clearTimeout(late); };
  }, []);
  return (
    <>
      <Intro />
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <Progress />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Work />
        <Projects />
        <Approach />
        <Beyond />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
