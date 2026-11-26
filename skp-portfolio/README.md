# Sanjeev K Paul — portfolio

Static site served at https://snj3vpaul.vercel.app.

## Files
- `index.html`, `styles.css`, `script.js`: the home page.
- `project-*.html`: one page per project (share `styles.css`).
- `hero-scene.js`, `lab-chip.js`, `side-scenes.js`: prebuilt 3D scenes (three.js bundled in), each loaded only when its section needs it.
- `three-src/side-scenes.js`: source for `side-scenes.js`. Rebuild with
  `npx esbuild three-src/side-scenes.js --bundle --format=esm --minify --outfile=side-scenes.js` (needs `three` installed).
- `fonts/`, `img/`, `favicon.svg`, `og.png`, `cv.pdf`: assets.

## Build and preview
- `npm run build` copies exactly the files the pages reference into `dist/` (Vercel runs this). It fails if a referenced file is missing.
- `npm run dev` serves the folder locally; `npm run preview` serves `dist/`.

No runtime dependencies. No personal photos on the site.
