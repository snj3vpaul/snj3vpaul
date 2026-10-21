# Sanjeev's Portfolio — Approved Editorial Hybrid (October 2026)

**Goal:** Mix Concept A's reflective journal/typography with Concept B's earthy olive/rust character and compact case studies. Stacked `Sanjeev / Paul` name, split hero with portrait and one field note, 2-column expandable project cards, curated photo diary, writing cards, clear experience section, existing contact form, light/dark switch, reduced motion.

## Apply on Windows

1. Download `sanjeev-hybrid-implementation.zip` and extract it beside `skp-portfolio`.
2. In PowerShell:

```powershell
cd D:\VS_Code\snj3vpaul\skp-portfolio
git switch -c editorial-hybrid-v1
python ..\sanjeev-hybrid-implementation\apply.py .
npm run lint
npm run build
npm run dev
```

> If the folder was extracted elsewhere, use the appropriate absolute path to `apply.py`.

The patch replaces the React homepage and top navigation, adds `src/data/hybridContent.ts`, a CSS theme imported **last** in `main.tsx`, and three explicitly labeled **illustrative placeholders**. Previous versions of overwritten files are saved in `.hybrid-backup/<timestamp>`.

## What we preserve

- **No changes** to `src/data/portfolio.ts` case studies, role history, actual credential lists, publication URLs, validation statuses, or links. If your latest FortiClient/FortiProxy changes exist locally, they'll remain in the new project cards.
- Existing `src/sections/Contact.tsx` and its email/form behavior are reused.
- Existing dependencies, React/Vite entry point, and non-homepage components remain intact.
- The old warm/technical theme styles may stay imported; `theme-hybrid.css` is added afterward and overrides them for the new UI.

## Add your real photos

The currently supplied art for the diary is an *illustrative placeholder*, **not** a photograph of you.

1. Portrait: put your image at `public/portrait.webp` (the current portrait, if present, is reused).
2. For your diary, place images at e.g. `public/diary/cricket.webp`, `public/diary/travel.webp`, `public/diary/writing.webp`.
3. Open `src/data/hybridContent.ts` and update each item's `image` path; set `illustration: false`. Make sure to preserve existing object IDs. Adjust captions to suit your actual photos.
4. Prefer compressed WebP images with descriptive content (e.g. cricket outdoors), no EXIF location metadata if privacy matters.

## Resume

The installer checks for `public/cv.pdf` and enables the real résumé navigation link **only if the file exists**, avoiding a 404. If you add the file later, set `resumeEnabled: true` in `src/data/hybridContent.ts`.

## Content you should review

- The personal journey and reflective writing are editorial drafts based on your own description, not independently confirmed biographical details. Check your preferred wording.
- Your current public GitHub branch had an older FortiClient Crypto Module v1.0 `In Review` state when inspected. The new UI reads **your local** `caseStudies`; if you haven't applied your FIPS case-study status updates, do that before release.
- FortiProxy Firmware and FortiProxy-VM are separate **Submitted for Review** projects only if they already exist in your local data. The UI doesn't fabricate missing entries.
- For the older FortiClient 7.0.2 project, verify the certification link and status before publishing any equivalence to CMVP #5493.

## Troubleshooting / checks

Run `npm run lint`, `npm run build`, and `npm run dev` locally. Confirm:
- expanded project details and long labels don't split midword
- light/dark toggle persists on refresh
- mobile navigation (keyboard Escape closes it)
- `/cv.pdf` only shown when real file exists
- contact form sends via configured endpoint or opens an email draft when unset
- all certification statuses and links are accurate
- animations respect reduced-motion settings

**Deployment:** This package does not push to GitHub or deploy to Vercel. Commit only after reviewing locally.
