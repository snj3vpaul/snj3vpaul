import { useEffect, useId, useState } from 'react';
import { profile } from '../../data/portfolio';
import { hybridContent } from '../../data/hybridContent';

type Theme = 'light' | 'dark';
const THEME_KEY = 'skp-theme';
const links = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#story', label: 'My story' },
  { href: '#life', label: 'Life outside work' },
  { href: '#writing', label: 'Writing' },
];

function initialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch { /* localStorage may be restricted */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function Navbar() {
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try { window.localStorage.setItem(THEME_KEY, theme); } catch { /* optional */ }
  }, [theme]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [menuOpen]);

  return (
    <header className="hyb-nav">
      <div className="hyb-container hyb-nav-upper">
        <span>{hybridContent.edition}</span><span>{hybridContent.location}</span>
      </div>
      <div className="hyb-container hyb-nav-main">
        <a className="hyb-brand" href="#home" aria-label={`${profile.name} — home`}>sanjeev<span>.</span></a>
        <nav id={menuId} className={`hyb-nav-links${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {links.map(link => <a href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact ↗</a>
          {hybridContent.resumeEnabled && <a href={profile.links.cv} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Résumé ↗</a>}
        </nav>
        <div className="hyb-nav-actions">
          <button className="hyb-theme" type="button" onClick={() => setTheme(value => value === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>
          <button className="hyb-menu" type="button" aria-controls={menuId} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(v => !v)}>{menuOpen ? 'Close' : 'Menu'} <span aria-hidden="true">{menuOpen ? '×' : '+'}</span></button>
        </div>
      </div>
    </header>
  );
}
