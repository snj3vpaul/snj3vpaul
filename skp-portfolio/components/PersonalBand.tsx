'use client';
/* The hand-off from professional to personal: as the band arrives, its ground warms from midnight navy to a lighter
   navy and the amber dot grid fades in. Scroll-linked, so it simply follows the reader; no motion when reduced.
   Server render and no-JS show the finished state. */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function PersonalBand({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => setLive(matchMedia('(prefers-reduced-motion: no-preference)').matches), []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 35%'] });
  const bg = useTransform(scrollYProgress, [0, 1], ['#0a1020', '#121d36']);
  const dots = useTransform(scrollYProgress, [0.3, 1], [0, 1]);
  return (
    <motion.div ref={ref} className="personal" style={live ? { backgroundColor: bg } : undefined}>
      <motion.div className="personal-dots" aria-hidden="true" style={live ? { opacity: dots } : undefined} />
      {children}
    </motion.div>
  );
}
