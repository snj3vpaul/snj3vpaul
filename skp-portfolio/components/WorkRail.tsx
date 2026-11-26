'use client';
/*
 * Professional work: a horizontal, natively scrolling rail (scroll-snap; wheel, trackpad, touch, arrow keys, buttons).
 * "Read the case" opens a case-study sheet; the card's drawing and title travel into it with a shared-layout transition
 * and travel back on close. The sheet is a proper modal: focus moves in, Tab stays inside, Escape closes, focus returns.
 * Without JS each card keeps its <details> case notes and a link to the full case page.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import Art from './Art';
import { work, type Case } from '@/lib/content';
import { ease, spring } from '@/lib/motion';

const Mark = ({ kind }: { kind: Case['status']['kind'] }) => <span className={`mark mark-${kind === 'valid' ? 'valid' : kind}`} aria-hidden="true" />;

function Sheet({ c, onClose }: { c: Case; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!; const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    el.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const f = Array.from(el.querySelectorAll<HTMLElement>('a[href],button,[tabindex]:not([tabindex="-1"])'));
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.documentElement.style.overflow = prev; };
  }, [onClose]);
  return (
    <motion.div className="sheet-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }} onClick={onClose}>
      <motion.div ref={ref} className="casesheet" role="dialog" aria-modal="true" aria-labelledby={`sheet-${c.id}`} onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: .4, ease }}>
        <button type="button" className="casesheet-close" onClick={onClose} data-autofocus aria-label="Close case study">Close <span aria-hidden="true">×</span></button>
        <div className="sheet-grid">
          <motion.div layoutId={`art-${c.id}`} className="case-art sheet-art draw" transition={spring}><Art kind={c.art} /></motion.div>
          <div className="sheet-copy">
            <p className="case-kicker">{c.kicker}</p>
            <motion.h2 layoutId={`title-${c.id}`} id={`sheet-${c.id}`} transition={spring}>{c.title}</motion.h2>
            <p className="case-when">{c.when}</p>
            <p className="sheet-desc">{c.desc}</p>
            <p className="case-status"><Mark kind={c.status.kind} />{c.status.label}</p>
            <dl className="spec sheet-spec">{c.notes.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            {c.links.length > 0 && <p className="case-foot">{c.links.map(l => <a key={l.href} className="quiet" href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.label} {l.external ? '↗' : '→'}</a>)}</p>}
            <p className="sheet-note">Certificates are issued to modules, not people. This says what my part was.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WorkRail() {
  const rail = useRef<HTMLOListElement>(null);
  const [index, setIndex] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [progress, setProgress] = useState(1 / work.length);
  const [open, setOpen] = useState<string | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [js, setJs] = useState(false);
  useEffect(() => setJs(true), []);

  const step = () => { const r = rail.current!; const c = r.children; return c.length > 1 ? (c[1] as HTMLElement).offsetLeft - (c[0] as HTMLElement).offsetLeft : r.clientWidth; };
  const update = useCallback(() => {
    const r = rail.current; if (!r) return; const max = r.scrollWidth - r.clientWidth;
    setIndex(r.scrollLeft >= max - 2 ? work.length - 1 : Math.round(r.scrollLeft / step()));
    setEdges({ start: r.scrollLeft <= 2, end: r.scrollLeft >= max - 2 });
    setProgress(max > 0 ? Math.max(1 / work.length, (r.scrollLeft + r.clientWidth) / r.scrollWidth) : 1);
  }, []);
  useEffect(() => {
    update(); addEventListener('resize', update);
    /* deep links (#work-…) land on the card: the page scrolls to the section, the rail to the card */
    const onGo = (e: Event) => { const id = (e as CustomEvent<string>).detail; const el = document.getElementById(id); const r = rail.current;
      if (el && r && r.contains(el)) { r.scrollTo({ left: el.offsetLeft - (r.children[0] as HTMLElement).offsetLeft, behavior: 'instant' as ScrollBehavior }); update(); } };
    addEventListener('portfolio:goto', onGo);
    return () => { removeEventListener('resize', update); removeEventListener('portfolio:goto', onGo); };
  }, [update]);
  const smooth = () => matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'auto';
  const by = (d: number) => rail.current?.scrollBy({ left: d * step(), behavior: smooth() as ScrollBehavior });
  const close = useCallback(() => { setOpen(null); requestAnimationFrame(() => opener.current?.focus()); }, []);
  const current = work.find(w => w.id === open);

  return (
    <LayoutGroup>
      <div className="rail-wrap">
        <div className="rail-ctrl">
          <p className="rail-count" aria-hidden="true"><b>{index + 1}</b> / {work.length}</p>
          <div className="rail-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
          {js && <>
            <button type="button" onClick={() => by(-1)} disabled={edges.start} aria-label="Previous project"><svg className="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg></button>
            <button type="button" onClick={() => by(1)} disabled={edges.end} aria-label="Next project"><svg className="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" /></svg></button>
          </>}
        </div>
        <ol className="rail" ref={rail} tabIndex={0} aria-label="Professional work, scroll sideways or use the arrow keys" onScroll={() => requestAnimationFrame(update)}
          onKeyDown={e => { if (e.target !== rail.current) return; const d = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key]; if (d) { e.preventDefault(); by(d); } }}>
          {work.map((c, i) => (
            <li className="case" id={c.id} key={c.id}>
              <article aria-labelledby={`proj-${c.id}`}>
                <div className="case-top"><span className="case-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><p className="case-kicker">{c.kicker}</p></div>
                {open === c.id ? <div className="case-art case-art--ghost" aria-hidden="true" /> :
                  <motion.div layoutId={`art-${c.id}`} className="case-art" aria-hidden="true" transition={spring}><Art kind={c.art} /></motion.div>}
                {open === c.id ? <h3 id={`proj-${c.id}`} className="case-title--ghost">{c.title}</h3> :
                  <motion.h3 layoutId={`title-${c.id}`} id={`proj-${c.id}`} transition={spring}>{c.title}</motion.h3>}
                <p className="case-when">{c.when}</p>
                <p className="case-desc">{c.desc}</p>
                <p className="case-status"><Mark kind={c.status.kind} />{c.status.label}</p>
                {js ? (
                  <button type="button" className="case-open" onClick={e => { opener.current = e.currentTarget; setOpen(c.id); }} aria-haspopup="dialog">
                    Read the case <span aria-hidden="true">+</span><span className="sr-only">: {c.title}</span>
                  </button>
                ) : (
                  <details className="case-more"><summary>Case notes</summary>
                    <dl className="spec">{c.notes.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
                  </details>
                )}
                {c.links.length > 0 && <p className="case-foot">{c.links.map(l => <a key={l.href} className="quiet" href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.label} {l.external ? '↗' : '→'}{l.label === 'Full case' && <span className="sr-only">: {c.title}</span>}</a>)}</p>}
              </article>
            </li>
          ))}
        </ol>
      </div>
      {current && <Sheet key={current.id} c={current} onClose={close} />}
    </LayoutGroup>
  );
}
