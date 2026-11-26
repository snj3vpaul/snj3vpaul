import { useEffect, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

export const isBrowser = typeof window !== 'undefined';
export const useIsoLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

if (isBrowser) gsap.registerPlugin(ScrollTrigger, SplitText);
export { gsap, ScrollTrigger, SplitText };

const mq = (q: string) => (isBrowser ? window.matchMedia(q).matches : false);
export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)');
export const hasFinePointer = () => mq('(hover: hover) and (pointer: fine)');

/** false during SSR and the first client render (so hydration matches), then the real value */
export function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on(); m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return match;
}
export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export const track = (name: string) => {
  const va = isBrowser ? (window as unknown as { va?: (e: string, p: object) => void }).va : undefined;
  if (typeof va === 'function') va('event', { name });
};

if (isBrowser && /[?&]debug\b/.test(location.search)) (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
