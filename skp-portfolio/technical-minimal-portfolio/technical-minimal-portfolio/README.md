# Technical & Minimalist design variant — Sanjeev Paul

This is an **alternative visual theme** for the `skp-portfolio` React/Vite website. It is intended for the site after the prior personal-story redesign and FortiProxy case-study updates. Existing text, achievements, case studies and personal photographs remain untouched.

## Apply (Windows PowerShell)

1. Extract the ZIP (which contains `technical-minimal-portfolio`).
2. Open PowerShell in `D:\VS_Code\snj3vpaul\skp-portfolio`.
3. Run:

```powershell
# Recommended: keep the warm version in its own Git commit/branch first.
git switch -c technical-minimal-design
python "D:\PATH\TO\technical-minimal-portfolio\apply.py" .
npm run lint
npm run build
npm run dev
```

Update `D:\PATH\TO` to the path where you extracted this folder. The script changes:

- `src/main.tsx`: adds `import "./styles/theme-technical.css";` after the existing stylesheet imports.
- `src/sections/Work.tsx`: eliminates a spurious `x`-based metric typography class, and styles certificate statuses according to their actual state (certified and submitted for review are different).
- `src/styles/theme-technical.css`: new complete technical/minimal style, with both light/dark variants and a responsive metrics fix.

The installer checks expected files, refuses duplicate installation, and saves original files under `.technical-theme-backup/`. No additional npm dependency is needed. It does not modify `src/data/portfolio.ts` or remove the older warm stylesheets. **Nothing is pushed to GitHub or deployed by this script.**

**To switch back:** Remove the `theme-technical.css` import from `src/main.tsx` (and optionally restore `Work.tsx` from the backup if you want the old metric badge behavior). Or use Git to revert the changes. You can keep the new `theme-technical.css` file for later comparison.

## Design concept preview

Open `preview.html` in a web browser. This is a *representative static mockup*, not a screenshot of the live React website. It includes a demo light/dark control, current validation statuses, and a condensed version of the personal story.

- `preview-dark.png` — captured desktop dark-mode mockup
- `preview-light.png` — captured desktop light-mode mockup

## Technical considerations

- Tested: Python installer syntax and installation logic against a minimal fixture; standalone visual preview rendered in headless Chromium.
- **Not tested:** Vite production build, lint or Playwright runs on your actual local repository (not available to the environment).
- The existing ThemeToggle should continue to work because the new stylesheet uses the same `data-theme` attribute and CSS variables.
- If a recently changed component uses new classes that aren't included in the current public source or previous patch, it may need an additional targeted selector.
- Test 360px, 768px, and 1440px widths locally, and check theme switching, metric values, status badges, mobile menu and keyboard navigation.

