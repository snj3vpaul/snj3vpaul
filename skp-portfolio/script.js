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
  if (navLinks.length) {
    // the current section is the last one whose top has passed 40% of the viewport;
    // at the very bottom it is always the last section, in the hero it is none
    let current = null, queued = false;
    const update = () => {
      queued = false;
      const line = window.innerHeight * .4;
      let id = null;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) id = s.id;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) id = sections[sections.length - 1]?.id;
      if (id === current) return;
      current = id;
      navLinks.forEach(a => {
        const on = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('is-current', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
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


  /* ---- Background geometry: slow wireframe solids, drawn in SVG with ~60 lines of maths.
     Each one belongs to its section: a cube for the module boundary, a diamond for the
     decision a tool parses, a sphere for the ball (and the globe). They only animate
     while on screen, and sit still for reduced motion. ---- */
  const SOLIDS = {
    cube() {
      const v = []; for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) v.push([x * .62, y * .62, z * .62]);
      const e = []; v.forEach((a, i) => v.forEach((b, j) => { if (j > i && a.filter((c, k) => c !== b[k]).length === 1) e.push([a, b]); }));
      return { e, node: v[7] };
    },
    octa() {
      const r = .95, v = [[r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0], [0, 0, r], [0, 0, -r]];
      const e = []; v.forEach((a, i) => v.forEach((b, j) => { if (j > i && a.some((c, k) => c && b[k] !== -c) && !a.every((c, k) => c === -b[k])) e.push([a, b]); }));
      return { e, node: v[2] };
    },
    sphere() {
      const e = [], N = 28, P = (la, lo) => [Math.cos(la) * Math.cos(lo) * .9, Math.sin(la) * .9, Math.cos(la) * Math.sin(lo) * .9];
      for (let i = -2; i <= 2; i++) { const la = i * Math.PI / 6; for (let k = 0; k < N; k++) e.push([P(la, k / N * 2 * Math.PI), P(la, (k + 1) / N * 2 * Math.PI)]); }
      for (let m = 0; m < 6; m++) { const lo = m / 6 * Math.PI; for (let k = 0; k < N; k++) e.push([P(k / N * 2 * Math.PI, lo), P((k + 1) / N * 2 * Math.PI, lo)]); }
      return { e, node: P(Math.PI / 6, 0) };
    }
  };
  const NS = 'http://www.w3.org/2000/svg';
  document.querySelectorAll('[data-geo]').forEach(host => {
    const solid = SOLIDS[host.dataset.geo]?.(); if (!solid) return;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '-1.25 -1.25 2.5 2.5'); svg.setAttribute('focusable', 'false');
    const lines = solid.e.map(() => { const l = document.createElementNS(NS, 'line'); svg.appendChild(l); return l; });
    const node = document.createElementNS(NS, 'rect'); node.setAttribute('class', 'geo-node'); node.setAttribute('width', '.06'); node.setAttribute('height', '.06'); svg.appendChild(node);
    host.appendChild(svg);
    const tilt = Number(host.dataset.tilt || .45), speed = Number(host.dataset.speed || .07), phase = Number(host.dataset.phase || 0);
    const rot = ([x, y, z], a, b) => { // spin about y, then tilt about x
      const x1 = x * Math.cos(a) + z * Math.sin(a), z1 = -x * Math.sin(a) + z * Math.cos(a);
      return [x1, y * Math.cos(b) - z1 * Math.sin(b), y * Math.sin(b) + z1 * Math.cos(b)];
    };
    const proj = p => { const s = 3.2 / (3.2 - p[2]); return [p[0] * s, p[1] * s, p[2]]; };
    const draw = t => {
      const a = phase + t * speed + window.scrollY * .0006, b = tilt + Math.sin(t * .05 + phase) * .08;
      solid.e.forEach(([p, q], i) => {
        const P = proj(rot(p, a, b)), Q = proj(rot(q, a, b)), l = lines[i];
        l.setAttribute('x1', P[0].toFixed(3)); l.setAttribute('y1', P[1].toFixed(3)); l.setAttribute('x2', Q[0].toFixed(3)); l.setAttribute('y2', Q[1].toFixed(3));
        l.setAttribute('stroke-opacity', ((P[2] + Q[2]) / 2 > 0 ? 1 : .4).toString());
      });
      const n = proj(rot(solid.node, a, b)); node.setAttribute('x', (n[0] - .03).toFixed(3)); node.setAttribute('y', (n[1] - .03).toFixed(3));
    };
    draw(0);
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    let raf = 0, t0 = performance.now();
    const loop = now => { draw((now - t0) / 1000); raf = requestAnimationFrame(loop); };
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !raf) raf = requestAnimationFrame(loop);
      else if (!en.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    }).observe(host);
  });

  /* ---- Email: never in the HTML as plain text. Stored reversed and base64-encoded,
     assembled only when someone asks for it, so simple scrapers find nothing. ---- */
  const emailHost = document.getElementById('contact-email');
  const getEmail = () => { try { return [...atob(emailHost?.dataset.k || '')].reverse().join(''); } catch { return ''; } };
  document.getElementById('reveal-email')?.addEventListener('click', event => {
    const email = getEmail(); if (!email) return;
    const link = document.createElement('a');
    link.className = 'contact-email-link'; link.href = `mailto:${email}?subject=Hello%20Sanjeev`; link.textContent = email;
    emailHost.querySelector('.contact-email-text').replaceWith(link);
    event.currentTarget.remove(); link.focus();
  });
  document.getElementById('mail-email')?.addEventListener('click', () => {
    const email = getEmail(); if (email) window.location.href = `mailto:${email}?subject=Hello%20Sanjeev`;
  });

  /* ---- Copy email ---- */
  document.getElementById('copy-email')?.addEventListener('click', async event => {
    const button = event.currentTarget;
    const email = getEmail(); if (!email) return;
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
    if (feedback) feedback.textContent = copied ? 'Email address copied.' : 'Copy is unavailable here. Use Show, then select the address.';
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
