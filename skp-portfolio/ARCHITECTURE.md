# Architecture decision: portfolio v2

Status: implemented on branch `experience/next-webgl`, not merged. Date: 26 Nov 2026.

## The question

The site was hand-written HTML/CSS/JS after the November remediation. The question was whether that was the right base for a more immersive, interactive portfolio, or only the starting point. The candidates were evaluated against the experience we want, not against the existing code.

## What was measured

Each candidate was installed and bundled with esbuild (minified, production, React external).

| Library | Minified | Gzipped | Notes |
| --- | --- | --- | --- |
| `motion/react` (motion, AnimatePresence, useScroll, useTransform, LayoutGroup) | 151 KB | 53 KB | |
| GSAP + ScrollTrigger | 113 KB | 45 KB | free licence since 2025 |
| Lenis | 18 KB | 5 KB | |
| three.js, tree-shaken (renderer, scene, mesh, shader material) | 520 KB | 130 KB | full build 187 KB gz |
| @react-three/fiber (includes three.js) | 916 KB | 246 KB | |
| lottie-web | 302 KB | 78 KB | |
| @rive-app/canvas | 371 KB | 95 KB | plus a 2.3 MB WASM file |
| @splinetool/runtime | 3,991 KB | 1,081 KB | |

## Three directions

### A — Component-driven (Next.js + Motion for React)
- **Visual potential**: shared-layout transitions (a card becoming a case study), presence animations, springs, scroll-linked values. Strong on interaction quality; on its own, not a "wow" visual.
- **Architecture**: Next.js App Router, statically exported; content in a typed module; one component per interactive section.
- **Performance**: React + Next runtime (~140 KB gz) + Motion (~53 KB gz). Server-rendered HTML keeps first paint fast.
- **Accessibility**: `MotionConfig reducedMotion="user"`; real HTML from the server, so nothing depends on JS to be read.
- **Complexity / maintenance**: moderate; a mainstream stack anyone can pick up.

### B — Scroll storytelling (GSAP + ScrollTrigger)
- **Visual potential**: the best tool for long coordinated timelines and pinned sequences.
- **Architecture**: could sit on plain HTML or React.
- **Performance**: 45 KB gz; pinning adds layout work on scroll.
- **Accessibility**: pinned, scrubbed timelines fight keyboard users, screen magnifiers and mobile browsers' dynamic toolbars; easy to drift into scroll hijacking.
- **Complexity / maintenance**: imperative timelines are hard to change later; duplicates what Motion's `useScroll` already does for this site's needs.

### C — Immersive (three.js / React Three Fiber / WebGL)
- **Visual potential**: the highest ceiling: real depth, light, generative scenes.
- **Architecture**: R3F inside the React tree, lazy-loaded.
- **Performance**: 130–246 KB gz of library before any scene; GPU and battery cost on phones.
- **Accessibility**: canvas content is invisible to assistive tech; needs full fallbacks.
- **Complexity / maintenance**: highest; scene code ages fastest.

## Recommendation, as built: A + the lightest form of C

**Next.js 16 / React 19 (static export) + Motion for React + one hand-written WebGL2 shader.** No three.js.

The one visual that needed a GPU, a field of thousands of encrypted glyphs decrypting under a lens, is a single full-screen fragment shader. It needs no meshes, lights, cameras or models, so a 3D engine would be 130+ KB of unused machinery. The raw WebGL component is about 6 KB.

### Each technology chosen

| | Next.js (static export) | Motion for React | Raw WebGL2 shader |
| --- | --- | --- | --- |
| Experience it enables | Component sections, typed content, server-rendered HTML for every state | Card → case-study shared transition; scroll-told pipeline; sliding tab pill; personal-band colour shift; wheel spring; magnetic button | The hero's cipher field: real XOR ciphertext that decrypts under the pointer/finger |
| Better than before because | The old single-file page could not reuse state or compose interactive pieces cleanly | CSS alone cannot animate between two different elements' layouts or follow scroll smoothly | No CSS/SVG technique draws thousands of changing glyphs at 60 fps |
| Performance cost | ~140 KB gz runtime; static HTML, no server | ~53 KB gz | ~6 KB; draws only while something changes |
| Mobile | Same HTML; layout adapts | Story pipeline turns into a list below 980 px; magnetic off on touch | Field moves below the text in a 300 px band; DPR capped at 1.5; tap moves the lens |
| Reduced motion | n/a | `MotionConfig reducedMotion="user"`; story mode off | One finished frame, no loop |
| Maintainable | Mainstream; content in `lib/content.ts` | Declarative, colocated with components | One file, commented; shader in a string |
| Genuinely improves the portfolio | Yes: the base for everything below | Yes: the transitions explain relationships (card to case, stage to stage) | Yes: the signature moment, and it is about the work |

### Rejected

- **GSAP + ScrollTrigger.** Overlaps Motion's scroll features. A second animation system would cost more upkeep than it adds.
- **Lenis.** Replaces native scrolling. The gain is small, and it costs keyboard, find-in-page and assistive-tech behaviour.
- **three.js / React Three Fiber.** 130–246 KB of library for a flat effect.
- **Spline.** 1 MB runtime, and scenes live outside the repository.
- **Rive.** A 2.3 MB WASM file, and it needs a designer tool pipeline.
- **Lottie.** There are no After Effects sources, and SVG plus CSS already draw the line art.

## Migration strategy (what was done)

1. **Static export.** `next build` writes `out/`; `scripts/publish-out.mjs` copies it to `dist/`. Vercel's existing settings (root `skp-portfolio`, `npm install`, `npm run build`, output `dist`) are unchanged.
2. **Same URLs.** `/`, `/cv.pdf`, `/og.png`, `/favicon.svg`, every `/project-*.html`, and every in-page anchor (`#work`, `#approach`, `#hello`, `#work-fortiproxy`, …).
3. **Project pages unchanged for now.** They are served from `public/` as they were. Phase 2 can move them to routes.
4. **Content preserved.** Every fact from the remediated page moved verbatim into `lib/content.ts`.
5. **Nothing deleted.** The remediated static site is in `archive/static-2026-11/` and the older Vite app in `archive/vite-app/`. Neither is built or published.
6. **No-JS.** Every interactive component renders a complete static state on the server: the pipeline as a list, case notes in `<details>`, all project panels, the puzzle answer.

## Costs to be honest about

- **Shipped JS/CSS** went from about 8 KB gz to about 255 KB gz. Most of it is the React/Next runtime. Measured locally, LCP is still the headline text at 0.15–0.35 s, and CLS stays near 0, but field data on mid-range phones should be checked after deploy.
- **Possible saving.** Motion's `LazyMotion` could trim about 15–20 KB.
- **Build step.** There is now a real build and a dependency tree to keep updated.
