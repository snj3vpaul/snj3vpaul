/* life.js — the motion layer. Everything here is optional polish on a page that already
   reads completely without it: a short "verify" intro, a cursor that knows what it is over,
   magnetic buttons, cards that catch the light, titles that rise word by word, labels that
   decode like ciphertext, and a pulse that runs through Fig. 1 from requirement to certificate.
   Reduced motion: no intro, no cursor, no scrambles, no pulse. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const HEX = '0123456789ABCDEF';
  const rand = s => s[Math.floor(Math.random() * s.length)];
  const onView = (el, fn, opts = { rootMargin: '0px 0px -10% 0px' }) => {
    if (!('IntersectionObserver' in window)) return fn();
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); fn(); } }, opts);
    io.observe(el);
  };

  /* ---- Decode: text resolves left to right out of hex noise ---- */
  const decode = (el, { duration = 700, charset = HEX } = {}) => {
    if (reduceMotion || el.children.length) return;
    const final = el.textContent; const t0 = performance.now();
    el.style.minWidth = `${el.offsetWidth}px`;
    const step = now => {
      const k = Math.min(1, (now - t0) / duration), fixed = Math.floor(k * final.length);
      el.textContent = [...final].map((c, i) => (i < fixed || /[\s·#.,]/.test(c)) ? c : rand(charset)).join('');
      if (k < 1) requestAnimationFrame(step); else { el.textContent = final; el.style.minWidth = ''; }
    };
    requestAnimationFrame(step);
  };

  /* ---- 1. Intro: a two-second handshake, once per visit. Click or any key skips it. ---- */
  const heroStart = () => {
    root.classList.remove('is-intro');
    document.querySelectorAll('.proof-figure').forEach((el, i) => {
      const t = el.childNodes[0];
      if (t && t.nodeType === 3 && /\d/.test(t.textContent)) {
        const span = document.createElement('span'); span.textContent = t.textContent; t.replaceWith(span);
        setTimeout(() => decode(span, { duration: 900, charset: '0123456789' }), 700 + i * 140);
      }
    });
  };
  if (root.classList.contains('is-intro')) {
    const intro = document.createElement('div');
    intro.className = 'intro'; intro.setAttribute('aria-hidden', 'true');
    intro.innerHTML = `
      <div class="intro-log">
        <p><span>handshake</span><b>sanjeev-k-paul</b></p>
        <p><span>sha-256</span><b class="intro-hash">0000000000000000</b></p>
        <p><span>boundary</span><b>defined</b></p>
        <p class="intro-ok"><span>status</span><b>verified <i></i></b></p>
      </div>
      <p class="intro-name">Sanjeev K Paul</p>
      <div class="intro-bar"><i></i></div>`;
    document.body.appendChild(intro);
    root.classList.add('intro-ready');
    const hash = intro.querySelector('.intro-hash');
    const target = '7f3a9c1e5b02d8a4';
    let n = 0; const spin = setInterval(() => {
      n++; hash.textContent = [...target].map((c, i) => (n > 14 + i) ? c : rand(HEX.toLowerCase())).join('');
      if (n > 32) clearInterval(spin);
    }, 30);
    let done = false;
    const finish = () => {
      if (done) return; done = true; clearInterval(spin);
      try { sessionStorage.setItem('skp-intro', '1'); } catch { /* private mode */ }
      intro.classList.add('is-out');
      setTimeout(heroStart, 250);
      setTimeout(() => { intro.remove(); root.classList.remove('intro-ready'); }, 1000);
    };
    setTimeout(finish, 2100);
    addEventListener('keydown', finish, { once: true });
    intro.addEventListener('pointerdown', finish, { once: true });
  } else {
    heroStart();
  }

  if (reduceMotion) return;

  /* ---- 2. Section titles rise word by word; eyebrows decode ---- */
  document.querySelectorAll('.section-title').forEach(h => {
    h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
    let i = 0;
    const wrap = node => { const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true'); const inner = document.createElement('span'); inner.style.setProperty('--i', i++); w.appendChild(inner); return [w, inner]; };
    [...h.childNodes].forEach(node => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const [w, inner] = wrap(); inner.textContent = part; frag.appendChild(w);
        });
        node.replaceWith(frag);
      } else if (node.nodeType === 1) {
        const [w, inner] = wrap(); node.replaceWith(w); inner.appendChild(node);
      }
    });
    h.classList.add('is-split');
  });
  document.querySelectorAll('main .section .eyebrow, .contact .eyebrow, .tier-title').forEach(el => onView(el, () => decode(el)));

  /* ---- 3. Nav labels roll on hover ---- */
  document.querySelectorAll('.nav a').forEach(a => {
    const label = a.textContent; a.textContent = '';
    const roll = document.createElement('span'); roll.className = 'roll';
    const inner = document.createElement('span'); inner.textContent = label; inner.dataset.text = label;
    roll.appendChild(inner); a.appendChild(roll); a.setAttribute('aria-label', label);
  });

  /* ---- 4. Scroll progress: a teal hairline under the bar ---- */
  const bar = document.querySelector('.topbar');
  if (bar) {
    const p = document.createElement('i'); p.className = 'progress'; p.setAttribute('aria-hidden', 'true'); bar.appendChild(p);
    let q = false;
    const set = () => { q = false; const h = document.documentElement.scrollHeight - innerHeight; p.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; };
    addEventListener('scroll', () => { if (!q) { q = true; requestAnimationFrame(set); } }, { passive: true });
    set();
  }

  /* ---- 5. Fig. 1 comes alive: a pulse runs requirement → certificate along the lit chain,
     and while nobody is touching it, the trace walks through the algorithms on its own. ---- */
  const net = document.querySelector('.net-svg');
  if (net) {
    const NS = 'http://www.w3.org/2000/svg';
    const layer = document.createElementNS(NS, 'g'); layer.setAttribute('class', 'net-packets'); layer.setAttribute('aria-hidden', 'true'); net.appendChild(layer);
    const pool = [];
    const packet = i => pool[i] || (pool[i] = (() => { const r = document.createElementNS(NS, 'rect'); r.setAttribute('width', '5'); r.setAttribute('height', '5'); layer.appendChild(r); return r; })());
    const lens = new Map();
    const len = e => lens.get(e) ?? (lens.set(e, e.getTotalLength()), lens.get(e));
    const cert = net.querySelector('[data-node="cert"]');
    let visible = true, raf = 0, t0 = performance.now(), lastCycle = -1;
    const PERIOD = 2.6, ROWS = 4;
    const frame = now => {
      const t = ((now - t0) / 1000) % PERIOD, p = t / PERIOD, cycle = Math.floor((now - t0) / 1000 / PERIOD);
      const lit = [...net.querySelectorAll('.net-edge.is-lit')];
      let k = 0;
      lit.forEach(e => {
        const r = +getComputedStyle(e).getPropertyValue('--r') || 0;
        const local = p * (ROWS + 1) - r; // each row's edges carry the pulse in turn
        if (local < 0 || local > 1) return;
        const pt = e.getPointAtLength(len(e) * local);
        const el = packet(k++); el.setAttribute('x', (pt.x - 2.5).toFixed(1)); el.setAttribute('y', (pt.y - 2.5).toFixed(1)); el.style.opacity = '1';
      });
      for (let i = k; i < pool.length; i++) pool[i].style.opacity = '0';
      if (cycle !== lastCycle && p > ROWS / (ROWS + 1)) { lastCycle = cycle; cert?.classList.remove('is-pulse'); void cert?.getBBox(); cert?.classList.add('is-pulse'); }
      raf = requestAnimationFrame(frame);
    };
    const run = () => { if (visible && !document.hidden && !raf) raf = requestAnimationFrame(frame); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? run() : stop(); }).observe(net);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : run()));
    setTimeout(run, 2600);

    // autopilot: wander the chains until someone takes over; resume 6s after they leave
    const tour = ['aes', 'sha', 'rsa', 'drbg', 'optest', 'hmac', 'ecdsa', 'policy'];
    let step = 0, heldUntil = 0;
    const hold = () => { heldUntil = performance.now() + 6000; };
    net.addEventListener('pointermove', hold); net.addEventListener('focusin', hold); net.addEventListener('pointerdown', hold);
    setInterval(() => {
      if (!visible || document.hidden || performance.now() < heldUntil || net.contains(document.activeElement)) return;
      step = (step + 1) % tour.length;
      net.querySelector(`[data-node="${tour[step]}"]`)?.dispatchEvent(new Event('pointerenter'));
    }, PERIOD * 1000 * 2);
  }

  /* ---- 6. Footer signature: letters rise when the page ends ---- */
  const mark = document.querySelector('.footer-mark');
  if (mark) {
    const text = mark.textContent; mark.textContent = '';
    [...text].forEach((c, i) => { const s = document.createElement('span'); s.textContent = c === ' ' ? ' ' : c; s.style.setProperty('--i', i); mark.appendChild(s); });
    onView(mark, () => mark.classList.add('is-in'), { threshold: .3 });
  }

  if (!finePointer) return;

  /* ---- 7. Cursor: a square node (the graph's own mark) and a lagging ring that names
     what it is over. Native cursor stays for text fields; this page has none. ---- */
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring'; ring.innerHTML = '<span></span>';
  [dot, ring].forEach(el => { el.setAttribute('aria-hidden', 'true'); document.body.appendChild(el); });
  const label = ring.firstChild;
  root.classList.add('has-cursor');
  let mx = -100, my = -100, rx = -100, ry = -100;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    root.classList.add('cursor-on');
    const t = e.target instanceof Element ? e.target : null;
    const overNet = t?.closest('.net-svg'), link = t?.closest('a, button');
    ring.classList.toggle('is-link', !!link && !overNet);
    ring.classList.toggle('is-label', !!overNet);
    const text = overNet ? 'Trace' : '';
    if (label.textContent !== text) label.textContent = text;
  }, { passive: true });
  document.addEventListener('pointerleave', () => root.classList.remove('cursor-on'));
  addEventListener('pointerdown', () => ring.classList.add('is-down'));
  addEventListener('pointerup', () => ring.classList.remove('is-down'));
  const follow = () => { rx += (mx - rx) * .18; ry += (my - ry) * .18; ring.style.transform = `translate(${rx}px, ${ry}px)`; requestAnimationFrame(follow); };
  requestAnimationFrame(follow);

  /* ---- 8. Magnetic buttons ---- */
  document.querySelectorAll('.btn, .nav-resume').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${((e.clientX - r.left) / r.width - .5) * 12}px, ${((e.clientY - r.top) / r.height - .5) * 10}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });

  /* ---- 9. Cards catch the light and lean, very slightly, toward the pointer ---- */
  document.querySelectorAll('.case, .tool, .proof-strip a, .highlights li, .panel').forEach(c => {
    c.classList.add('lit');
    const lean = c.matches('.case, .proof-strip a');
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', `${x * 100}%`); c.style.setProperty('--my', `${y * 100}%`);
      if (lean) c.style.transform = `perspective(900px) rotateX(${(.5 - y) * 3}deg) rotateY(${(x - .5) * 3}deg) translateY(-2px)`;
    });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; });
  });
})();
