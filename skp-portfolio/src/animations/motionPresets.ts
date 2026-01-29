// src/animations/motionPresets.ts
export const easeOut = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

export const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};
