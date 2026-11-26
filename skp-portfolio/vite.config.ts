import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    // three.js and React Three Fiber are only imported by the lazily loaded scenes, so Rollup keeps them out of the first load
    chunkSizeWarningLimit: 900,
  },
  ssr: { noExternal: ['gsap', 'motion', 'lenis'] },
});
