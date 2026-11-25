/* Home page. Dependency-free; everything reads without it (the year ruler and project
   index show every entry stacked when this file doesn't run). */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TZ = 'America/Toronto';

  /* ---- Sunrise and sunset for Ottawa, computed here (after the SunCalc formulas) ---- */
  function sunTimes(date, lat, lng) {
    const rad = Math.PI / 180, dayMs = 864e5, J1970 = 2440588, J2000 = 2451545, e = rad * 23.4397, J0 = 0.0009;
    const toDays = d => d.valueOf() / dayMs - 0.5 + J1970 - J2000;
    const fromJulian = j => new Date((j + 0.5 - J1970) * dayMs);
    const lw = rad * -lng, phi = rad * lat, d = toDays(date);
    const n = Math.round(d - J0 - lw / (2 * Math.PI));
    const ds = J0 + lw / (2 * Math.PI) + n;
    const M = rad * (357.5291 + 0.98560028 * ds);
    const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    const L = M + C + rad * 102.9372 + Math.PI;
    const dec = Math.asin(Math.sin(e) * Math.sin(L));
    const Jnoon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    const w = Math.acos((Math.sin(-0.833 * rad) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
    const Jset = J2000 + J0 + (w + lw) / (2 * Math.PI) + n + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    return { sunrise: fromJulian(Jnoon - (Jset - Jnoon)), sunset: fromJulian(Jset) };
  }

  function init() {
    /* ---- Top bar settles onto the ground once the page moves ---- */
    const bar = document.querySelector('.nav-bar');
    const onScroll = () => bar?.classList.toggle('is-solid', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---- Mobile menu ---- */
    const menuButton = document.querySelector('.menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const setMenu = open => {
      if (!menuButton || !mobileNav) return;
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      menuButton.classList.toggle('is-open', open);
      mobileNav.hidden = !open;
      bar?.classList.toggle('is-solid', open || window.scrollY > 24);
    };
    menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); } });
    document.addEventListener('click', e => { if (bar && !bar.contains(e.target)) setMenu(false); });

    /* ---- Current section in the bar ---- */
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.dataset.nav || '';
        navLinks.forEach(a => {
          if (a.getAttribute('href') === `#${id}`) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      }), { rootMargin: '-40% 0px -55% 0px' });
      document.querySelectorAll('.hero, [data-nav]').forEach(s => io.observe(s));
    }

    /* ---- Ottawa, today: local time, sunrise, sunset, and where the day stands ---- */
    const clock = document.getElementById('local-time');
    if (clock) {
      const hm = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false });
      const day = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short' });
      const rise = document.getElementById('sunrise'), set = document.getElementById('sunset');
      const fill = document.getElementById('daybar-fill'), date = document.getElementById('today-date');
      const tick = () => {
        const now = new Date();
        const { sunrise, sunset } = sunTimes(now, 45.4215, -75.6972);
        clock.textContent = hm.format(now);
        if (rise) rise.textContent = hm.format(sunrise);
        if (set) set.textContent = hm.format(sunset);
        if (date) date.textContent = day.format(now).replace(/\.$/, '');
        if (fill) fill.style.width = `${Math.min(100, Math.max(0, (now - sunrise) / (sunset - sunrise) * 100))}%`;
      };
      tick();
      setInterval(tick, 20000);
    }
    const year = document.getElementById('current-year');
    if (year) year.textContent = String(new Date().getFullYear());

    /* ---- Two records: one ruler of years ---- */
    const yearButtons = [...document.querySelectorAll('.ruler-years button:not(:disabled)')];
    const yearPanels = [...document.querySelectorAll('.year')];
    const chooseYear = (y, focus) => {
      yearButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.year === y)));
      yearPanels.forEach(p => p.classList.toggle('is-on', p.dataset.year === y));
      if (focus) yearButtons.find(b => b.dataset.year === y)?.focus();
    };
    yearButtons.forEach((b, i) => {
      b.addEventListener('click', () => chooseYear(b.dataset.year));
      b.addEventListener('keydown', e => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        let j = null;
        if (step) j = (i + step + yearButtons.length) % yearButtons.length;
        if (e.key === 'Home') j = 0;
        if (e.key === 'End') j = yearButtons.length - 1;
        if (j === null) return;
        e.preventDefault();
        chooseYear(yearButtons[j].dataset.year, true);
      });
    });
    // on a narrow screen the chosen year starts in view
    const pressed = yearButtons.find(b => b.getAttribute('aria-pressed') === 'true');
    const ruler = document.querySelector('.ruler');
    if (pressed && ruler && ruler.scrollWidth > ruler.clientWidth) ruler.scrollLeft = pressed.offsetLeft - ruler.clientWidth / 2;

    /* ---- Built: an index that chooses the piece on show ---- */
    const projButtons = [...document.querySelectorAll('.index-list button')];
    const details = [...document.querySelectorAll('.detail')];
    const chooseProject = (p, focus) => {
      projButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.p === p)));
      details.forEach(d => d.classList.toggle('is-on', d.dataset.p === p));
      if (focus) projButtons.find(b => b.dataset.p === p)?.focus();
    };
    projButtons.forEach((b, i) => {
      b.addEventListener('click', () => chooseProject(b.dataset.p));
      b.addEventListener('mouseenter', () => { if (window.matchMedia('(hover: hover)').matches) chooseProject(b.dataset.p); });
      b.addEventListener('keydown', e => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        chooseProject(projButtons[(i + step + projButtons.length) % projButtons.length].dataset.p, true);
      });
    });

    /* ---- Hello in several languages, with its UTF-8 bytes ---- */
    const helloWord = document.getElementById('hello-word');
    const helloOrigin = document.getElementById('hello-origin');
    const cipherCode = document.getElementById('cipher-code');
    const greetings = [['Hello', 'English'], ['Bonjour', 'French'], ['नमस्ते', 'Hindi'], ['ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'Punjabi'], ['নমস্কার', 'Bengali']];
    if (helloWord && helloOrigin && cipherCode && !reduceMotion) {
      const encoder = new TextEncoder();
      let i = 0;
      setInterval(() => {
        if (document.hidden) return;
        helloWord.classList.add('is-fading');
        setTimeout(() => {
          i = (i + 1) % greetings.length;
          const [word, language] = greetings[i];
          helloWord.textContent = word;
          helloOrigin.textContent = language;
          cipherCode.textContent = Array.from(encoder.encode(word), b => b.toString(16).padStart(2, '0')).join(' ');
          helloWord.classList.remove('is-fading');
        }, 300);
      }, 2800);
    }

    /* ---- Copy email ---- */
    document.getElementById('copy-email')?.addEventListener('click', async event => {
      const button = event.currentTarget;
      const email = button.dataset.email;
      const feedback = document.getElementById('copy-feedback');
      let copied = false;
      try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(email); copied = true; } } catch { /* fall through */ }
      if (!copied) {
        const area = document.createElement('textarea');
        area.value = email; area.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.appendChild(area); area.select();
        try { copied = !!document.execCommand?.('copy'); } catch { /* unavailable */ }
        area.remove();
      }
      if (feedback) feedback.textContent = copied ? 'Email address copied.' : 'Copy isn’t available here. Select the address above instead.';
      if (!copied) return;
      if (typeof window.va === 'function') window.va('event', { name: 'contact-copy-success' });
      button.textContent = 'Copied';
      clearTimeout(button.resetTimer);
      button.resetTimer = setTimeout(() => { button.textContent = 'Copy email'; if (feedback) feedback.textContent = ''; }, 2400);
    });

    /* ---- Outcome measurement (Vercel Web Analytics custom events) ---- */
    const contactSection = document.getElementById('contact');
    if (contactSection && 'IntersectionObserver' in window) {
      const seen = new IntersectionObserver(entries => {
        if (!entries.some(e => e.isIntersecting)) return;
        seen.disconnect();
        if (typeof window.va === 'function') window.va('event', { name: 'contact-section-view' });
      }, { threshold: .3 });
      seen.observe(contactSection);
    }
    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target.closest('[data-track]') : null;
      if (target && typeof window.va === 'function') window.va('event', { name: target.dataset.track });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
