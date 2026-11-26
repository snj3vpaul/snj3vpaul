'use client';
/* The contact button leans toward a nearby pointer on desktop. Touch, keyboard and reduced motion get a plain button. */
import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export default function Magnetic({ children, href, track }: { children: React.ReactNode; href: string; track: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 260, damping: 18 }), y = useSpring(0, { stiffness: 260, damping: 18 });
  const [on, setOn] = useState(false);
  useEffect(() => setOn(matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches), []);
  useEffect(() => {
    if (!on) return; const area = ref.current?.closest('.contact-actions') as HTMLElement | null; if (!area) return;
    const move = (e: PointerEvent) => { const r = ref.current!.getBoundingClientRect(); const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2); const pull = Math.max(0, 1 - Math.hypot(dx, dy) / 150); x.set(dx * .2 * pull); y.set(dy * .28 * pull); };
    const leave = () => { x.set(0); y.set(0); };
    area.addEventListener('pointermove', move); area.addEventListener('pointerleave', leave);
    return () => { area.removeEventListener('pointermove', move); area.removeEventListener('pointerleave', leave); };
  }, [on, x, y]);
  return <motion.a ref={ref} className="btn btn-solid btn-lg" href={href} data-track={track} style={on ? { x, y } : undefined}>{children}</motion.a>;
}
