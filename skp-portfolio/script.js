/* Home page behaviour. Everything here is enhancement: the page reads complete without it. */
(() => {
  const doc = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const track = name => { if (typeof window.va === 'function') window.va('event', { name }); };

  /* ---------- the SNJV loader removes itself once the frost has cleared ---------- */
  if (doc.classList.contains('loading')) setTimeout(() => doc.classList.remove('loading'), 3200);

  /* ---------- year and the live Ottawa clock ---------- */
  const year = $('#current-year'); if (year) year.textContent = String(new Date().getFullYear());
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hour12: false });
  const clocks = [...$$('[data-clock]'), $('#local-time')].filter(Boolean);
  const footTime = $('.footer-time'); if (footTime) footTime.hidden = false;
  /* today's daylight in Ottawa, from the NOAA sunrise equation (45.42°N, 75.70°W): live and true */
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
  tick(); setInterval(tick, 15000);

  /* ---------- mobile menu ---------- */
  const menuBtn = $('.menu-toggle'), mobileNav = $('#mobile-nav');
  if (menuBtn && mobileNav) {
    const set = open => { menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.classList.toggle('is-open', open); menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); mobileNav.hidden = !open; };
    menuBtn.addEventListener('click', () => set(mobileNav.hidden));
    mobileNav.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileNav.hidden) { set(false); menuBtn.focus(); } });
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
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const max = doc.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    jump?.classList.toggle('is-on', scrollY > innerHeight * .8);
    let current = null;
    for (const s of chapters) { if (s.offsetParent !== null && s.getBoundingClientRect().top < innerHeight * .4) current = s; }
    if (current && chapterName) chapterName.textContent = current.dataset.chapterName;
    navLinks.forEach(a => a.setAttribute('aria-current', String(!!current && a.getAttribute('href') === `#${current.id}`)));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll); onScroll();

  /* ---------- hero figure: the protected figure, or the module boundary ---------- */
  const fig = $('.hero-figure');
  $$('.fig-switch button').forEach(b => b.addEventListener('click', () => {
    fig.dataset.view = b.dataset.fig;
    $$('.fig-switch button').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    playLoops();
  }));

  /* ---------- looping recordings: play only while seen; reduced motion keeps the poster ---------- */
  const loops = $$('video[data-loop]');
  const seen = new Set();
  const playLoops = () => loops.forEach(v => {
    const shown = seen.has(v) && v.offsetParent !== null && !(v.classList.contains('fig-pane--guy') && fig?.dataset.view === 'boundary');
    if (shown && !reduceMotion && !document.hidden) { v.play().catch(() => {}); } else { v.pause(); }
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { es.forEach(e => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target))); playLoops(); }, { rootMargin: '120px' });
    loops.forEach(v => io.observe(v));
  }
  document.addEventListener('visibilitychange', () => { doc.classList.toggle('is-hidden-tab', document.hidden); playLoops(); });


  /* ---------- the orbit: evidence turning slowly around the figure ---------- */
  const stage = $('[data-orbit]');
  if (stage) {
    const ring = $('.orbit', stage), cards = $$('.card', ring);
    const base = cards.map(c => parseFloat(getComputedStyle(c).getPropertyValue('--a')) || 0);
    const DEG_PER_S = 3.6;                       // one turn every 100 s: calm, never busy
    let spin = 0, last = 0, raf = 0, seen = true, tx = -9, ty = 0, px = 0, py = 0;
    const depth = () => cards.forEach((c, i) => {
      const z = Math.cos((base[i] + spin) * Math.PI / 180);   // 1 = nearest the viewer, -1 = behind the figure
      c.style.opacity = (.86 + .14 * (z + 1) / 2).toFixed(3);
    });
    const frame = now => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) / 1000 : 0; last = now;
      spin = (spin + dt * DEG_PER_S) % 360;
      tx += ((-9 + py * 5) - tx) * .06; ty += ((px * 7) - ty) * .06;
      ring.style.setProperty('--spin', `${spin.toFixed(2)}deg`);
      ring.style.setProperty('--tx', `${tx.toFixed(2)}deg`);
      ring.style.setProperty('--ty', `${ty.toFixed(2)}deg`);
      depth();
      if (seen && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && seen && !document.hidden && !reduceMotion) { last = 0; raf = requestAnimationFrame(frame); } };
    depth();
    if (!reduceMotion) {
      new IntersectionObserver(es => { seen = es[0].isIntersecting; start(); }).observe(stage);
      document.addEventListener('visibilitychange', start);
      $('#home').addEventListener('pointermove', e => { px = e.clientX / innerWidth - .5; py = e.clientY / innerHeight - .5; }, { passive: true });
      start();
    }
  }

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
  /* a link straight to #forkcast, #fabric or #lab opens that tab */
  const openTabFor = id => { const t = tabs.find(x => x.getAttribute('aria-controls') === id); if (t) select(t); };

  /* ---------- the scorebook: moved by the visitor, never on its own ---------- */
  $$('[data-reel]').forEach(reel => {
    const rail = $('.reel-track', reel), cards = Array.from(rail.children), current = $('[data-reel-current]', reel), buttons = $$('[data-reel-step]', reel);
    const step = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : rail.clientWidth);
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const i = rail.scrollLeft >= max - 2 ? cards.length - 1 : Math.round(rail.scrollLeft / step());
      if (current) current.textContent = String(i + 1);
      buttons.forEach(b => { b.disabled = Number(b.dataset.reelStep) < 0 ? rail.scrollLeft <= 2 : rail.scrollLeft >= max - 2; });
    };
    rail.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    addEventListener('resize', update);
    buttons.forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: Number(b.dataset.reelStep) * step(), behavior: reduceMotion ? 'auto' : 'smooth' })));
    rail.addEventListener('keydown', e => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (d) { e.preventDefault(); rail.scrollBy({ left: d * step() }); } });
    update();
  });

  /* ---------- hello, in a few languages ---------- */
  const helloWord = $('#hello-word'), helloOrigin = $('#hello-origin'), cipher = $('#cipher-code');
  const greetings = [['Hello', 'English'], ['Bonjour', 'French'], ['नमस्ते', 'Hindi'], ['ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'Punjabi'], ['নমস্কার', 'Bengali']];
  if (helloWord && helloOrigin && cipher && !reduceMotion) {
    const enc = new TextEncoder(); let i = 0;
    setInterval(() => {
      if (document.hidden) return;
      helloWord.classList.add('is-fading');
      setTimeout(() => {
        i = (i + 1) % greetings.length;
        const [word, lang] = greetings[i];
        helloWord.textContent = word; helloOrigin.textContent = lang;
        cipher.textContent = Array.from(enc.encode(word), b => b.toString(16).padStart(2, '0')).join(' ');
        helloWord.classList.remove('is-fading');
      }, 260);
    }, 2800);
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

  /* a link to #forkcast, #fabric or #lab opens that tab before scrolling to it */
  const resolve = id => { if (!id) return null; openTabFor(id); return document.getElementById(id); };
  const go = (id, smooth) => { const el = resolve(id); if (el) el.scrollIntoView({ block: 'start', behavior: smooth && !reduceMotion ? 'smooth' : 'auto' }); };
  document.addEventListener('click', e => {
    const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    if (!id) return;
    e.preventDefault();
    history.pushState(null, '', `${location.search}#${id}`);
    go(id, true);
  });
  addEventListener('hashchange', () => go(decodeURIComponent(location.hash.slice(1)), false));
  if (location.hash) requestAnimationFrame(() => go(decodeURIComponent(location.hash.slice(1)), false));

})();
