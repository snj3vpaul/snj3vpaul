'use client';
/* Motion honours the visitor's reduced-motion setting everywhere: transforms and layout animations are skipped. */
import { MotionConfig } from 'motion/react';
export default function Providers({ children }: { children: React.ReactNode }) { return <MotionConfig reducedMotion="user">{children}</MotionConfig>; }
