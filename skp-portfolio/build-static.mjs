/** Production static build: unchanged deployment behavior. */
import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, 'dist');
const staticFiles = ['index.html', 'styles.css', 'script.js', 'favicon.svg'];
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of staticFiles) {
  await copyFile(join(root, name), join(output, name));
  console.log(`Included ${name}`);
}
console.log('Static portfolio built successfully in dist/');
