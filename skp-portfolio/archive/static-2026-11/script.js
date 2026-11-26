/* Home page behaviour. Everything here is enhancement: the page reads complete without it. */
(() => {
  const doc = document.documentElement;
  const motion = doc.classList.contains('motion');           // JS on and no reduced-motion preference
  const reduceMotion = !motion;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const track = name => { if (typeof window.va === 'function') window.va('event', { name }); };
  const once = (el, fn, opts = { threshold: .2, rootMargin: '0px 0px -8% 0px' }) => {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { fn(el); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); } }), opts);
    io.observe(el);
  };

  /* ---------- year and the live Ottawa clock ---------- */
  const year = $('#current-year'); if (year) year.textContent = String(new Date().getFullYear());
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hour12: false });
  const clocks = [...$$('[data-clock]'), $('#local-time')].filter(Boolean);
  const footTime = $('.footer-time'); if (footTime) footTime.hidden = false;
  /* today's daylight in Ottawa, from the NOAA sunrise equation (45.42°N, 75.70°W) */
  const rad = Math.PI / 180, LAT = 45.4215, LON = -75.6972;
  const sun = date => {
    const n = Math.floor(date / 864e5 + 2440587.5 - 2451545 + .0008) - LON / 360;
    const M = (357.5291 + .98560028 * n) % 360, C = 1.9148 * Math.sin(M * rad) + .02 * Math.sin(2 * M * rad) + .0003 * Math.sin(3 * M * rad);
    const L = (M + C + 180 + 102.9372) % 360, J = 2451545 + n + .0053 * Math.sin(M * rad) - .0069 * Math.sin(2 * L * rad);
    const dec = Math.asin(Math.sin(L * rad) * Math.sin(23.4397 * rad));
    const w = Math.acos((Math.sin(-.833 * rad) - Math.sin(LAT * rad) * Math.sin(dec)) / (Math.cos(LAT * rad) * Math.cos(dec))) / rad;
    const at = j => new Date((j - 2440587.5) * 864e5);
    return [at(J - w / 360), at(J + w / 360)];
  };
  const mins = d => { const [h, m] = fmt.format(d).split(':').map(Number); return h * 60 + m; };
  const rise = $('[data-rise]'), set = $('[data-set]'), day = $('[data-day]'), mark = $('[data-now]');
  const tick = () => {
    const now = new Date(), t = fmt.format(now);
    clocks.forEach(c => { c.textContent = t; });
    if (!rise) return;
    const [r, s] = sun(now);
    rise.textContent = `Sunrise ${fmt.format(r)}`; set.textContent = `Sunset ${fmt.format(s)}`;
    day.style.left = `${mins(r) / 14.4}%`; day.style.width = `${(mins(s) - mins(r)) / 14.4}%`; mark.style.left = `${mins(now) / 14.4}%`;
  };
  tick(); setInterval(() => { if (!document.hidden) tick(); }, 15000);

  /* ---------- mobile menu ---------- */
  const menuBtn = $('.menu-toggle'), mobileNav = $('#mobile-nav');
  if (menuBtn && mobileNav) {
    const setMenu = open => { menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.classList.toggle('is-open', open); menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); mobileNav.hidden = !open; };
    menuBtn.addEventListener('click', () => setMenu(mobileNav.hidden));
    mobileNav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuBtn.focus(); } });
  }

  /* ---------- progress, jump menu, current section ---------- */
  const bar = $('.progress span');
  const chapters = $$('[data-chapter-name]');
  const jump = $('.jump'), jumpBtn = $('.jump-btn'), jumpList = $('#jump-list'), chapterName = $('#chapter-name');
  if (jumpList) chapters.forEach(s => { const a = document.createElement('a'); a.href = `#${s.id}`; a.textContent = s.dataset.chapterName; jumpList.appendChild(a); });
  const setJump = open => { if (!jumpBtn) return; jumpBtn.setAttribute('aria-expanded', String(open)); jumpList.hidden = !open; };
  jumpBtn?.addEventListener('click', () => setJump(jumpList.hidden));
  jumpList?.addEventListener('click', e => { if (e.target.closest('a')) setJump(false); });
  document.addEventListener('click', e => { if (jump && !jump.contains(e.target)) setJump(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && jumpList && !jumpList.hidden) { setJump(false); jumpBtn.focus(); } });
  const navLinks = $$('.nav a[href^="#"], .jump-list a');
  const timeline = $('[data-timeline]');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const max = doc.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    const on = scrollY > innerHeight * .8;
    if (jump) { jump.classList.toggle('is-on', on); jump.inert = !on; if (!on) setJump(false); }
    let current = null;
    for (const s of chapters) { if (s.offsetParent !== null && s.getBoundingClientRect().top < innerHeight * .4) current = s; }
    if (current && chapterName) chapterName.textContent = current.dataset.chapterName;
    navLinks.forEach(a => a.setAttribute('aria-current', String(!!current && a.getAttribute('href') === `#${current.id}`)));
    /* journey: the line fills as the section passes the middle of the screen */
    if (motion && timeline) {
      const r = timeline.getBoundingClientRect();
      const f = Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height));
      timeline.style.setProperty('--fill', f.toFixed(3));
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll); onScroll();

  /* ---------- reveals: one pattern, once per element ---------- */
  if (motion) {
    const groups = new Map();
    $$('[data-reveal]').forEach(el => { const p = el.parentElement; const i = groups.get(p) || 0; el.style.setProperty('--i', i); groups.set(p, i + 1); once(el, t => t.classList.add('is-in'), { threshold: .15, rootMargin: '0px 0px -8% 0px' }); });
  }

  /* ---------- hero: headline words, the curve, the cipher ---------- */
  const headline = $('[data-split]');
  if (motion && headline) {
    const wrap = node => {
      const out = document.createDocumentFragment(); let i = 0;
      node.childNodes.forEach(n => {
        if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(part => { if (!part) return; if (/^\s+$/.test(part)) { out.append(part); return; } const w = document.createElement('span'); w.className = 'w'; w.style.setProperty('--i', i++); w.textContent = part; out.append(w); });
        else { const w = document.createElement('span'); w.className = 'w'; w.style.setProperty('--i', i++); w.append(n.cloneNode(true)); out.append(w); }
      });
      return out;
    };
    headline.setAttribute('aria-label', headline.textContent.replace(/\s+/g, ' ').trim());
    const words = wrap(headline); headline.textContent = ''; headline.append(words);
    $$('.w', headline).forEach(w => w.setAttribute('aria-hidden', 'true'));
    requestAnimationFrame(() => requestAnimationFrame(() => headline.classList.add('is-in')));
  }

  const curve = $('.hero-curve');
  if (motion && curve) {
    requestAnimationFrame(() => curve.classList.add('is-in'));
    /* depth: the curve drifts slightly with scroll and pointer while the hero is on screen */
    const hero = $('#home'); let seen = true, px = 0, py = 0, cx = 0, cy = 0, raf = 0;
    const frame = () => {
      raf = 0; cx += (px - cx) * .08; cy += (py - cy) * .08;
      const s = Math.min(scrollY, innerHeight);
      curve.style.transform = `translate3d(${(cx * 10).toFixed(2)}px, ${(s * -.08 + cy * 8).toFixed(2)}px, 0)`;
      if (seen && (Math.abs(px - cx) > .002 || Math.abs(py - cy) > .002)) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && seen) raf = requestAnimationFrame(frame); };
    new IntersectionObserver(es => { seen = es[0].isIntersecting; }).observe(hero);
    addEventListener('scroll', kick, { passive: true });
    if (finePointer) hero.addEventListener('pointermove', e => { px = e.clientX / innerWidth - .5; py = e.clientY / innerHeight - .5; kick(); }, { passive: true });
  }

  /* the cipher decrypts once: each word shows its ciphertext bytes, then resolves letter by letter */
  const cipher = $('[data-cipher]');
  if (motion && cipher) {
    const rows = $$('.ci-plain', cipher);
    const hex = '0123456789abcdef';
    rows.forEach(r => { r.dataset.done = '0'; r.setAttribute('aria-label', r.dataset.plain); r.textContent = ''; const g = document.createElement('span'); g.className = 'g'; g.setAttribute('aria-hidden', 'true'); g.textContent = r.parentElement.querySelector('.ci-hex').textContent.replace(/\s/g, '').slice(0, r.dataset.plain.length); r.append(g); });
    const run = () => {
      rows.forEach((r, ri) => {
        const plain = r.dataset.plain, g = r.firstChild;
        setTimeout(() => {
          let k = 0;
          const step = () => {
            k++;
            const solved = plain.slice(0, Math.floor(k / 3));
            const noise = Array.from({ length: plain.length - solved.length }, () => hex[Math.random() * 16 | 0]).join('');
            r.textContent = solved; const s = document.createElement('span'); s.className = 'g'; s.setAttribute('aria-hidden', 'true'); s.textContent = noise; r.append(s);
            if (solved.length < plain.length) setTimeout(step, 28); else { r.textContent = plain; r.dataset.done = '1'; }
          };
          step();
        }, 500 + ri * 240);
      });
    };
    once(cipher, run, { threshold: .4 });
  }

  /* ---------- introduction: the greetings arrive once, one after another ---------- */
  const intro = $('.intro');
  if (motion && intro) { $$('.greetings li', intro).forEach((li, i) => li.style.setProperty('--i', i)); once(intro, t => t.classList.add('is-in'), { threshold: .25 }); }

  /* ---------- assurance pipeline: tabs on wide screens, everything open on narrow ones ---------- */
  const pipe = $('[data-pipeline]');
  if (pipe) {
    const stages = $$('.pl-stage', pipe), panels = $$('.pl-panel', pipe);
    stages.forEach((s, i) => s.style.setProperty('--i', i));
    const choose = (stage, focus) => {
      stages.forEach(s => { const on = s === stage; s.setAttribute('aria-selected', String(on)); s.tabIndex = on ? 0 : -1; $(`#${s.getAttribute('aria-controls')}`).hidden = !on; });
      if (focus) stage.focus();
    };
    stages.forEach((s, i) => {
      s.addEventListener('click', () => choose(s));
      if (finePointer) s.addEventListener('pointerenter', () => choose(s));
      s.addEventListener('keydown', e => {
        const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1, Home: -i, End: stages.length - 1 - i }[e.key];
        if (k === undefined) return;
        e.preventDefault(); choose(stages[(i + k + stages.length) % stages.length], true);
      });
    });
    choose(stages[0]);
    if (motion) once(pipe, t => t.classList.add('is-in'), { threshold: .3 });
  }

  /* keyboard users never land on something still waiting to be revealed */
  if (motion) document.addEventListener('focusin', e => {
    const t = e.target instanceof Element ? e.target : null; if (!t) return;
    t.closest('[data-reveal]')?.classList.add('is-in');
    ['.pipeline', '.rail', '.intro'].forEach(s => t.closest(s)?.classList.add('is-in'));
  });

  /* ---------- looping recordings: play only while seen; reduced motion keeps the poster ---------- */
  const loops = $$('video[data-loop]');
  const seen = new Set();
  const playLoops = () => loops.forEach(v => {
    const shown = seen.has(v) && v.offsetParent !== null;
    if (shown && motion && !document.hidden) { v.play().catch(() => {}); } else { v.pause(); }
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { es.forEach(e => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target))); playLoops(); }, { rootMargin: '120px' });
    loops.forEach(v => io.observe(v));
  }
  document.addEventListener('visibilitychange', playLoops);

  /* ---------- project tabs ---------- */
  const tabs = $$('.proj-tab');
  const select = (tab, focus) => {
    tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; $(`#${t.getAttribute('aria-controls')}`).hidden = !on; });
    if (focus) tab.focus();
    playLoops();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const k = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: tabs.length - 1 - i }[e.key];
      if (k === undefined) return;
      e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true);
    });
  });
  const openTabFor = id => { const t = tabs.find(x => x.getAttribute('aria-controls') === id); if (t) select(t); };

  /* ---------- horizontal rails (professional work, the scorebook): moved by the visitor, never on their own ---------- */
  const railify = (root, trackSel, currentSel, stepSel, progressSel) => {
    const rail = $(trackSel, root), cards = Array.from(rail.children), current = $(currentSel, root), buttons = $$(stepSel, root), prog = progressSel ? $(progressSel, root) : null;
    const step = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : rail.clientWidth);
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const i = rail.scrollLeft >= max - 2 ? cards.length - 1 : Math.round(rail.scrollLeft / step());
      if (current) current.textContent = String(i + 1);
      if (prog) prog.style.transform = `scaleX(${max > 0 ? Math.max(1 / cards.length, (rail.scrollLeft + rail.clientWidth) / rail.scrollWidth) : 1})`;
      buttons.forEach(b => { const back = Number(b.dataset.railStep ?? b.dataset.reelStep) < 0; b.disabled = back ? rail.scrollLeft <= 2 : rail.scrollLeft >= max - 2; });
    };
    rail.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    addEventListener('resize', update);
    buttons.forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: Number(b.dataset.railStep ?? b.dataset.reelStep) * step(), behavior: motion ? 'smooth' : 'auto' })));
    rail.addEventListener('keydown', e => { if (e.target !== rail) return; const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (d) { e.preventDefault(); rail.scrollBy({ left: d * step(), behavior: motion ? 'smooth' : 'auto' }); } });
    /* a link to a card (e.g. #work-fortiproxy) scrolls the rail to it, not the page sideways */
    update();
    return { rail, cards, toCard: el => { rail.scrollTo({ left: el.offsetLeft - cards[0].offsetLeft, behavior: 'auto' }); update(); } };
  };
  const work = $('[data-rail]');
  const workRail = work ? railify(work, '.rail', '[data-rail-current]', '[data-rail-step]', '.rail-progress span') : null;
  if (workRail) {
    const total = $('[data-rail-total]', work); if (total) total.textContent = String(workRail.cards.length);
    if (motion) { workRail.cards.forEach((c, i) => c.style.setProperty('--i', i)); once(workRail.rail, t => t.classList.add('is-in'), { threshold: .15 }); }
  }
  $$('[data-reel]').forEach(reel => railify(reel, '.reel-track', '[data-reel-current]', '[data-reel-step]'));

  /* ---------- Canterbury: turn the wheel to read the note ---------- */
  const puzzle = $('[data-puzzle]');
  if (puzzle) {
    const plain = puzzle.dataset.plain, shift = Number(puzzle.dataset.shift);
    const out = $('[data-puzzle-out]', puzzle), ctrl = $('.puzzle-ctrl', puzzle), range = $('input', ctrl), shown = $('output', ctrl), status = $('.puzzle-status', puzzle);
    const rot = (s, k) => s.replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0) - 65 + k + 26 * 4) % 26 + 65));
    const cipherText = rot(plain, shift);
    ctrl.hidden = false;
    let solvedOnce = false;
    const render = () => {
      const back = Number(range.value); shown.textContent = String(back);
      const text = rot(cipherText, -back); out.textContent = text;
      const solved = text === plain; out.classList.toggle('is-solved', solved);
      range.setAttribute('aria-valuetext', `Shift back by ${back}: ${text}`);
      if (solved) { status.textContent = 'Solved. A Caesar shift of 7: two thousand years old and broken in seconds.'; if (!solvedOnce) { solvedOnce = true; track('canterbury-puzzle-solved'); } }
      else status.textContent = '';
    };
    range.addEventListener('input', render); render();
  }

  /* ---------- contact: the email button leans toward a nearby pointer (desktop, motion allowed) ---------- */
  const magnet = $('[data-magnetic]');
  if (magnet && motion && finePointer) {
    const area = magnet.closest('.contact-actions'); let raf = 0, tx = 0, ty = 0;
    const apply = () => { raf = 0; magnet.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`; };
    area.addEventListener('pointermove', e => {
      const r = magnet.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy), pull = Math.max(0, 1 - d / 140);
      tx = dx * .18 * pull; ty = dy * .25 * pull; if (!raf) raf = requestAnimationFrame(apply);
    });
    area.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); });
  }

  /* ---------- copy email ---------- */
  const copyBtn = $('#copy-email'), feedback = $('#copy-feedback');
  copyBtn?.addEventListener('click', async () => {
    const email = copyBtn.dataset.email;
    try { await navigator.clipboard.writeText(email); feedback.textContent = 'Email copied to your clipboard.'; track('contact-copy-success'); }
    catch { feedback.textContent = `Copy didn't work here. The address is ${email}.`; }
    setTimeout(() => { feedback.textContent = ''; }, 4000);
  });

  /* ---------- analytics ---------- */
  document.addEventListener('click', e => { const t = e.target instanceof Element ? e.target.closest('[data-track]') : null; if (t) track(t.dataset.track); });
  const contact = $('#contact');
  if (contact && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { track('contact-section-view'); io.disconnect(); } }, { threshold: .4 });
    io.observe(contact);
  }

  /* ---------- deep links: tabs and rail cards open before the page scrolls to them ---------- */
  const resolve = id => {
    if (!id) return null;
    openTabFor(id);
    const el = document.getElementById(id);
    if (el && workRail && workRail.cards.includes(el)) { workRail.toCard(el); workRail.rail.classList.add('is-in'); return work; }
    return el;
  };
  const go = (id, smooth) => { const el = resolve(id); if (el) el.scrollIntoView({ block: 'start', behavior: smooth && motion ? 'smooth' : 'auto' }); };
  document.addEventListener('click', e => {
    const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    history.pushState(null, '', `${location.search}#${id}`);
    go(id, true);
  });
  addEventListener('hashchange', () => setTimeout(() => go(decodeURIComponent(location.hash.slice(1)), false), 60));
  if (location.hash) requestAnimationFrame(() => go(decodeURIComponent(location.hash.slice(1)), false));
})();
