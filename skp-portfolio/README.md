# Sanjeev K Paul — portfolio (v3, editorial edition)

Live: https://snj3vpaul.vercel.app

## Stack
- **Vite 7 + React 19 + TypeScript**, prerendered to static HTML at build time (`scripts/prerender.mjs`), then hydrated.
  Search engines, link previews and visitors without JavaScript get the full page.
- **Hero drawing**: an inline SVG still life (`LineStill` in `src/sections/Hero.tsx`), drawn in once with GSAP.
- **GSAP** (ScrollTrigger, SplitText): line-by-line heading reveals, one block reveal, gentle plate drift.
- **Lenis**: weighted smooth scrolling on GSAP's ticker. Off under reduced motion.

Design rationale, the list of cuts, tokens and grid rules: see `DESIGN.md`.

## Content
Every word lives in `src/content.ts`. Project detail pages are static files in `public/project-*.html`.

## Scripts
- `npm run dev` — local dev server
- `npm run build` — type-check, client build, SSR build, prerender into `dist/`
- `npm run preview` — serve `dist/`

## Notes
- Reduced motion: no smooth scroll, no reveals.
- The previous static site is in `archive/static-golden-hour/`; older experiments in `archive/vite-app-old/`.
  Personal photos were moved to `archive/photos/` and are not published.
