'use client';
/* Personal builds as tabs. The active-tab pill slides between tabs (shared layout); panels cross-fade.
   Recordings play only while their panel is on screen and motion is allowed. Without JS every panel is shown. */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { builds } from '@/lib/content';
import { spring } from '@/lib/motion';

export default function ProjectTabs() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const select = (i: number, focus = false) => { setActive(i); if (focus) tabs.current[i]?.focus(); };

  useEffect(() => {
    const onGo = (e: Event) => { const i = builds.findIndex(b => b.id === (e as CustomEvent<string>).detail); if (i >= 0) setActive(i); };
    addEventListener('portfolio:goto', onGo); return () => removeEventListener('portfolio:goto', onGo);
  }, []);
  useEffect(() => {
    const motionOK = matchMedia('(prefers-reduced-motion: no-preference)').matches;
    const seen = new Set<HTMLVideoElement>();
    const sync = () => videos.current.forEach((v, i) => { if (!v) return; if (i === active && seen.has(v) && motionOK && !document.hidden) v.play().catch(() => {}); else v.pause(); });
    const io = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? seen.add(e.target as HTMLVideoElement) : seen.delete(e.target as HTMLVideoElement)); sync(); }, { rootMargin: '120px' });
    videos.current.forEach(v => v && io.observe(v)); document.addEventListener('visibilitychange', sync); sync();
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, [active]);

  return (
    <>
      <div className="proj-tabs" role="tablist" aria-label="Projects">
        {builds.map((b, i) => (
          <button key={b.id} ref={el => { tabs.current[i] = el; }} className="proj-tab" type="button" role="tab" id={`tab-${b.id}`} aria-controls={b.id}
            aria-selected={i === active} tabIndex={i === active ? 0 : -1} onClick={() => select(i)}
            onKeyDown={e => { const k = ({ ArrowRight: 1, ArrowLeft: -1, Home: -i, End: builds.length - 1 - i } as Record<string, number>)[e.key]; if (k === undefined) return; e.preventDefault(); select((i + k + builds.length) % builds.length, true); }}>
            {i === active && <motion.span layoutId="proj-pill" className="proj-pill" transition={spring} aria-hidden="true" />}
            <span className="proj-tab-label">{b.tab}</span>
          </button>
        ))}
      </div>
      {builds.map((b, i) => (
        <div key={b.id} className={`proj-panel${i === active ? ' is-active' : ''}`} id={b.id} role="tabpanel" aria-labelledby={`tab-${b.id}`} tabIndex={-1} hidden={i !== active}>
          <div className="lab-grid">
            <div className="lab-copy">
              <p className="case-kicker">{b.kicker}</p>
              <h3 className="panel-title">{b.title.before}<em>{b.title.em}</em></h3>
              <p className="lead">{b.lead}</p>
              <ol className="lab-tools">{b.tools.map(([h, p]) => <li key={h}><h4>{h}</h4><p>{p}</p></li>)}</ol>
              <dl className="spec">{b.spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              {b.actions.length > 0 && <p className="lab-actions">{b.actions.map(a => <a key={a.href} className={a.solid ? 'btn btn-solid' : 'quiet'} href={a.href} data-track={a.track} {...(a.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{a.label}</a>)}</p>}
            </div>
            <figure className="lab-visual" aria-hidden="true">
              <video ref={el => { videos.current[i] = el; }} className="loop" muted playsInline loop preload="none" poster={b.video.poster}><source src={b.video.src} type="video/mp4" /></video>
              <figcaption>{b.video.caption}</figcaption>
            </figure>
          </div>
        </div>
      ))}
    </>
  );
}
