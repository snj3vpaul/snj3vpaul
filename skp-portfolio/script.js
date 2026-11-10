/* Small, dependency-free interactions. The page reads fully without JS. */
(() => {
  'use strict';
  function init() {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let scene = null;

    /* ---- Colour scheme: dark (default) / light, remembered per browser ---- */
    const themeButtons = document.querySelectorAll('[data-theme-set]');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    function applyTheme(theme, save) {
      root.setAttribute('data-theme', theme);
      themeButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeSet === theme)));
      if (themeColor) themeColor.setAttribute('content', theme === 'light' ? '#f3f3ef' : '#0b0b0b');
      if (save) { try { localStorage.setItem('theme', theme); } catch { /* storage unavailable */ } }
      scene?.setTheme(theme);
    }
    applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark', false);
    themeButtons.forEach(b => b.addEventListener('click', () => applyTheme(b.dataset.themeSet, true)));

    /* ---- Mobile menu ---- */
    const menuButton = document.querySelector('.menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const header = document.querySelector('.topbar');
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

    /* ---- Ottawa local time ---- */
    const timeNode = document.getElementById('local-time');
    if (timeNode) {
      const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hour12: false });
      const tick = () => { timeNode.textContent = fmt.format(new Date()); };
      tick();
      setInterval(tick, 20000);
    }

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

    /* ---- Chapter marker and current nav item ---- */
    const marker = { num: document.getElementById('chapter-num'), name: document.getElementById('chapter-name') };
    const navLinks = document.querySelectorAll('.nav a');
    const chapters = document.querySelectorAll('[data-chapter]');
    if ('IntersectionObserver' in window && chapters.length) {
      const io = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (marker.num) marker.num.textContent = el.dataset.chapter;
        if (marker.name) marker.name.textContent = el.dataset.chapterName;
        navLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === `#${el.id}`));
      }), { rootMargin: '-45% 0px -50% 0px' });
      chapters.forEach(c => io.observe(c));
      const markerEl = document.querySelector('.chapter-marker');
      const heroEl = document.querySelector('.hero');
      if (markerEl && heroEl) new IntersectionObserver(([e]) => markerEl.classList.toggle('is-visible', !e.isIntersecting), { threshold: 0.05 }).observe(heroEl);
    }

    /* ---- Kinetic name: drifts sideways as the hero scrolls away ---- */
    const giant = document.querySelector('[data-parallax]');
    if (giant && !reduceMotion) {
      let ticking = false;
      const update = () => {
        const y = Math.min(window.scrollY, window.innerHeight);
        giant.style.transform = `translateX(${-y * 0.18}px)`;
        ticking = false;
      };
      window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    }

    /* ---- Hero halftone sphere (Three.js / WebGL): after load, hardware WebGL only ---- */
    const heroCanvas = document.getElementById('hero-canvas');
    const forced = /[?&]3d=1\b/.test(window.location.search);
    const webglAvailable = () => {
      try {
        const c = document.createElement('canvas');
        const gl = c.getContext('webgl2') || c.getContext('webgl');
        if (!gl) return false;
        const info = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        if (forced) return true;
        if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)) return false;
        return (navigator.hardwareConcurrency || 4) > 2;
      } catch { return false; }
    };
    if (heroCanvas && !navigator.connection?.saveData && webglAvailable()) {
      const load = () => import('./hero-scene.js')
        .then(m => {
          scene = m.mount(heroCanvas, { reducedMotion: reduceMotion, compact: window.innerWidth < 760, theme: root.getAttribute('data-theme') });
          heroCanvas.closest('.hero')?.classList.add('has-3d');
        })
        .catch(() => { /* the still image stands in */ });
      const idle = window.requestIdleCallback ? cb => window.requestIdleCallback(cb, { timeout: 1500 }) : cb => setTimeout(cb, 300);
      if (document.readyState === 'complete') idle(load);
      else window.addEventListener('load', () => idle(load), { once: true });
    }

    /* ---- Project viewer: list on the left, one project at a time ---- */
    document.querySelectorAll('[data-viewer]').forEach(viewer => {
      const items = Array.from(viewer.querySelectorAll('.viewer-item'));
      const panels = items.map(b => document.getElementById(b.getAttribute('aria-controls')));
      if (!items.length || panels.some(p => !p)) return;
      let index = 0;
      const show = (next, focus) => {
        index = (next + items.length) % items.length;
        items.forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
        panels.forEach((p, i) => { p.hidden = i !== index; });
        // keep the selected item visible inside the list without scrolling the page
        const list = viewer.querySelector('.viewer-list');
        const it = items[index];
        if (it.offsetTop < list.scrollTop || it.offsetTop + it.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = Math.max(0, it.offsetTop - list.clientHeight / 2);
        if (it.offsetLeft < list.scrollLeft || it.offsetLeft + it.offsetWidth > list.scrollLeft + list.clientWidth) list.scrollLeft = Math.max(0, it.offsetLeft - 120);
        if (focus) items[index].focus();
      };
      items.forEach((b, i) => b.addEventListener('click', () => show(i)));
      viewer.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => show(index + Number(b.dataset.step))));
      viewer.querySelector('.viewer-list').addEventListener('keydown', e => {
        if (['ArrowDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); show(index + 1, true); }
        if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); show(index - 1, true); }
      });
      // Move the picture around: a gentle tilt that follows the pointer.
      if (!reduceMotion) panels.forEach(p => {
        const art = p.querySelector('.viewer-art');
        const tilt = p.querySelector('.viewer-tilt');
        if (!art || !tilt) return;
        art.addEventListener('pointermove', e => {
          const r = art.getBoundingClientRect();
          tilt.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 28}deg`);
          tilt.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 20}deg`);
        });
        art.addEventListener('pointerleave', () => { tilt.style.setProperty('--rx', '0deg'); tilt.style.setProperty('--ry', '0deg'); });
      });
      viewer.classList.add('is-ready');
      show(0);
    });

    const year = document.getElementById('current-year');
    if (year) year.textContent = String(new Date().getFullYear());

    /* ---- Copy email ---- */
    document.getElementById('copy-email')?.addEventListener('click', async event => {
      const email = event.currentTarget.dataset.email;
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
      if (feedback) feedback.textContent = copied ? 'Copied.' : 'Copy unavailable — use the link.';
    });

    /* ---- Outcome measurement (Vercel Web Analytics custom events) ---- */
    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target.closest('[data-track]') : null;
      if (target && typeof window.va === 'function') window.va('event', { name: target.dataset.track });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
