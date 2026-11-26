/* Next's static export lands in out/; Vercel's project serves dist/. Copy, then check nothing is missing. */
import { cp, rm, stat } from 'node:fs/promises';
const must = ['index.html', 'cv.pdf', 'og.png', 'favicon.svg', 'project-forticlient-crypto-module.html', 'styles.css'];
await rm('dist', { recursive: true, force: true });
await cp('out', 'dist', { recursive: true });
for (const f of must) await stat(`dist/${f}`).catch(() => { console.error(`Missing from build: ${f}`); process.exit(1); });
console.log('Static export copied to dist/');
