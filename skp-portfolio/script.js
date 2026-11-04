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


    /* ---- Work sections: preserve native fragment scrolling and focus headings ---- */
    const workTargets = {
      '#professional-work': 'professional-work-title',
      '#personal-projects': 'personal-projects-title'
    };
    function focusWorkHeading() {
      const headingId = workTargets[window.location.hash];
      if (headingId) document.getElementById(headingId)?.focus({ preventScroll: true });
    }
    window.addEventListener('hashchange', focusWorkHeading);
    if (workTargets[window.location.hash]) requestAnimationFrame(focusWorkHeading);
    document.querySelectorAll('a[href="#professional-work"], a[href="#personal-projects"]').forEach(link => {
      link.addEventListener('click', () => requestAnimationFrame(focusWorkHeading));
    });

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

    /* ---- Hero greeting, UTF-8 encoding and genuine SHA-256 ---- */
    const helloWord = document.getElementById('hello-word');
    const helloOrigin = document.getElementById('hello-origin');
    const cipherCode = document.getElementById('cipher-code');
    const cipherPlain = document.getElementById('cipher-plain');
    const digestStudy = document.getElementById('digest-study');
    const digestResult = document.getElementById('digest-result');
    const digestChanged = document.getElementById('digest-changed');
    const digestDifference = document.getElementById('digest-difference');
    const digestDescription = document.getElementById('digest-change-description');
    const compareButton = document.getElementById('digest-compare');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const greetings = [
      ['Hello', 'ENGLISH'], ['Bonjour', 'FRENCH'], ['नमस्ते', 'HINDI'],
      ['ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'PUNJABI'], ['নমস্কার', 'BENGALI']
    ];
    const encoder = new TextEncoder();
    let greetingIndex = 0;
    let comparing = false;
    let digestRequest = 0;
    const toHex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join(' ');
    const digest = async word => {
      const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(word)));
      return Array.from(bytes.slice(0, 16), b => b.toString(16).padStart(2, '0')).join('');
    };
    async function showDigest(word) {
      if (!digestStudy || !digestResult || !window.crypto?.subtle) return;
      const request = ++digestRequest;
      try {
        const base = await digest(word);
        if (request !== digestRequest) return;
        digestResult.textContent = base;
        if (comparing && digestChanged && digestDescription && digestDifference) {
          const graphemes = typeof Intl.Segmenter === 'function'
            ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(word), s => s.segment)
            : Array.from(word);
          const modified = graphemes.slice(0, -1).join('') + '!';
          const other = await digest(modified);
          if (request !== digestRequest) return;
          digestDescription.textContent = `Last character replaced: ${word} → ${modified}`;
          digestChanged.textContent = other;
          digestDifference.hidden = false;
        } else if (digestDifference) digestDifference.hidden = true;
      } catch { digestStudy.hidden = true; }
    }
    if (helloWord && helloOrigin && cipherCode && cipherPlain) {
      if (window.crypto?.subtle && digestStudy) digestStudy.hidden = false;
      function renderGreeting() {
        const [word, language] = greetings[greetingIndex];
        helloWord.textContent = word;
        helloOrigin.textContent = language;
        cipherCode.textContent = toHex(encoder.encode(word));
        cipherPlain.textContent = word;
        showDigest(word);
      }
      renderGreeting();
      if (!reduceMotion) {
        const nodes = [helloWord, helloOrigin, cipherCode, cipherPlain];
        window.setInterval(() => {
          if (comparing || document.hidden) return;
          nodes.forEach((node, i) => window.setTimeout(() => node.classList.add('is-fading'), i * 50));
          window.setTimeout(() => {
            greetingIndex = (greetingIndex + 1) % greetings.length;
            renderGreeting();
            nodes.forEach(node => node.classList.remove('is-fading'));
          }, 290);
        }, 3500);
      }
      compareButton?.addEventListener('click', () => {
        comparing = !comparing;
        compareButton.setAttribute('aria-pressed', String(comparing));
        compareButton.textContent = comparing ? 'Close comparison ↗' : 'Change one character ↗';
        showDigest(greetings[greetingIndex][0]);
      });
    }

    /* ---- Career reveal: progressive enhancement, never hides content without JS ---- */
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const rows = document.querySelectorAll('.career-rows article');
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }), { threshold: .1 });
      rows.forEach(row => observer.observe(row));
      document.documentElement.classList.add('has-js-reveal');
    }

    /* ---- Contact: copy email, with an older-browser fallback ---- */
    document.getElementById('copy-email')?.addEventListener('click', async event => {
      const email = event.currentTarget.dataset.email;
      const feedback = document.getElementById('copy-feedback');
      let copied = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(email);
          copied = true;
        }
      } catch { /* try the local selection fallback */ }
      if (!copied) {
        const area = document.createElement('textarea');
        area.value = email;
        area.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.appendChild(area);
        area.select();
        try { copied = !!document.execCommand?.('copy'); } catch { /* unavailable */ }
        area.remove();
      }
      if (feedback) feedback.textContent = copied ? 'Copied to clipboard.' : 'Copy unavailable — use the email link.';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
