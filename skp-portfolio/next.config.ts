import type { NextConfig } from 'next';

/* Static export: the site stays a set of files, so Vercel's current project settings
   (install, `npm run build`, output `dist/`) keep working unchanged. */
const config: NextConfig = {
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};
export default config;
