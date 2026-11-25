/* Home page interactions. Small and dependency-free; the page reads fully without JS. */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    /* ---- Mobile menu ---- */
    const menuButton = document.querySelector('.menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const bar = document.querySelector('.bar');
    const setMenu = open => {
      if (!menuButton || !mobileNav) return;
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      menuButton.classList.toggle('is-open', open);
      mobileNav.hidden = !open;
    };
    menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); } });
    document.addEventListener('click', e => { if (bar && !bar.contains(e.target)) setMenu(false); });
    window.matchMedia('(min-width: 901px)').addEventListener?.('change', e => { if (e.matches) setMenu(false); });

    /* ---- Current section in the top bar ---- */
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    const sections = document.querySelectorAll('[data-nav]');
    if ('IntersectionObserver' in window && sections.length) {
      const io = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.dataset.nav;
        navLinks.forEach(a => {
          const on = a.getAttribute('href') === `#${id}`;
          a.classList.toggle('is-current', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      }), { rootMargin: '-40% 0px -55% 0px' });
      sections.forEach(s => io.observe(s));
    }

    /* ---- Arrival: sections fade up once as they come into view ---- */
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const targets = document.querySelectorAll('.section .head, .stats, .work-list, .pipeline, .build, .also, .principles, .journey, .entries, .life-grid, .field-head, .scorebook, .carry, .contact > *');
      const seen = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        seen.unobserve(e.target);
      }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
      targets.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * .92) return; // already on screen: leave it be
        el.classList.add('reveal');
        seen.observe(el);
      });
    }

    /* ---- Ottawa local time, and the year ---- */
    const timeNode = document.getElementById('local-time');
    if (timeNode) {
      const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hour12: false });
      const tick = () => { timeNode.textContent = fmt.format(new Date()); };
      tick();
      timeNode.parentElement.hidden = false;
      setInterval(tick, 20000);
    }
    const year = document.getElementById('current-year');
    if (year) year.textContent = String(new Date().getFullYear());

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
      if (feedback) {
        feedback.textContent = copied ? 'Email address copied.' : 'Copy unavailable — select the address above.';
        feedback.classList.toggle('sr-only', copied); // on success the button itself says "Copied"
      }
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
