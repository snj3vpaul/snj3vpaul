/* Motion tokens shared by components; the same values live as CSS custom properties in globals.css. */
export const ease = [0.2, 0.7, 0.2, 1] as const;      // --ease
export const easeInOut = [0.6, 0, 0.2, 1] as const;   // --ease-io
export const dur = { fast: 0.18, base: 0.32, reveal: 0.6, draw: 0.9 }; // --d-1 … --d-4
export const spring = { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 } as const;
