/* Home page behaviour. Everything here is enhancement: the page reads complete without it. */
(() => {
  const doc = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const track = name => { if (typeof window.va === 'function') window.va('event', { name }); };

  /* ---------- year and the live Ottawa clock ---------- */
  const year = $('#current-year'); if (year) year.textContent = String(new Date().getFullYear());
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hour12: false });
  const clocks = [...$$('[data-clock]'), $('#local-time')].filter(Boolean);
  const footTime = $('.footer-time'); if (footTime) footTime.hidden = false;
  const tick = () => { const t = fmt.format(new Date()); clocks.forEach(c => { c.textContent = t; }); };
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
    const ledger = doc.classList.contains('view-ledger');
    jump?.classList.toggle('is-on', !ledger && scrollY > innerHeight * .8);
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

  /* ---------- ledger view: same facts, read as a status board. State lives in the URL. ---------- */
  const toggle = $('.ledger-toggle');
  const setView = (ledger, push) => {
    doc.classList.toggle('view-ledger', ledger);
    toggle?.setAttribute('aria-pressed', String(ledger));
    if (push) {
      const url = new URL(location.href);
      if (ledger) url.searchParams.set('view', 'ledger'); else url.searchParams.delete('view');
      url.hash = '';
      history.replaceState(null, '', url);
    }
    playLoops(); onScroll();
  };
  setView(doc.classList.contains('view-ledger'), false);
  toggle?.addEventListener('click', () => {
    const ledger = !doc.classList.contains('view-ledger');
    setView(ledger, true);
    const target = ledger ? $('#ledger') : $('#home');
    if (ledger) target?.scrollIntoView({ block: 'start', behavior: 'auto' });
  });
  $$('[data-ledger-exit]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); setView(false, true); scrollTo({ top: 0 }); toggle?.focus(); }));

  /* every anchor resolves in both views: in the ledger, a section id lands on the panel that holds it */
  const resolve = id => {
    if (!id) return null;
    const el = document.getElementById(id);
    if (!doc.classList.contains('view-ledger')) { openTabFor(id); return el; }
    if (el && el.offsetParent !== null && !el.closest('.editorial')) return el;
    return $$('.panel[data-for]').find(p => p.dataset.for.split(' ').includes(id)) || $('#ledger');
  };
  const go = (id, smooth) => { const el = resolve(id); if (el) el.scrollIntoView({ block: 'start', behavior: smooth && !reduceMotion ? 'smooth' : 'auto' }); };
  document.addEventListener('click', e => {
    const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
    if (!a || a.hasAttribute('data-ledger-exit')) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    if (!id) return;
    e.preventDefault();
    history.pushState(null, '', `${location.search}#${id}`);
    go(id, true);
  });
  addEventListener('hashchange', () => go(decodeURIComponent(location.hash.slice(1)), false));
  if (location.hash) requestAnimationFrame(() => go(decodeURIComponent(location.hash.slice(1)), false));

  /* ---------- the fracture: one authored moment ---------- */
  const headline = $('#hero-title');
  if (headline && !reduceMotion) {
    const start = () => import('./fracture.js').then(m => m.mount(headline)).catch(() => {});
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1200 }); else setTimeout(start, 300);
  }
})();
