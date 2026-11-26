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
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* ---- Fig. 1, the trace: point at, tap, or arrow to a node and its whole chain lights up.
     The graph draws in once (CSS), settles on one chain, then waits. Nothing moves on its own. ---- */
  const net = document.querySelector('.net-svg');
  if (net) {
    const edges = [...net.querySelectorAll('.net-edge')];
    const nodeEls = [...net.querySelectorAll('.net-node')];
    const nodes = new Map(nodeEls.map(n => [n.dataset.node, n]));
    const traceText = document.querySelector('.net-trace-v');
    const walk = (start, key, next) => {
      const seen = new Set([start]), stack = [start];
      while (stack.length) {
        const id = stack.pop();
        edges.forEach(e => { if (e.dataset[key] === id && !seen.has(e.dataset[next])) { seen.add(e.dataset[next]); stack.push(e.dataset[next]); } });
      }
      return seen;
    };
    const order = id => nodeEls.indexOf(nodes.get(id));
    const trace = id => {
      const up = walk(id, 'to', 'from'), down = walk(id, 'from', 'to');
      const lit = new Set([...up, ...down]);
      net.classList.add('is-tracing');
      nodes.forEach((n, k) => n.classList.toggle('is-lit', lit.has(k)));
      edges.forEach(e => e.classList.toggle('is-lit', (up.has(e.dataset.to) && up.has(e.dataset.from)) || (down.has(e.dataset.from) && down.has(e.dataset.to))));
      if (traceText) {
        // one readable path through the chain: the first parent above, the first child below
        const path = [id];
        for (let cur = id, e; (e = edges.find(x => x.dataset.to === cur)); cur = e.dataset.from) path.unshift(e.dataset.from);
        for (let cur = id, e; (e = edges.find(x => x.dataset.from === cur)); cur = e.dataset.to) path.push(e.dataset.to);
        traceText.textContent = path.sort((a, b) => order(a) - order(b)).map(k => nodes.get(k).dataset.label).join(' → ');
      }
    };
    const resting = 'aes';
    nodes.get(resting)?.setAttribute('tabindex', '0');
    nodes.forEach((n, id) => {
      n.addEventListener('pointerenter', () => trace(id));
      n.addEventListener('pointerdown', () => trace(id));
      n.addEventListener('focus', () => trace(id));
    });
    net.addEventListener('pointerleave', () => { if (!net.contains(document.activeElement)) trace(resting); });
    // one tab stop for the whole graph; arrows move along a row or between rows
    net.addEventListener('keydown', e => {
      const cur = e.target.closest('.net-node');
      if (!cur) return;
      const row = +cur.dataset.row;
      const inRow = r => nodeEls.filter(n => +n.dataset.row === r);
      const x = n => n.transform.baseVal.consolidate()?.matrix.e ?? 0;
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const list = inRow(row), i = list.indexOf(cur);
        next = list[i + (e.key === 'ArrowRight' ? 1 : -1)];
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const list = inRow(row + (e.key === 'ArrowDown' ? 1 : -1));
        if (list.length) next = list.reduce((a, b) => Math.abs(x(b) - x(cur)) < Math.abs(x(a) - x(cur)) ? b : a);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); trace(cur.dataset.node); return;
      }
      if (next) {
        e.preventDefault();
        nodeEls.forEach(n => n.setAttribute('tabindex', n === next ? '0' : '-1'));
        next.focus();
      }
    });
    setTimeout(() => trace(resting), reduceMotion ? 0 : 1900);
    // on narrow screens the row labels go and the graph crops to its nodes, so its type stays legible
    const narrow = window.matchMedia('(max-width: 640px)');
    const crop = () => net.setAttribute('viewBox', narrow.matches ? '92 28 372 520' : '0 0 460 560');
    narrow.addEventListener?.('change', crop);
    crop();
  }

  /* ---- Hello, decoded: each greeting arrives Caesar-shifted by three and resolves letter by letter ---- */
  const helloWord = document.getElementById('hello-word');
  const helloLang = document.getElementById('hello-lang');
  const helloNext = document.getElementById('hello-next');
  if (helloWord && helloLang && helloNext) {
    const greetings = [['Hello', 'English', 'en'], ['Bonjour', 'French', 'fr'], ['नमस्ते', 'Hindi', 'hi'], ['ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'Punjabi', 'pa'], ['নমস্কার', 'Bengali', 'bn']];
    const shift = ch => /\s/.test(ch) ? ch : String.fromCodePoint(ch.codePointAt(0) + 3);
    let index = 0, timer = 0;
    const show = i => {
      const [word, language, lang] = greetings[i];
      helloLang.innerHTML = `<b>${language}</b>`;
      helloWord.setAttribute('lang', lang);
      clearInterval(timer);
      if (reduceMotion) { helloWord.classList.remove('is-cipher'); helloWord.textContent = word; return; }
      const chars = Array.from(word);
      const cipher = chars.map(shift);
      let solved = 0;
      helloWord.classList.add('is-cipher');
      helloWord.setAttribute('aria-hidden', 'true'); // announce only the decoded word
      helloWord.textContent = cipher.join('');
      timer = setInterval(() => {
        solved += 1;
        helloWord.textContent = chars.slice(0, solved).join('') + cipher.slice(solved).join('');
        if (solved >= chars.length) {
          clearInterval(timer);
          helloWord.classList.remove('is-cipher');
          helloWord.removeAttribute('aria-hidden');
        }
      }, 520 / chars.length + 60);
    };
    const live = document.getElementById('hello-live');
    helloNext.addEventListener('click', () => {
      index = (index + 1) % greetings.length;
      show(index);
      if (live) live.textContent = `${greetings[index][1]}: ${greetings[index][0]}`;
      track('hello-decode');
    });
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { show(index); io.disconnect(); } }, { threshold: .6 });
      io.observe(helloWord);
    }
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
