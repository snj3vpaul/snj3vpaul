/* Small, dependency-free interactions. The page reads completely without them. */
(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const track = name => { if (typeof window.va === 'function') window.va('event', { name }); };

  /* ---- Mobile menu: opens below the bar, closes on Escape, outside click or choice ---- */
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const setMenu = open => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !open;
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    setMenu(open);
    if (open) mobileNav.querySelector('a')?.focus();
  });
  mobileNav?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); }
  });
  document.addEventListener('click', e => { if (!e.target.closest('.topbar')) setMenu(false); });

  /* ---- The bar gains its hairline once the page has moved ---- */
  const bar = document.querySelector('.topbar');
  if (bar) {
    const setBar = () => bar.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', setBar, { passive: true });
    setBar();
  }

  /* ---- Current section underlined in the bar ---- */
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window && navLinks.length) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(a => {
        const on = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('is-current', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    }), { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* ---- Reveal: each block settles into place once, the first time it is seen ---- */
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  reveals.forEach(el => { // siblings arriving together settle one after another
    const peers = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
    if (peers.length > 1) el.style.setProperty('--delay', `${Math.min(peers.indexOf(el), 4) * 80}ms`);
  });
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
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
    if (feedback) feedback.textContent = copied ? 'Email address copied.' : 'Copy is unavailable here. Select the address above instead.';
    if (!copied) return;
    track('contact-copy-success');
    button.textContent = 'Copied';
    clearTimeout(button.resetTimer);
    button.resetTimer = setTimeout(() => { button.textContent = 'Copy email'; if (feedback) feedback.textContent = ''; }, 2400);
  });

  /* ---- Analytics: anything marked data-track reports its name when used ---- */
  document.addEventListener('click', e => {
    const target = e.target instanceof Element ? e.target.closest('[data-track]') : null;
    if (target && target.id !== 'copy-email') track(target.dataset.track);
  });
  const contact = document.getElementById('contact');
  if (contact && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { track('contact-section-view'); io.disconnect(); } }, { threshold: .4 });
    io.observe(contact);
  }

  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
