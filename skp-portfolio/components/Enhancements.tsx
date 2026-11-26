'use client';
/*
 * Page-wide behaviour that works on server-rendered markup: one reveal pattern, the Ottawa clock and daylight bar,
 * the journey line, copy-to-clipboard, analytics events, and deep links (which also open tabs and rail cards).
 * Renders nothing. Every effect is an enhancement; the markup is complete without it.
 */
import { useEffect } from 'react';

const rad = Math.PI / 180, LAT = 45.4215, LON = -75.6972;
function sun(date: number) {
  const n = Math.floor(date / 864e5 + 2440587.5 - 2451545 + .0008) - LON / 360;
  const M = (357.5291 + .98560028 * n) % 360, C = 1.9148 * Math.sin(M * rad) + .02 * Math.sin(2 * M * rad) + .0003 * Math.sin(3 * M * rad);
  const L = (M + C + 180 + 102.9372) % 360, J = 2451545 + n + .0053 * Math.sin(M * rad) - .0069 * Math.sin(2 * L * rad);
  const dec = Math.asin(Math.sin(L * rad) * Math.sin(23.4397 * rad));
  const w = Math.acos((Math.sin(-.833 * rad) - Math.sin(LAT * rad) * Math.sin(dec)) / (Math.cos(LAT * rad) * Math.cos(dec))) / rad;
  const at = (j: number) => new Date((j - 2440587.5) * 864e5);
  return [at(J - w / 360), at(J + w / 360)];
}
const track = (name: string) => { const va = (window as unknown as { va?: (...a: unknown[]) => void }).va; if (typeof va === 'function') va('event', { name }); };

export default function Enhancements() {
  useEffect(() => {
    const doc = document.documentElement, motion = doc.classList.contains('motion');
    const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
    const cleanups: (() => void)[] = [];

    /* reveals: once per element, staggered within a parent */
    if (motion) {
      const groups = new Map<Element, number>();
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => { const p = el.parentElement!; const i = groups.get(p) ?? 0; el.style.setProperty('--i', String(i)); groups.set(p, i + 1); io.observe(el); });
      const onFocus = (e: FocusEvent) => (e.target as Element | null)?.closest?.('[data-reveal]')?.classList.add('is-in');
      document.addEventListener('focusin', onFocus);
      cleanups.push(() => { io.disconnect(); document.removeEventListener('focusin', onFocus); });
    }

    /* clock + daylight */
    const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hour12: false });
    const mins = (d: Date) => { const [h, m] = fmt.format(d).split(':').map(Number); return h * 60 + m; };
    const clocks = Array.from(document.querySelectorAll<HTMLElement>('[data-clock]'));
    document.querySelectorAll<HTMLElement>('[data-js-only]').forEach(el => { el.hidden = false; });
    const tick = () => {
      const now = new Date(); clocks.forEach(c => { c.textContent = fmt.format(now); });
      const rise = $('[data-rise]'), set = $('[data-set]'), day = $('[data-day]'), mark = $('[data-now]'); if (!rise || !set || !day || !mark) return;
      const [r, s] = sun(+now); rise.textContent = `Sunrise ${fmt.format(r)}`; set.textContent = `Sunset ${fmt.format(s)}`;
      day.style.left = `${mins(r) / 14.4}%`; day.style.width = `${(mins(s) - mins(r)) / 14.4}%`; mark.style.left = `${mins(now) / 14.4}%`;
    };
    tick(); const clock = setInterval(() => { if (!document.hidden) tick(); }, 15000); cleanups.push(() => clearInterval(clock));

    /* journey line fills as the timeline passes the middle of the screen */
    const tl = $('[data-timeline]');
    if (motion && tl) {
      let t = false; const fill = () => { t = false; const r = tl.getBoundingClientRect(); tl.style.setProperty('--fill', Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height)).toFixed(3)); };
      const s = () => { if (!t) { t = true; requestAnimationFrame(fill); } }; addEventListener('scroll', s, { passive: true }); fill();
      cleanups.push(() => removeEventListener('scroll', s));
    }

    /* copy email */
    const copy = $<HTMLButtonElement>('#copy-email'), fb = $('#copy-feedback');
    if (copy && fb) {
      copy.hidden = false;
      const onCopy = async () => {
        const email = copy.dataset.email!;
        try { await navigator.clipboard.writeText(email); fb.textContent = 'Email copied to your clipboard.'; track('contact-copy-success'); }
        catch { fb.textContent = `Copy didn't work here. The address is ${email}.`; }
        setTimeout(() => { fb.textContent = ''; }, 4000);
      };
      copy.addEventListener('click', onCopy); cleanups.push(() => copy.removeEventListener('click', onCopy));
    }

    /* analytics */
    const onTrack = (e: MouseEvent) => { const t = (e.target as Element | null)?.closest?.('[data-track]') as HTMLElement | null; if (t) track(t.dataset.track!); };
    document.addEventListener('click', onTrack); cleanups.push(() => document.removeEventListener('click', onTrack));
    const contact = $('#contact');
    if (contact) { const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { track('contact-section-view'); io.disconnect(); } }, { threshold: .4 }); io.observe(contact); cleanups.push(() => io.disconnect()); }

    /* deep links: tell tabs and the rail first, then scroll */
    const go = (id: string, smooth: boolean) => {
      if (!id) return; const el = document.getElementById(id); if (!el) return;
      dispatchEvent(new CustomEvent('portfolio:goto', { detail: id }));
      const target = el.closest('.case') ? document.getElementById('work')! : el;
      requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: (smooth && motion ? 'smooth' : 'instant') as ScrollBehavior }));
    };
    const onLink = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null; if (!a || e.defaultPrevented) return;
      const id = decodeURIComponent(a.getAttribute('href')!.slice(1)); if (!id || !document.getElementById(id)) return;
      e.preventDefault(); history.pushState(null, '', `${location.search}#${id}`); go(id, true);
    };
    const onHash = () => setTimeout(() => go(decodeURIComponent(location.hash.slice(1)), false), 60);
    document.addEventListener('click', onLink); addEventListener('hashchange', onHash);
    /* on load, land again once client-only layout (e.g. the pipeline's story mode) has settled */
    if (location.hash) { const id = decodeURIComponent(location.hash.slice(1)); setTimeout(() => go(id, false), 80); setTimeout(() => { if (Math.abs(document.getElementById(id)?.getBoundingClientRect().top ?? 0) > 140) go(id, false); }, 600); }
    cleanups.push(() => { document.removeEventListener('click', onLink); removeEventListener('hashchange', onHash); });

    return () => cleanups.forEach(f => f());
  }, []);
  return null;
}
