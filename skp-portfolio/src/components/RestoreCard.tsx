import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { gsap, prefersReducedMotion, track, useMedia } from '@/lib/env';
import { LINKS } from '@/content';

/* The restoration card. Everything it shows is measured in the visitor's browser:
   - "Restoring scene": the bytes of the 3D code that were actually fetched (Resource Timing), how fast, and the
     time from the request to the first rendered frame. A cache hit is reported as a cache hit.
   - "Downloading résumé": the PDF streamed with real progress, then handed to the browser as a download. */

export type SceneReport = { state: 'loading' } | { state: 'done'; bytes: number; cached: boolean; ms: number; netMs: number } | { state: 'fallback'; reason: string };

const N = 48;
const kb = (b: number) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(b < 102400 ? 1 : 0)} KB` : `${(b / 1048576).toFixed(2)} MB`);
const rate = (bps: number) => (bps >= 1048576 ? `${(bps / 1048576).toFixed(1)} MB/s` : `${Math.max(0, bps / 1024).toFixed(0)} KB/s`);
const secs = (ms: number) => (ms < 1000 ? `${(ms / 1000).toFixed(2)} s` : `${(ms / 1000).toFixed(1)} s`);

type View = { mode: 'scene' | 'cv'; state: 'loading' | 'done' | 'error' | 'fallback'; p: number | null; size: string; speed: string; time: string; status: string };

export function RestoreCard({ scene }: { scene: SceneReport }) {
  const [view, setView] = useState<View>({ mode: 'scene', state: 'loading', p: null, size: '—', speed: '—', time: '—', status: 'Every number on this card is measured live in your browser.' });
  const dots = useRef<SVGGElement>(null), busy = useRef(false);
  const canDrag = useMedia('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    if (view.mode !== 'scene') return;
    if (scene.state === 'done') {
      const speed = scene.cached ? 'cache' : rate(scene.bytes / Math.max(0.001, scene.netMs / 1000));
      setView(v => ({ ...v, state: 'done', p: 1, size: scene.cached ? 'from cache' : kb(scene.bytes), speed, time: secs(scene.ms),
        status: scene.cached ? `Scene rebuilt from your browser’s cache; first frame in ${secs(scene.ms)}.` : `Scene restored: ${kb(scene.bytes)} of 3D code arrived and drew its first frame in ${secs(scene.ms)}.` }));
    } else if (scene.state === 'fallback') {
      setView(v => ({ ...v, state: 'fallback', p: 1, status: scene.reason }));
    }
  }, [scene, view.mode]);

  /* dots: a chasing highlight while the size is unknown, then a determinate fill */
  useEffect(() => {
    const g = dots.current; if (!g) return;
    const cs = Array.from(g.children) as SVGCircleElement[];
    if (view.p === null) {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(cs, { keyframes: [{ fill: 'var(--gold)', duration: 0.12 }, { fill: 'var(--dot-off)', duration: 0.6 }], stagger: { each: 0.025, repeat: 0 } });
      return () => { tl.kill(); gsap.set(cs, { clearProps: 'fill' }); };
    }
    const on = Math.round(view.p * N);
    gsap.to(cs, { fill: (i: number) => (i < on ? 'var(--gold)' : 'var(--dot-off)'), duration: 0.25, stagger: view.state === 'done' ? 0.012 : 0, overwrite: true });
  }, [view.p, view.state]);

  const downloadCv = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || busy.current || !('fetch' in window)) return;
    e.preventDefault(); busy.current = true; track('resume-restore-card');
    const hint = 88798, t0 = performance.now();
    setView({ mode: 'cv', state: 'loading', p: 0, size: `0 B / ${kb(hint)}`, speed: '—', time: '0.00 s', status: '' });
    try {
      const res = await fetch(LINKS.cv, { cache: 'no-cache' });
      if (!res.ok) throw new Error(String(res.status));
      const total = Number(res.headers.get('content-length')) || hint;
      const chunks: Uint8Array[] = []; let loaded = 0, frame = 0;
      const reader = res.body?.getReader();
      if (reader) for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        chunks.push(value); loaded += value.length;
        if (!frame) frame = requestAnimationFrame(() => { frame = 0; const ms = performance.now() - t0; setView(v => ({ ...v, p: loaded / total, size: `${kb(loaded)} / ${kb(total)}`, speed: rate(loaded / (ms / 1000)), time: secs(ms) })); });
      } else { const b = new Uint8Array(await res.arrayBuffer()); chunks.push(b); loaded = b.length; }
      cancelAnimationFrame(frame);
      const ms = performance.now() - t0;
      const url = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: 'application/pdf' }));
      const a = document.createElement('a'); a.href = url; a.download = 'Sanjeev-K-Paul-CV.pdf'; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setView({ mode: 'cv', state: 'done', p: 1, size: `${kb(loaded)} / ${kb(loaded)}`, speed: rate(loaded / (ms / 1000)), time: secs(ms), status: `Résumé saved: ${kb(loaded)} in ${secs(ms)}.` });
    } catch {
      setView(v => ({ ...v, state: 'error', status: 'The download didn’t finish here. The link still opens the PDF directly.' }));
    }
    busy.current = false;
  };

  return (
    <motion.aside className="restore" data-state={view.state} aria-labelledby="restore-title" drag={canDrag} dragSnapToOrigin dragElastic={0.25} dragMomentum={false} data-cursor={canDrag ? 'drag' : undefined}
      whileDrag={{ scale: 1.03, rotate: -1.5 }}>
      <div className="restore-glare" aria-hidden="true" />
      <div className="restore-head">
        <p className="eyebrow" id="restore-title">{view.mode === 'cv' ? 'Downloading résumé' : 'Restoring scene'}</p>
        <p className="restore-file mono">{view.mode === 'cv' ? 'Sanjeev-K-Paul-CV.pdf' : 'three · webgl'}</p>
      </div>
      <div className="restore-body">
        <div className="ring" aria-hidden="true">
          <svg viewBox="0 0 120 120" className="ring-dots"><g ref={dots}>
            {Array.from({ length: N }, (_, i) => { const a = (i / N) * Math.PI * 2 - Math.PI / 2; return <circle key={i} cx={(60 + 52 * Math.cos(a)).toFixed(2)} cy={(60 + 52 * Math.sin(a)).toFixed(2)} r="2.3" />; })}
          </g></svg>
          <span className="ring-pct mono">{view.p === null ? '···' : `${Math.round(view.p * 100)}%`}</span>
          <svg className="ring-check" viewBox="0 0 120 120"><path d="M40 62 L54 76 L82 46" pathLength={1} /></svg>
        </div>
        <dl className="restore-stats">
          <div><dt>Downloaded</dt><dd className="mono">{view.size}</dd></div>
          <div><dt>Speed</dt><dd className="mono">{view.speed}</dd></div>
          <div><dt>Time</dt><dd className="mono">{view.time}</dd></div>
        </dl>
      </div>
      <p className="restore-status" role="status" aria-live="polite">{view.status}</p>
      <div className="restore-actions">
        <a className="chip chip-solid" href={LINKS.cv} download="Sanjeev-K-Paul-CV.pdf" onClick={downloadCv}>Download résumé <span className="sr-only">(PDF, 87 KB)</span></a>
        <a className="chip" href={LINKS.cv} target="_blank" rel="noopener noreferrer" data-track="resume-header">Open ↗</a>
      </div>
    </motion.aside>
  );
}
