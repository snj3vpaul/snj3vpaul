# Portfolio audit and redesign — November 2026

Site: https://snj3vpaul.vercel.app · Repo: snj3vpaul/snj3vpaul (`skp-portfolio/`)
Branch for this work: `redesign/editorial-record` (not merged; awaiting approval)

## What was inspected, and how

- **Inspected:** the production commit (`b98a4a5`, confirmed as the READY Vercel production deployment), rendered locally in headless Chrome at 1440×900, 820×1180 and 390×844. That covers all ten sections and the six project pages. I also ran axe-core, an automated accessibility checker, on the desktop render, and checked the heading outline, the fonts actually used, visible placeholder text and the size of the built output. I read the full source: `index.html`, `styles.css`, `script.js`, the 3D modules and the build script.
- **Not done:**
  - No Lighthouse or real-network performance run against Vercel. Weight figures below are file sizes, not measured load times.
  - No testing on physical devices.
  - No screen-reader walkthrough. Accessibility findings come from the automated check plus manual review.

## Phase 2 — the audit

### Summary scores

| Dimension | Score | One line |
|---|---|---|
| Visual identity | 4/10 | The hero has an idea; everything below it is a collage of 2024–25 portfolio trends. |
| UI / UX | 3/10 | Two scroll-jacked sections create thousands of pixels of empty screen; ten sections, 16,600px tall. |
| AI slop | 3/10 | Hobby marquee, outlined giant years, aphorism cards, pun headers, halftone 3D objects. |
| Typography | 4/10 | Six families render; long paragraphs set in monospace; condensed all-caps everywhere. |
| Content | 6/10 | Real specifics exist (CMVP #5493, levels, roles), but they're repeated four times and diluted by filler and placeholders. |
| Professional credibility | 6/10 | Careful attribution is a real strength; the case studies are too thin to prove method; Common Criteria is claimed but never shown. |
| Memorability | 4/10 | A visitor remembers cricket stats and a spinning halftone chip, not the expertise. |
| Mobile | 3/10 | Shrinks the desktop; the pinned deck leaves about a screen of blank space; graph labels render at ~8px. |
| Technical quality | 4/10 | Three.js shipped twice (~1.08 MB of JS for decoration); dead scaffolding; contrast failures; duplicated headings. |

### Findings

Each finding gives the problem → why it matters → impact on the visitor → fix, with severity.

**Critical**
1. **Scroll-jacked "Selected Work" deck and pinned "Approach" panel.** Both sections take control of scrolling, which hides content behind scroll position. The desktop render has roughly 1,800px of empty stone around three thumbnails, and the Approach panel leaves about 1,500px blank. *Impact:* the most important content on the site (the Fortinet work) reads as broken or slow. Recruiters scroll past before the cards gather. *Fix:* remove both. Present work as readable case studies in normal document flow.
2. **The decorative 3D ships about 1 MB of JavaScript, twice.** `side-scenes.js` (543 KB) and `lab-chip.js` (540 KB) each bundle their own copy of Three.js to draw halftone objects (a flowchart, cloth, a chip) that explain nothing. *Impact:* heavy on mobile data and battery for zero information. It also signals "developer showing off", the opposite of the assurance positioning. *Fix:* delete them. Where a project needs a picture, use a small static SVG that shows what the tool does.

**High**

3. **Six type families render** (JetBrains Mono, DM Sans, Instrument Serif, Big Shoulders Display, Unbounded, plus Arial as a fallback). Body copy is set in monospace. *Impact:* no typographic voice; long mono paragraphs tire the eye; condensed all-caps headings read as a sports poster, not a professional record. *Fix:* three roles only: serif for voice, sans for reading, mono only for metadata and annotations.
4. **The same two achievements appear in four places** (hero, work cards, the "On the record" stats, the module status track). *Impact:* repetition reads as padding, and a reader suspects there isn't more. *Fix:* say each fact once, where it carries the most weight: the hero ledger for the headline facts, case studies for the detail. Delete the stats band.
5. **Placeholders and internal notes are in the shipped HTML:** "In progress — case study coming", a commented-out `ARTICLE-LINK` entry, a camera roll with "Caption one…four", an `END PHOTO STRIP` marker. *Impact:* anyone who views source, or a crawler, sees an unfinished site, and a promise of a case study that doesn't exist undermines trust. *Fix:* remove them all; say "ongoing" plainly.
6. **The case studies are cards, not cases.** Each work item is a single sentence plus a status. *Impact:* the reader learns *that* you were involved but not *how* you work, which is the thing a hiring manager is buying. *Fix:* for each one, show what the module is, what your part was, what was produced, and where it stands, using only facts already on the site.
7. **Common Criteria is claimed but never evidenced.** The meta description and stats say FIPS 140-3 *and* Common Criteria (NDcPP), but no project shows CC work. *Impact:* a specialist will notice the gap. *Fix:* add a CC entry when you can supply facts (see "Information I need from you"). Until then, mention it only in the timeline and credentials context.

**Medium**

8. **The section headlines are puns and aphorisms** ("Things I've built.", "Thinking out loud.", "Not quite a straight line.", "A different kind of field.", "Patience. Timing. Perspective."). *Impact:* a template voice. Each is fine alone; together they sound generated. *Fix:* plain, specific section titles; let the content carry the personality.
9. **Hobby marquee, outlined giant years, "Keep scrolling →".** These are trend artefacts with no information. *Impact:* noise, and the AI-builder look you want to avoid. *Fix:* remove.
10. **The scorebook carousel duplicates its slides three times in the DOM.** Every scorebook H3 appears three times in the heading outline (verified). *Impact:* screen-reader users hear each achievement three times, and the carousel hides most entries behind motion. *Fix:* a plain ledger table.
11. **Contrast failures** on the project tab labels (axe: `color-contrast`, serious). *Fix:* token-based colours checked at ≥ 4.5:1.
12. **The nav labels don't map to sections** (ten sections, five links). *Fix:* collapse the page to the five things the nav names.

**Low**

13. **Repo hygiene.** `src/` (an unused React/Vite app), `tailwind.config.js`, `components.json`, `apply.py`, and `check.py`/`check_mobile.py` with `/mnt/data` paths, plus `hero-scene.js` and unused images. None of it ships, but it makes the project harder to maintain. *Fix:* delete in a follow-up once you confirm nothing there is needed.
14. **Footer "Ottawa local time" is hidden** but the script still runs. *Fix:* remove.

### What is already good, and survives

- **The attribution discipline:** "Certificates are issued to modules, not people. Each project says what my part was." This is the most credible sentence on the site.
- **The hero line and the translation sentence.**
- **The three principles** (scope, questions, evidence). They're specific and true to the work.
- **Real, verifiable specifics:** CMVP #5493 with its NIST link, Security Level 1, validated 17 Aug 2026, the two FortiProxy modules in review.
- **The hero trace figure.** It's the one visual that explains the job.

## Phase 3 — professional identity

**Intended positioning:** "Making complex cybersecurity assurance understandable, credible, and human."

**Verdict:** right intent, wrong sentence to publish. Three stacked adjectives is exactly the cadence of consultancy copy, and "human" is claimed rather than shown. The site already has a better, concrete version of the same idea: *"I turn security standards into questions engineers can answer, and their answers into evidence a lab can certify."* Keep the positioning as an internal brief that every section is tested against, not as a tagline. I've used it only in the page description, phrased plainly.

**How each section now shows the positioning, rather than saying it:**
- **Understandable:** a short plain-English explanation of what a cryptographic validation is, written for a non-specialist, placed straight after the hero.
- **Credible:** case studies that state *your part* separately from the outcome, with public records linked.
- **Human:** cricket and side projects presented as real records (a scorebook, live links), not as personality adjectives.

**What the site must avoid:** hacker or terminal aesthetics, glowing "cyber" blues, a stats band, and buzzwords like "passionate", "driven" or "end-to-end".

## Phase 4 — three directions

### A. Technical editorial: "The Record"

- **Identity:** an independent journal or annual report. Numbered sections, figures with captions, footnotes for caveats, a strict grid and lots of paper.
- **Type and colour:** Instrument Serif for voice and numerals, DM Sans for reading, JetBrains Mono for metadata and figure labels. Warm paper, graphite ink, one "validation blue" reserved for things that are proven or actionable.
- **Layout and navigation:** a 12-column grid with section numbers in the margin. Five sections that map 1:1 to the nav. Rows divided by hairlines; no cards.
- **Motion:** almost none. One draw-in for the hero figure, text that settles into place once, and interaction only where it explains (tracing a chain, decoding a greeting).
- **Strengths:** reads as care and rigour, which is the actual job; fast; accessible; ages well.
- **Weaknesses:** can feel quiet. It depends on excellent typography and a few memorable moments to avoid looking like a nice blog.
- **Fit:** strongest. Assurance work *is* documentation done well; the site should be the best document a reader sees this week.

### B. Immersive technical storytelling: "The Lifecycle"

- **Identity:** a cinematic scroll story following one module from source code to certificate. Pinned scenes, a camera through a 3D "boundary", narrative text.
- **Type and colour:** dark stage, light type, motion-led.
- **Technology:** GSAP ScrollTrigger plus React Three Fiber.
- **Strengths:** high wow factor; can teach the process vividly.
- **Weaknesses:** it's exactly the scroll-jacking that is failing today, but bigger. Heavy, hard to make accessible, slow to reach the facts, and costly to maintain. It also makes the *effects* memorable instead of the person.
- **Fit:** poor. It undermines credibility with the engineering and assurance readers who matter most.

### C. Experimental: "Ciphertext"

- **Identity:** the site begins as ciphertext and decrypts as you read; navigation is a substitution grid, with oversized type and unconventional layouts.
- **Strengths:** very memorable; ties to cryptography.
- **Weaknesses:** it delays reading on purpose, which is hostile to recruiters skimming. It leans toward the "hacker" stereotype you want to avoid, and the gimmick wears off after one visit.
- **Fit:** as a whole, no. As one contained moment, yes.

### Recommendation: A, with one moment borrowed from C

Build "The Record" (A), and use C's idea exactly once: a greeting that decodes from its encrypted form into one of five languages (English, French, Hindi, Punjabi, Bengali). It's personal (languages), professional (encryption) and harmless to reading because it lives in "Beyond work".

## Phase 5 — technology

**Current stack:** static HTML, CSS and vanilla JavaScript, copied into `dist/` by a small Node script, hosted on Vercel. There's an unused React/Vite scaffold, and Three.js is used for decoration.

| Option | What it would enable | Cost | Verdict |
|---|---|---|---|
| Next.js / React | Components, routing, MDX case studies | Build tooling, hydration JS, migration time | **Not now.** One page plus six short detail pages with no data layer. Static HTML is faster and simpler. Revisit if case studies grow into long MDX writing. |
| Motion for React | Declarative transitions | Requires React | Not needed without React. |
| GSAP + ScrollTrigger | Complex timelines, pinning | ~70 KB, encourages scroll-jacking | **Rejected.** Pinning is the current failure. |
| Three.js / R3F | 3D scenes | ~540 KB per bundle | **Removed.** It conveys no information here. |
| WebGL shaders | Texture and atmosphere | GPU cost, accessibility | Rejected: decoration. |
| Rive / Lottie | Authored vector animation | Runtime plus authoring tools | Not justified; SVG does the job. |
| **Inline SVG + CSS + ~150 lines of JS** | The trace figure, the decode, reveals | Near-zero | **Chosen.** Ambition is in precision, not libraries. |

**Result:** JavaScript drops from about 1.1 MB to about 15 KB, and fonts from five families to three.

## Phase 6 — content and structure

**New order (nav labels match the section titles):**

1. **Hero:** who, what, the trace figure, two proof points.
2. **What validation is:** a plain-English explainer, plus a four-layer figure (cryptography → implementation → validation → certification) showing where my work sits. It's captioned as one common path, not a universal requirement, with a note on how Common Criteria differs.
3. **Work:** three case studies (module, my part, what was produced, status, public record), ending with the attribution footnote.
4. **Projects:** an index of things built on my own time: ForkCast, What-The-Fabric, Crypto Lab Chip, RSFC League, The Journey.
5. **About:** the journey paragraph, three working principles, a concise timeline, credentials, writing.
6. **Beyond work:** Canterbury Cricket Club, the scorebook as a ledger, "what carries over" (kept: it's yours and specific), and the decoding greeting.
7. **Contact:** one line, the email with a copy button, links, résumé.

**Removed:** the stats band, the module status track (folded into the case studies), the hobby marquee, the aphorism card, the camera-roll placeholder, outlined years, both 3D scenes, the scroll-jacked deck and pinned panel, the local-time footer and all placeholder comments.

### Information I need from you (not invented; flagged)

- **FortiClient 7.0.2:** the CMVP certificate number, validation date and security level. The Crypto Module has #5493; 7.0.2 has no public record link on the site.
- **Common Criteria:** which product(s), which protection profile (e.g. NDcPP), the scheme, your part, and the status. Without this, CC appears only as a credential area.
- **Writing:** specific Medium articles worth listing (titles, dates, links). Currently only the profile link and the 2022 SoK paper.
- **The Journey:** a live link, if there is one.
- **Crypto Lab Chip:** whether you want it public at all, since it's a private tool with no demo.

## Phase 7 — design system

**Colour**
- `--paper #F3F0E9`: page ground
- `--paper-2 #EAE6DC`: figure and table ground, used sparingly
- `--ink #1B1A18`: text and primary actions
- `--graphite #4C4841`: secondary text (≥ 7:1 on paper)
- `--muted #6A645A`: metadata (≥ 4.5:1)
- `--rule rgba(27,26,24,.16)`: hairlines
- `--proof #1F44B0`: validation blue, only for validated or proven marks, focus rings and link hover
- `--review`: a hollow mark, no colour (in review)
- **Rule:** blue never decorates. If it's blue, it's proven or actionable.

**Type**
- **Display:** Instrument Serif 400 (headlines, section titles, large numerals).
- **Text:** DM Sans 400/500 (body, UI).
- **Annotation:** JetBrains Mono 500, 11–12px, uppercase with letter-spacing, only for section numbers, metadata, figure labels and table headers.
- **Scale (px):** 12 · 14 · 16 · 18 · 22 · 28 · 40 · 56 · 80 · 112 (the hero uses a fluid clamp up to 112).
- **Body:** 17px / 1.6, measure 62–68ch.

**Spacing:** a 4px base: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144. Section padding 96–144px on desktop and 64px on mobile.

**Grid:** 12 columns, max 1240px, 24px gutters, 24px outer margin (18px on mobile). Breakpoints at 640, 960 and 1200. The section number sits in columns 1–2, content in 3–12; below 960 it collapses to a single column with the number above the content.

**Navigation:** a fixed 56px bar. Name on the left, five links on the right, Résumé separated by a hairline. The current section is underlined in ink. Below 960 it becomes a menu button opening a full-width list, with Escape and outside-click to close and focus returned to the button.

**Buttons and links**
- **One solid button style:** ink background, square corners, 48px tall.
- **Links:** text with a 1px underline offset 4px. Hover turns them blue and moves the arrow 3px.
- **Focus:** a 2px blue outline, offset 3px.
- **Never** pills.

**Containers:** none as cards. Content sits in rows separated by hairlines; tables are real `<table>` elements.

**Images and diagrams:** inline SVG only, 1px graphite strokes, square nodes, mono labels, and every figure captioned ("Fig. n — …"). No photography of people; no stock.

**Motion**
- **Purpose-only:** (1) the hero headline rises and the trace draws in once; (2) sections fade up 12px once on first view; (3) the trace responds to pointer, touch and keyboard; (4) the greeting decodes once on view, then on request.
- **Nothing loops.**
- **Easing:** `cubic-bezier(.2,.75,.2,1)`, 300–900ms.
- **Reduced motion:** everything renders in its final state and the decode shows the plain greeting immediately.

**Accessibility**
- Semantic landmarks, one H1, an ordered heading outline and a skip link.
- Every interactive figure has a text equivalent.
- Graph nodes are reachable by keyboard and traceable with Enter or Space.
- Contrast ≥ 4.5:1 for all text.
- Content stays visible without JavaScript; animations are enabled only when a `js` class is present.
