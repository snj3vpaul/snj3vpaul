/* Tiny interactions, without libraries or ornamental animation. */
(() => {
  'use strict';
  function init() {
    const menuButton = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('#mobile-nav');
    const header = document.querySelector('.site-header');
    const progress = document.getElementById('progress-line');

    function setMenu(open) {
      if (!menuButton || !mobileNav) return;
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      menuButton.classList.toggle('is-open', open);
      mobileNav.hidden = !open;
    }
    menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    document.addEventListener('click', e => { if (header && !header.contains(e.target)) setMenu(false); });
    const media = window.matchMedia('(min-width: 881px)');
    media.addEventListener?.('change', event => { if (event.matches) setMenu(false); });

    let scheduled = false;
    function updateProgress() {
      if (!progress) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0})`;
      scheduled = false;
    }
    window.addEventListener('scroll', () => {
      if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); }
    }, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
    const year = document.getElementById('current-year');
    if (year) year.textContent = String(new Date().getFullYear());

    const helloWord = document.getElementById('hello-word');
    const helloOrigin = document.getElementById('hello-origin');
    const cipherCode = document.getElementById('cipher-code');
    const cipherPlain = document.getElementById('cipher-plain');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (helloWord && helloOrigin && cipherCode && cipherPlain && !reduceMotion) {
      const greetings = [
        { word: 'Hello', origin: 'ENGLISH', code: '01001000 01100101 01101100 01101100 01101111', plain: 'HELLO' },
        { word: 'Bonjour', origin: 'FRENCH', code: '426f6e6a6f7572', plain: 'BONJOUR' },
        { word: 'नमस्ते', origin: 'HINDI', code: '6e616d61737465', plain: 'NAMASTE' },
        { word: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', origin: 'PUNJABI', code: '736174 20737269 20616b61616c', plain: 'SAT SRI AKAAL' },
        { word: 'নমস্কার', origin: 'BENGALI', code: '6e6f6d6f736b6172', plain: 'NOMOSKAR' },
        { word: 'Bonjour', origin: 'FRENCH', code: '426f6e6a6f7572', plain: 'BONJOUR' }
      ];
      const nodes = [helloWord, helloOrigin, cipherCode, cipherPlain];
      let index = 0;
      window.setInterval(() => {
        index = (index + 1) % greetings.length;
        nodes.forEach(node => node.classList.add('is-fading'));
        window.setTimeout(() => {
          const item = greetings[index];
          helloWord.textContent = item.word;
          helloOrigin.textContent = item.origin;
          cipherCode.textContent = item.code;
          cipherPlain.textContent = item.plain;
          nodes.forEach(node => node.classList.remove('is-fading'));
        }, 180);
      }, 2800);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
