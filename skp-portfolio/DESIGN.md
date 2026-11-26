# Design notes — the editorial edition

A refinement of v3, not a reinvention. Same stack (Vite, React 19, TypeScript, prerendered; GSAP; Lenis), minus Three.js, same voice, same proof points. The site should read like a well-made monograph: one idea per spread, set in good type, with room to breathe.

## 1. Editorial audit and cuts

### Removed
| Component / pattern | Where it was | Why it went |
|---|---|---|
| Standards ticker (`FIPS 140-3 ✳ CMVP ✳ …`) | Hero, bottom edge | Repeating marquee; constant motion. The four standards now sit once, in the hero's "Practice" line. |
| Interests ticker (`Cricket / Writing / …`) | Life | Repeating marquee. Interests are now one sentence under "Also". |
| "Hello, in a few languages" block and its hex cipher | Life | Novelty; it competed with the story. |
| Restoration card (dotted ring, download / speed / time, check) | Hero | Telemetry that competed with the statement. The résumé is a plain link. |
| Letter-by-letter "wave" headline | Contact | Each word was in the HTML twice (visible letters and a hidden copy), which text readers rendered as "Let’sLet’s makemake itit provable.provable." It is now one plain heading. |
| Custom cursor, magnetic buttons, cursor-following project preview, tilt cards | Global, Work, Side projects | Novelty motion. Hover states are now underlines and colour shifts. |
| Chapter jump pill (bottom left) | Global | Duplicated the navigation. |
| Golden WebGL light field (second canvas, animated shader) | Interlude | Gratuitous, always-moving WebGL. The words "Patience. Timing. Perspective." remain, set as a pull quote. |
| Stacking project panels with scrubbed scale/brightness | Projects | Aggressive scroll choreography. Replaced by case studies. |
| Count-up numbers, scrubbed timeline rail, outlined-to-filled credentials | Record, Journey | Motion that served the effect, not the reading. |
| 3D still life (Three.js, WebGL canvas) | Hero | Heavy to load and to look at. Replaced by a hairline line drawing of the same shapes with one bronze point. |
| Looping project videos | Projects | Constant motion and weight; replaced by their still posters. |
| Animated film grain, radial gradients, glass panels, heavy drop shadows, pill chips | Global | Decorative noise. Surfaces are flat paper and charcoal with hairline rules. |
| Motion (Framer Motion) dependency | — | No longer needed once the above went; GSAP covers the remaining reveals. |
| "I build things that make technology feel effortless." | Hero headline | Replaced by the original defining statement, as briefed. |

### Merged
| From | Into |
|---|---|
| Selected Work (3 modules) + On the record (4 metrics) + pipeline | **01 · Selected professional work**: four figures, then a ledger in which each module separates *My part* from *The module* (certificate, level, outcome, status). |
| Projects tabs (ForkCast, What-The-Fabric, Crypto Lab Chip) + Side projects (RSFC, Canterbury, The Journey) | **02 · Independent projects**: six case studies with the same structure: Context, Problem, My contribution, Implementation, Outcome, Status, Built with, Links. |
| The approach + Along the way + Credentials | **03 · Approach & journey**: three principles, a four-row timeline, three credentials. |
| Life + What the game gives back + On the field + What carries over + Field notes | **04 · Beyond work**: cricket highlights, a compact scorebook (the last five seasons, expandable to all), a pull quote, what carries over, writing, and one line of other interests. |
| Contact + footer links | **05 · Contact**, then a one-line colophon. |

Navigation: 11 links plus a jump list → **Work · Projects · Approach · Beyond work · Contact · Résumé**. Below 1100px it becomes a full-screen "Index".

Every old in-page link still lands: `#impact`, `#professional-work` → Work; `#personal-projects` → Projects; `#sports` → RSFC; `#practice` → Approach; `#experience` → Journey; `#life`, `#about`, `#outside`, `#hello` → Beyond; `#field` → Cricket; `#forkcast`, `#fabric`, `#lab`, `#canterbury-cricket-club`, `#writing`, `#contact` and the three `#work-…` ids are unchanged.

### Copy to confirm
Case-study fields marked `// CHECK` in `src/content.ts` were reworded from shorter notes (for example, What-The-Fabric's stack, and the "Problem" lines for RSFC, Canterbury and The Journey). No metric was invented; every number comes from the previous site or its project pages.

## 2. Design system tokens

All tokens live at the top of `src/styles/app.css`.

### Colour
| Token | Value | Use | Contrast |
|---|---|---|---|
| `--paper` | `#f5f2ec` | page | — |
| `--paper-2` | `#ece7de` | case-study plates | — |
| `--char` | `#1b1a18` | dark chapters (Approach, Contact) | — |
| `--ink` | `#191816` | text | 16.9:1 on paper |
| `--ink-2` | `#45413b` | secondary text | 9.6:1 |
| `--ink-3` | `#6b655c` | labels, metadata | 5.4:1 on paper, 4.8:1 on paper-2 |
| `--accent` | `#8b5e2e` (dark chapters `#c9a06a`) | the one accent: italic emphasis in headings, status marks, focus rings, progress hairline | 5.0:1 on paper |
| `--rule` / `--rule-strong` | ink at 12% / 32% | hairlines | — |

Dark chapters reuse the same token names, re-pointed, so components need no dark variants.

### Typography
| Role | Face | Size (fluid) | Line height | Tracking |
|---|---|---|---|---|
| Hero statement | Instrument Serif | `clamp(2.9rem, 6.4vw, 7.25rem)` | .98 | −.03em |
| Chapter display | Instrument Serif | `clamp(2.6rem, 5.4vw, 5.75rem)` | 1 | −.025em |
| Closing ("Let’s make it provable.") | Instrument Serif | `clamp(3.2rem, 9vw, 10rem)` | .92 | −.035em |
| Figures | Instrument Serif | `clamp(3.5rem, 6.5vw, 6.5rem)` | .9 | −.03em |
| H3 (modules, principles) | Instrument Serif | `clamp(1.75rem, 2.5vw, 2.5rem)` | 1.05 | −.015em |
| Lede | Hanken Grotesk 400 | `clamp(1.125rem, 1.35vw, 1.3rem)` | 1.55 | 0 |
| Body | Hanken Grotesk 400 | 17px | 1.65 | 0 |
| Small | Hanken Grotesk 500–600 | 14px | 1.5 | .01em |
| Label | Hanken Grotesk 600, uppercase | 11.5px | 1.4 | .14em |

Emphasis is always the serif italic in the accent colour, used once per heading at most. The monospace face is no longer loaded.

### Spacing rhythm
8px base: `--s-1` 8 · `--s-2` 16 · `--s-3` 24 · `--s-4` 40 · `--s-5` 64 · `--s-6` 104 · `--s-7` 160. Chapters open with `--chapter: clamp(104px, 12vw, 176px)` of space (88px on phones). Case studies are separated by `--s-7`.

### Grid
- 12 columns, `--max` 1360px, outer margin `clamp(20px, 5vw, 80px)`, gutter `clamp(16px, 2vw, 32px)`.
- Chapter head: label across the full width over a strong rule; display heading in columns 1–7; lede in 9–12.
- **Desktop (≥1100):** asymmetric spreads. The work ledger runs number · title (2–5) · two data columns (7–12). Case studies alternate plate (1–5 or 8–12) and text (7–12 or 1–6), with a sticky plate.
- **Tablet (700–1099):** its own composition. The hero art sits as a band above the statement; the ledger collapses to two columns; case studies run 5 columns of plate to 7 of text; Beyond's side column becomes a two-up row.
- **Phone (<700):** a single generous column; plates become 4:3 lead images; facts and timelines stack; buttons go full width.

### Motion
| Token | Value |
|---|---|
| `--ease-out` | `cubic-bezier(.16, 1, .3, 1)`: weighted settle, no overshoot |
| `--ease-in-out` | `cubic-bezier(.65, 0, .35, 1)`: menu wipe |
| `--dur-quick` / `--dur-base` / `--dur-slow` | .25s / .6s / 1.2s |

Rules: headings rise line by line out of their own mask once (1.4s, expo-out); blocks fade up 16px once (1.2s); case-study plates drift ±24px against the scroll on desktop only; links underline-sweep on hover. Nothing loops. The hero still life is a hairline SVG drawing that draws itself in once. Lenis gives scrolling a gentle weight. Under `prefers-reduced-motion` there is no Lenis, no reveals, no plate drift, and the hero drawing is simply there.

## 3. Sections → code
| Chapter | Component | File |
|---|---|---|
| Hero | `Hero`, `LineStill` | `src/sections/Hero.tsx` |
| 01 Selected professional work | `Work` | `src/sections/Chapters.tsx` |
| 02 Independent projects | `Projects`, `CaseStudy` | `src/sections/Chapters.tsx` |
| 03 Approach & journey | `Approach` | `src/sections/Chapters.tsx` |
| 04 Beyond work | `Beyond` | `src/sections/Chapters.tsx` |
| 05 Contact + colophon | `Contact`, `Footer` | `src/sections/Chapters.tsx` |
| Navigation, intro, progress, anchors | `Header`, `Intro`, `Progress`, `useAnchors` | `src/components/Chrome.tsx` |
| Copy | — | `src/content.ts` |

## 4. Verification (production build, headless Chrome)
- axe-core: zero violations at 1440, 834 and 390px, with reduced motion, and with more contrast.
- No horizontal overflow at any width; every reveal resolves; every Tab stop is visible.
- Text extraction (with and without JavaScript) has no doubled words; the prerendered page carries 1,466 words.
- Every new and legacy anchor lands under the masthead, including on a first visit while the intro plays.
- Index menu opens, focuses its first link, closes on Escape and returns focus; the scorebook expands from 5 to 11 rows; copy-email writes the address to the clipboard.
- JavaScript: about 136 KB gzipped in total (was 200 first-load plus a 250 KB 3D chunk). Three.js and React Three Fiber are no longer dependencies.
