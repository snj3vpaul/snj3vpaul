/**
 * Static prerender: renders the React app to HTML at build time and writes it into dist/index.html,
 * so the page is complete for search engines, link previews and visitors without JavaScript.
 * The client then hydrates the same markup. The 3D scene is client-only and loads after first paint.
 */
import { readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { render } = await import(pathToFileURL(join(root, 'dist-ssr/entry-server.js')).href);
const file = join(root, 'dist/index.html');
const html = await readFile(file, 'utf8');
if (!html.includes('<!--app-html-->')) throw new Error('dist/index.html has no <!--app-html--> placeholder');
await writeFile(file, html.replace('<!--app-html-->', render()));
await rm(join(root, 'dist-ssr'), { recursive: true, force: true });
console.log('Prerendered dist/index.html');
