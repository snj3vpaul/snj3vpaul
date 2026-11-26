'use client';
/*
 * Canterbury's puzzle: a Caesar wheel. The outer ring is the plain alphabet; the inner ring turns.
 * Drag it, or focus it and use the arrow keys (it is a slider to assistive tech). At the right shift the note reads.
 * Without JS the ciphertext and a "Show the answer" disclosure are still there.
 */
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';

const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const rot = (s: string, k: number) => s.replace(/[A-Z]/g, c => A[(A.indexOf(c) + k + 26 * 4) % 26]);
const STEP = 360 / 26;

export default function CipherWheel({ plain, shift }: { plain: string; shift: number }) {
  const cipher = rot(plain, shift);
  const [back, setBack] = useState(0);
  const [js, setJs] = useState(false);
  const angle = useMotionValue(0);
  const inner = useTransform(angle, a => `rotate(${a}deg)`);
  const wheel = useRef<SVGSVGElement>(null);
  const drag = useRef<{ start: number; from: number } | null>(null);
  useEffect(() => setJs(true), []);

  const settle = (k: number) => {
    const n = ((k % 26) + 26) % 26; setBack(n);
    const target = -n * STEP;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* take the short way round */
    let cur = angle.get(); while (cur - target > 180) cur -= 360; while (target - cur > 180) cur += 360; angle.set(cur);
    if (reduce) angle.set(target); else animate(angle, target, { type: 'spring', stiffness: 300, damping: 26 });
  };
  const pointerAngle = (e: React.PointerEvent) => { const r = wheel.current!.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
  const text = rot(cipher, -back), solved = text === plain;

  const R1 = 92, R2 = 66;
  return (
    <div className="wheel-wrap">
      <div className="wheel-copy">
        <p className="sub-label" id="puzzle-title">A note from the dressing room, encrypted</p>
        <p className={`puzzle-text${solved ? ' is-solved' : ''}`} aria-live="off"><span className="sr-only">Current reading: </span>{js ? text : cipher}</p>
        {js && <p className="wheel-help">Turn the inner ring, or focus it and use the arrow keys. Shift back by <b>{back}</b>.</p>}
        <p className="puzzle-status" role="status" aria-live="polite">{solved ? 'Solved. A Caesar shift of 7: two thousand years old and broken in seconds.' : ''}</p>
        <details className="puzzle-answer"><summary>Show the answer</summary>
          <p>Shift every letter back by 7: <b>{plain}</b>. A Caesar cipher: two thousand years old and broken in seconds, which is why real security starts somewhere else.</p>
        </details>
      </div>
      <svg ref={wheel} className={`wheel${js ? ' is-live' : ''}`} viewBox="-110 -110 220 220" role={js ? 'slider' : undefined} tabIndex={js ? 0 : undefined}
        aria-label="Cipher wheel: shift back by" aria-valuemin={0} aria-valuemax={25} aria-valuenow={back} aria-valuetext={`Shift back by ${back}: ${text}`}
        onKeyDown={e => { const d = ({ ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 5, PageDown: -5 } as Record<string, number>)[e.key]; if (e.key === 'Home') { e.preventDefault(); settle(0); } else if (d) { e.preventDefault(); settle(back + d); } }}
        onPointerDown={e => { if (!js) return; (e.target as Element).setPointerCapture?.(e.pointerId); drag.current = { start: pointerAngle(e), from: angle.get() }; }}
        onPointerMove={e => { if (!drag.current) return; angle.set(drag.current.from + pointerAngle(e) - drag.current.start); }}
        onPointerUp={() => { if (!drag.current) return; drag.current = null; settle(Math.round(-angle.get() / STEP)); }}
        onPointerCancel={() => { drag.current = null; settle(back); }}>
        <circle r="104" className="wheel-rim" />
        {[...A].map((c, i) => { const t = (i * STEP - 90) * Math.PI / 180; return <text key={c} x={Math.cos(t) * R1} y={Math.sin(t) * R1} className="wheel-outer" textAnchor="middle" dominantBaseline="central">{c}</text>; })}
        <circle r="78" className="wheel-sep" />
        <motion.g style={{ transform: inner, transformOrigin: '0px 0px' }}>
          {[...A].map((c, i) => { const t = (i * STEP - 90) * Math.PI / 180; return <text key={c} x={Math.cos(t) * R2} y={Math.sin(t) * R2} className="wheel-inner" textAnchor="middle" dominantBaseline="central" transform={`rotate(${i * STEP} ${Math.cos(t) * R2} ${Math.sin(t) * R2})`}>{c}</text>; })}
          <circle r="50" className="wheel-hub" />
        </motion.g>
        <path d="M0 -104 L-5 -114 L5 -114 Z" className="wheel-pointer" />
        <text y="4" className="wheel-hub-label" textAnchor="middle">{back}</text>
      </svg>
    </div>
  );
}
