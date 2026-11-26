'use client';
/* The cricket scorebook: a native scroll-snap rail with count and prev/next, moved only by the visitor. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { field } from '@/lib/content';

export default function Reel() {
  const rail = useRef<HTMLUListElement>(null);
  const [i, setI] = useState(0); const [edges, setEdges] = useState({ start: true, end: false }); const [js, setJs] = useState(false);
  const step = () => { const c = rail.current!.children; return c.length > 1 ? (c[1] as HTMLElement).offsetLeft - (c[0] as HTMLElement).offsetLeft : rail.current!.clientWidth; };
  const update = useCallback(() => { const r = rail.current; if (!r) return; const max = r.scrollWidth - r.clientWidth; setI(r.scrollLeft >= max - 2 ? field.reel.length - 1 : Math.round(r.scrollLeft / step())); setEdges({ start: r.scrollLeft <= 2, end: r.scrollLeft >= max - 2 }); }, []);
  useEffect(() => { setJs(true); update(); addEventListener('resize', update); return () => removeEventListener('resize', update); }, [update]);
  const by = (d: number) => rail.current?.scrollBy({ left: d * step(), behavior: matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'auto' });
  return (
    <div className="reel">
      <div className="reel-head"><p className="sub-label">The scorebook</p>
        <div className="reel-ctrl"><p className="reel-count" aria-hidden="true"><b>{i + 1}</b> / {field.reel.length}</p>
          {js && <><button type="button" onClick={() => by(-1)} disabled={edges.start} aria-label="Previous accolade"><svg className="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg></button>
          <button type="button" onClick={() => by(1)} disabled={edges.end} aria-label="Next accolade"><svg className="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" /></svg></button></>}
        </div>
      </div>
      <ul className="reel-track" ref={rail} tabIndex={0} aria-label="Cricket and soccer accolades" onScroll={() => requestAnimationFrame(update)}
        onKeyDown={e => { if (e.target !== rail.current) return; const d = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key]; if (d) { e.preventDefault(); by(d); } }}>
        {field.reel.map(([tag, num, h, p]) => <li key={h}><p className="reel-tag">{tag}</p><p className="reel-num">{num}</p><h3>{h}</h3><p>{p}</p></li>)}
      </ul>
    </div>
  );
}
