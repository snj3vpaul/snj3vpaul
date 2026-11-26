# Sanjeev K Paul — portfolio (v3)

Live: https://snj3vpaul.vercel.app

## Stack
- **Vite 7 + React 19 + TypeScript**, prerendered to static HTML at build time (`scripts/prerender.mjs`), then hydrated.
  Search engines, link previews and visitors without JavaScript get the full page.
- **Three.js / React Three Fiber**: the hero still life (`src/three/HeroScene.tsx`) and the golden light field in the
  interlude (`src/three/GoldField.tsx`, one GLSL fragment shader). Both load after first paint and stop rendering off screen.
- **GSAP** (ScrollTrigger, SplitText): split-line headings, count-ups, stacking project panels, line drawings, timeline.
- **Motion** (Framer Motion): springs for the cursor, previews and tilt cards; shared-layout nav dot.
- **Lenis**: smooth scrolling on GSAP's ticker. Off under reduced motion.

## Content
Every word lives in `src/content.ts`. Project detail pages are static files in `public/project-*.html`.

## Scripts
- `npm run dev` — local dev server
- `npm run build` — type-check, client build, SSR build, prerender into `dist/`
- `npm run preview` — serve `dist/`

## Notes
- The restoration card reports real numbers: bytes of 3D code fetched (Resource Timing), speed and time to first frame;
  and a real streamed download of `cv.pdf`.
- Reduced motion: no smooth scroll, no reveals, still 3D frame. Reduced transparency / more contrast: no glass, no grain.
- `tools/still-life.py` renders `public/img/still-life*.webp`, the poster shown before WebGL is ready (or without it).
- The previous static site is in `archive/static-golden-hour/`; older experiments in `archive/vite-app-old/`.
  Personal photos were moved to `archive/photos/` and are not published.
