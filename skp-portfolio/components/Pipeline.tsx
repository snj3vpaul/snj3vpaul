'use client';
/*
 * The Assurance Pipeline.
 * Story mode (wide screens, motion allowed): the section is four screens tall; a sticky stage stays in view while native
 * scrolling advances Cryptography → Implementation → Validation → Certification. The line fills with scroll progress.
 * Nothing intercepts the wheel: the page scrolls exactly as it always does. Stages are also tabs: click, or arrow keys,
 * scroll the page to that stage.
 * Static mode (server render, phones, reduced motion, no JS): every stage is listed, open, in order.
 */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import Art from './Art';
import { pipeline } from '@/lib/content';
import { ease } from '@/lib/motion';

const { stages } = pipeline;

function StaticList() {
  return (
    <ol className="pl-list">
      {stages.map((s, i) => (
        <li key={s.id} className="pl-item">
          <div className="pl-item-art"><Art kind={s.art} /></div>
          <div>
            <p className="pl-n">{String(i + 1).padStart(2, '0')}</p>
            <h3>{s.name}</h3>
            <p className="pl-sub">{s.sub}</p>
            <p className="pl-body">{s.body}</p>
            <p className="pl-mine"><b>Where I come in</b>{s.mine}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: .4 });
  const lineScale = useTransform(fill, [0, 1], [0, 1]);
  useMotionValueEvent(scrollYProgress, 'change', p => setActive(Math.min(stages.length - 1, Math.max(0, Math.floor(p * stages.length * .999)))));

  const goTo = (i: number, focus = false) => {
    const el = ref.current; if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY;
    const span = el.offsetHeight - innerHeight;
    scrollTo({ top: top + span * ((i + .5) / stages.length), behavior: 'smooth' });
    setActive(i);
    if (focus) tabs.current[i]?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const k = ({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: -i, End: stages.length - 1 - i } as Record<string, number>)[e.key];
    if (k === undefined) return; e.preventDefault(); goTo((i + k + stages.length) % stages.length, true);
  };
  const s = stages[active];

  return (
    <div className="pl-story" ref={ref} style={{ height: `${stages.length * 70 + 40}vh` }}>
      <div className="pl-sticky">
        <div className="pl-rail">
          <svg className="pl-rail-line" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true">
            <line x1="1" y1="0" x2="1" y2="100" className="pl-track" />
            <motion.line x1="1" y1="0" x2="1" y2="100" className="pl-fill" style={{ scaleY: lineScale, transformOrigin: '50% 0%' }} />
          </svg>
          <div role="tablist" aria-orientation="vertical" aria-label="Areas of expertise" className="pl-tabs">
            {stages.map((st, i) => (
              <button key={st.id} ref={el => { tabs.current[i] = el; }} role="tab" type="button" id={`pl-tab-${st.id}`} aria-controls="pl-panel" aria-selected={i === active}
                tabIndex={i === active ? 0 : -1} className="pl-tab" onClick={() => goTo(i)} onKeyDown={e => onKey(e, i)}>
                <span className="pl-dot" aria-hidden="true">{i === active && <motion.span layoutId="pl-dot" className="pl-dot-on" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}</span>
                <span className="pl-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="pl-name">{st.name}</span>
                <span className="pl-sub">{st.sub}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="pl-stage-view" id="pl-panel" role="tabpanel" aria-labelledby={`pl-tab-${s.id}`} tabIndex={0}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={s.id} className="pl-view-inner"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: .45, ease }}>
              <div className="pl-view-art draw"><Art kind={s.art} /></div>
              <div className="pl-view-copy">
                <p className="pl-n">{String(active + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}</p>
                <h3>{s.name}</h3>
                <p className="pl-body">{s.body}</p>
                <p className="pl-mine"><b>Where I come in</b>{s.mine}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <p className="pl-hint" aria-hidden="true">Scroll to move through the four, or pick one.</p>
        </div>
      </div>
    </div>
  );
}

export default function Pipeline() {
  const [story, setStory] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(min-width: 980px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)');
    const set = () => setStory(mq.matches); set(); mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);
  return (
    <>
      {story ? <Story /> : <StaticList />}
      <p className="pl-note">{pipeline.note}</p>
    </>
  );
}
