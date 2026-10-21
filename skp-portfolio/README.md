# Sanjeev Kumar Paul — Portfolio

Personal portfolio built with React, TypeScript, and Vite. The active design is the **Editorial Hybrid** theme, now with selected inspiration from Rupinder Kaur’s portfolio (grouped expertise, project discovery controls, and interactive personal interests). It does not copy Rupinder’s visual design or code.

## Run locally

```powershell
npm ci
npm run dev
```

## Validate and build

```powershell
npm run lint
npm run build
npm run preview
```

## Content and design

- `src/data/portfolio.ts`: professional project case studies, experience, education, certifications, links and publications.
- `src/data/hybridContent.ts`: personal introduction, journey, diary and contact copy.
- `src/pages/LandingPage.tsx`: active homepage sections, including filtered case-study cards, a skills/toolbox section, a photo-diary dialog, and a small expandable cooking note.
- `src/sections/ClosingNote.tsx`: closing note and expandable contact form.
- `src/sections/Contact.tsx`: contact form and optional endpoint fallback.
- `src/styles/theme-hybrid.css`: light and dark editorial styling.
- `src/styles/base.css`: shared reset, reveal effect and contact form styling.
- `public/portrait.webp` and `public/hybrid/`: visual assets used by the active site.
- `public/cv.pdf`: résumé linked from the navigation.

The diary in `hybridContent.ts` uses illustrative SVG placeholders. Replace their paths with your own photographs when ready.

## Contact configuration

The form optionally supports `VITE_CONTACT_ENDPOINT` as a local `.env.local` variable or a Vercel environment variable. If unset, it falls back to the visitor's email client. **Do not commit `.env.local`.**

## Deployment

The Vercel root directory should be `skp-portfolio` if the repo root contains this folder. Use the standard Vite build command `npm run build` and output directory `dist`.

`node_modules/` and `dist/` are intentionally not included in source archives; run `npm ci` to restore dependencies and `npm run build` to regenerate output.

## October 2026 inspiration update

- Work filters: **All work**, **Security & validation**, and **Independent builds**; values and validation stages still come from `src/data/portfolio.ts`.
- Practical toolbox: three concise, content-managed groups (security assurance, technical delivery, and independent building) in `src/data/hybridContent.ts`. No invented proficiency scores or achievement metrics.
- Diary: tap an image to open a keyboard-accessible native dialog (Escape to close). Current artwork is explicitly labeled *illustrative*; replace with your real photographs using the `image` and `illustration` values in `hybridContent.ts`.
- Kitchen note: short, expandable personal detail about marinade experiments without inventing recipes.
- Preserve all existing case-study statuses, external references, contact behavior, and themes.

The inspiration comes from the discoverable skills categories and interactive personal-interest presentation at https://rupinder-kaur-pi.vercel.app/. All implementation code and wording here are original to this site.
