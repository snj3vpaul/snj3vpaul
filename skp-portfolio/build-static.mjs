/**
 * Production static build for Vercel (`npm run build` -> dist/).
 *
 * Copies exactly the files the site uses, found by reading the page itself:
 * every local href/src in index.html, every url() in styles.css, and every
 * import('./...') in script.js, plus the files they in turn import.
 * If anything referenced is missing, the build fails instead of shipping a
 * page with broken fonts or a missing 3D scene. Files nobody references
 * (old portraits, experiments) are never published.
 */
import { copyFile, mkdir, readFile, rm, stat } from 'node:fs/promises';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, 'dist');
const always = ['index.html', 'favicon.svg', 'og.png', 'cv.pdf'];

const isLocal = ref => ref && !/^(?:[a-z]+:|\/\/|#|data:)/i.test(ref) && !ref.startsWith('/_vercel/');
const clean = ref => normalize(ref.split(/[?#]/)[0].replace(/^\.?\//, ''));

function refsIn(file, text) {
  const found = [];
  const add = r => { if (isLocal(r)) found.push(clean(r)); };
  if (file.endsWith('.html')) {
    text = text.replace(/<!--[\s\S]*?-->/g, ''); // commented-out markup is not published
    for (const m of text.matchAll(/\s(?:href|src)="([^"]+)"/g)) add(m[1]);
    for (const m of text.matchAll(/\ssrcset="([^"]+)"/g)) m[1].split(',').forEach(part => add(part.trim().split(/\s+/)[0]));
  }
  if (file.endsWith('.css')) for (const m of text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) add(m[1]);
  if (file.endsWith('.js')) for (const m of text.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) add(m[1]);
  return found;
}

const queue = [...always];
const seen = new Set();
const missing = [];
while (queue.length) {
  const rel = queue.shift();
  if (seen.has(rel)) continue;
  seen.add(rel);
  const src = join(root, rel);
  try { await stat(src); } catch { missing.push(rel); continue; }
  if (/\.(html|css|js)$/.test(rel)) queue.push(...refsIn(rel, await readFile(src, 'utf8')));
}

if (missing.length) {
  console.error(`Build failed. The page references files that do not exist:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}

await rm(output, { recursive: true, force: true });
for (const rel of [...seen].sort()) {
  await mkdir(dirname(join(output, rel)), { recursive: true });
  await copyFile(join(root, rel), join(output, rel));
  console.log(`Included ${rel}`);
}
console.log(`Static portfolio built successfully in dist/ (${seen.size} files)`);
