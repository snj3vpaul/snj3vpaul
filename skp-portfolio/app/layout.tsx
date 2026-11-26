import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { profile } from '@/lib/content';

const serif = localFont({
  src: [
    { path: '../public/fonts/instrument-serif-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/instrument-serif-latin-400-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-serif', display: 'swap', fallback: ['Georgia', 'serif'], adjustFontFallback: 'Times New Roman',
});
const sans = localFont({ src: '../public/fonts/hanken-grotesk-latin-wght-normal.woff2', weight: '300 800', variable: '--font-sans', display: 'swap', adjustFontFallback: 'Arial' });
const mono = localFont({ src: '../public/fonts/jetbrains-mono-latin-wght-normal.woff2', weight: '100 800', variable: '--font-mono', display: 'swap', adjustFontFallback: false, fallback: ['ui-monospace', 'Menlo', 'monospace'] });

const title = 'Sanjeev K Paul — Compliance Analyst, FIPS 140-3 & Common Criteria · Ottawa';
export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title,
  description: 'Sanjeev K Paul — Compliance Analyst at Fortinet, Ottawa. 4+ years delivering FIPS 140-3 cryptographic module validations and Common Criteria (NDcPP) certifications across engineering, QA and accredited labs.',
  alternates: { canonical: '/' },
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
  openGraph: {
    type: 'website', url: profile.url,
    title: 'Sanjeev K Paul — Compliance Analyst, FIPS 140-3 & Common Criteria',
    description: 'Cryptographic validation and security certification at Fortinet, Ottawa. Experience, selected work, and contact.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Sanjeev K Paul — I help security products prove what they claim.' }],
  },
  twitter: { card: 'summary_large_image' },
};
export const viewport: Viewport = { themeColor: '#0a1020', colorScheme: 'dark' };

/* Runs before paint: `js` when scripts run, `motion` when the visitor has not asked for less.
   Every page state is complete without either class. */
const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{if(matchMedia('(prefers-reduced-motion: no-preference)').matches&&'IntersectionObserver' in window)d.classList.add('motion')}catch(e){}})();`;

const person = {
  '@context': 'https://schema.org', '@type': 'Person', name: profile.name, jobTitle: 'Project Management Compliance Analyst',
  worksFor: { '@type': 'Organization', name: 'Fortinet' },
  address: { '@type': 'PostalAddress', addressLocality: 'Ottawa', addressRegion: 'ON', addressCountry: 'CA' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Concordia University' },
  knowsAbout: ['FIPS 140-3', 'CMVP', 'ACVP', 'Common Criteria', 'NDcPP', 'NIST SP 800-140B', 'TLS', 'SSH', 'X.509', 'KVM'],
  email: `mailto:${profile.email}`, url: profile.url, sameAs: [profile.links.linkedin, profile.links.github, profile.links.medium],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
        <script dangerouslySetInnerHTML={{ __html: 'window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};' }} />
        <script defer src="/_vercel/insights/script.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
