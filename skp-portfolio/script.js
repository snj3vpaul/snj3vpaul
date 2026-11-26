/* Home page behaviour. Everything here is enhancement: the page reads complete without it. */
(() => {
  const doc = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const track = name => { if (typeof window.va === 'function') window.va('event', { name }); };

  /* ---------- the SNJV loader removes itself once the paper has lifted ---------- */
  if (doc.classList.contains('loading')) setTimeout(() => doc.classList.remove('loading'), 3000);

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

  /* ---------- mobile menu: a full page of large links ---------- */
  const menuBtn = $('.menu-toggle'), mobileNav = $('#mobile-nav');
  if (menuBtn && mobileNav) {
    const set = open => {
      menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); mobileNav.hidden = !open; doc.classList.toggle('menu-open', open);
    };
    menuBtn.addEventListener('click', () => set(mobileNav.hidden));
    mobileNav.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileNav.hidden) { set(false); menuBtn.focus(); } });
    matchMedia('(min-width: 1021px)').addEventListener('change', e => { if (e.matches) set(false); });
  }

  /* ---------- progress, glass bar, jump menu, current section ---------- */
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

  /* ---------- parallax: a few layers drift against the scroll, only while on screen ---------- */
  const layers = reduceMotion ? [] : $$('[data-parallax]').map(el => ({ el, f: parseFloat(el.dataset.parallax) || 0, box: el.parentElement }));
  const parallax = () => layers.forEach(({ el, f, box }) => {
    const r = box.getBoundingClientRect();
    if (r.bottom < -200 || r.top > innerHeight + 200) return;
    const lim = el.offsetHeight * .1, y = Math.max(-lim, Math.min(lim, (r.top + r.height / 2 - innerHeight / 2) * f));
    el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  });

  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const max = doc.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    doc.classList.toggle('scrolled', scrollY > 40);
    jump?.classList.toggle('is-on', scrollY > innerHeight * .8);
    let current = null;
    for (const s of chapters) { if (s.offsetParent !== null && s.getBoundingClientRect().top < innerHeight * .4) current = s; }
    if (current && chapterName) chapterName.textContent = current.dataset.chapterName;
    navLinks.forEach(a => a.setAttribute('aria-current', String(!!current && a.getAttribute('href') === `#${current.id}`)));
    parallax();
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll); onScroll();

  /* ---------- section entrances: each block rises once as it arrives ---------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const items = $$('[data-reveal]');
    items.forEach(el => { const sibs = $$(':scope > [data-reveal]', el.parentElement); el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 5) * .08}s`); });
    const show = el => { el.classList.add('is-in'); io.unobserve(el); };
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) show(e.target); }), { rootMargin: '0px 0px -10% 0px', threshold: .05 });
    items.forEach(el => io.observe(el));
    doc.classList.add('reveal');
    document.addEventListener('focusin', e => { const p = e.target instanceof Element ? e.target.closest('[data-reveal]') : null; if (p) { p.style.transitionDuration = '0s'; show(p); } });
    addEventListener('beforeprint', () => items.forEach(show));
  }

  /* ---------- looping recordings: play only while seen; reduced motion keeps the poster ---------- */
  const loops = $$('video[data-loop]');
  const seen = new Set();
  const playLoops = () => loops.forEach(v => {
    const shown = seen.has(v) && v.offsetParent !== null;
    if (shown && !reduceMotion && !document.hidden) { v.play().catch(() => {}); } else { v.pause(); }
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { es.forEach(e => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target))); playLoops(); }, { rootMargin: '120px' });
    loops.forEach(v => io.observe(v));
  }
  document.addEventListener('visibilitychange', () => { doc.classList.toggle('is-hidden-tab', document.hidden); playLoops(); });

  /* ---------- the restoration card ----------
     It downloads a real file (the hero still life, or the résumé on request) and reports the bytes received,
     the speed and the time, as measured here. A cache hit is reported as a cache hit. */
  const card = $('.restore');
  if (card && 'fetch' in window) {
    const photo = $('[data-restore]'), img = $('.hero-img', photo);
    const ring = $('[data-ring]', card), pctEl = $('[data-restore-pct]', card);
    const sizeEl = $('[data-restore-size]', card), speedEl = $('[data-restore-speed]', card), timeEl = $('[data-restore-time]', card);
    const statusEl = $('[data-restore-status]', card), labelEl = $('[data-restore-label]', card), fileEl = $('[data-restore-file]', card);
    const againBtn = $('[data-restore-again]', card), cvLink = $('[data-restore-cv]', card);
    const N = 48, NS = 'http://www.w3.org/2000/svg';
    const dots = Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2, c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', (60 + 52 * Math.cos(a)).toFixed(2)); c.setAttribute('cy', (60 + 52 * Math.sin(a)).toFixed(2)); c.setAttribute('r', '2.3');
      ring.appendChild(c); return c;
    });
    const kb = b => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(b < 102400 ? 1 : 0)} KB` : `${(b / 1048576).toFixed(2)} MB`);
    const rate = bps => (bps >= 1048576 ? `${(bps / 1048576).toFixed(1)} MB/s` : `${Math.max(0, bps / 1024).toFixed(0)} KB/s`);
    const secs = ms => (ms < 1000 ? `${(ms / 1000).toFixed(ms < 10 ? 3 : 2)} s` : `${(ms / 1000).toFixed(1)} s`);
    const draw = (loaded, total, ms) => {
      const p = total ? Math.min(1, loaded / total) : 0, on = Math.round(p * N);
      dots.forEach((d, i) => d.classList.toggle('on', i < on));
      pctEl.textContent = `${Math.round(p * 100)}%`;
      sizeEl.textContent = total ? `${kb(loaded)} / ${kb(total)}` : kb(loaded);
      speedEl.textContent = ms > 0 ? rate(loaded / (ms / 1000)) : '—';
      timeEl.textContent = secs(ms);
    };
    let busy = false;
    const fetchWithProgress = async (url, hint, reload) => {
      const t0 = performance.now();
      const res = await fetch(url, { cache: reload ? 'reload' : 'default' });
      if (!res.ok) throw new Error(res.status);
      const total = Number(res.headers.get('content-length')) || hint || 0;
      const chunks = []; let loaded = 0, frame = 0;
      if (res.body && res.body.getReader) {
        const reader = res.body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value); loaded += value.length;
          if (!frame) frame = requestAnimationFrame(() => { frame = 0; draw(loaded, total, performance.now() - t0); });
        }
      } else { const b = new Uint8Array(await res.arrayBuffer()); chunks.push(b); loaded = b.length; }
      cancelAnimationFrame(frame);
      const ms = performance.now() - t0;
      const entry = performance.getEntriesByName(new URL(url, location.href).href).pop();
      const cached = !!entry && entry.transferSize === 0 && entry.decodedBodySize > 0;
      draw(loaded, loaded, ms);
      return { blob: new Blob(chunks, { type: res.headers.get('content-type') || '' }), loaded, ms, cached };
    };
    const run = async ({ url, hint, label, file, reload, done }) => {
      if (busy) return; busy = true;
      card.dataset.state = 'loading'; labelEl.textContent = label; fileEl.textContent = file;
      againBtn.disabled = true; draw(0, hint, 0); statusEl.textContent = '';
      try {
        const r = await fetchWithProgress(url, hint, reload);
        await done(r);
        card.dataset.state = 'done';
      } catch (err) {
        card.dataset.state = 'error';
        statusEl.textContent = 'The download didn’t finish here, so the page is showing its clean version instead.';
        photo?.classList.add('is-clean');
      }
      busy = false; againBtn.disabled = false;
    };
    const small = matchMedia('(max-width: 640px)').matches;
    const still = { url: photo.dataset[small ? 'srcM' : 'src'], hint: Number(photo.dataset[small ? 'bytesM' : 'bytes']) };
    const restorePhoto = reload => run({
      ...still, reload, label: 'Restoring still life', file: still.url.split('/').pop(),
      done: async r => {
        const u = URL.createObjectURL(r.blob);
        img.src = u; try { await img.decode(); } catch (e) { /* drawn on load */ }
        img.classList.add('is-restored'); photo.classList.remove('is-clean');
        statusEl.textContent = r.cached
          ? `Restored from your browser’s cache in ${secs(r.ms)}. Nothing new to download.`
          : `Restored: ${kb(r.loaded)} arrived in ${secs(r.ms)}.`;
      },
    });
    againBtn.addEventListener('click', () => { img.classList.remove('is-restored'); setTimeout(() => restorePhoto(true), reduceMotion ? 0 : 450); track('restore-again'); });
    cvLink?.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      run({
        url: cvLink.getAttribute('href'), hint: Number(cvLink.dataset.bytes), label: 'Downloading résumé', file: cvLink.getAttribute('download'),
        done: async r => {
          const a = document.createElement('a'); a.href = URL.createObjectURL(r.blob); a.download = cvLink.getAttribute('download');
          document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
          statusEl.textContent = `Résumé saved: ${kb(r.loaded)} in ${secs(r.ms)}${r.cached ? ', from your browser’s cache' : ''}.`;
        },
      });
    });
    img.addEventListener('error', () => { if (img.src.startsWith('blob:')) photo.classList.add('is-clean'); });
    restorePhoto(false);
  } else if (card) {
    const img = $('.hero-img'); img.src = $('[data-restore]').dataset.src; img.classList.add('is-restored');
  }

  /* ---------- cursor, magnetic controls and the work-index preview (fine pointers, motion allowed) ---------- */
  if (finePointer && !reduceMotion) {
    doc.classList.add('has-cursor');
    const cur = $('.cursor'), preview = $('.preview'), pin = $('.preview-inner');
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, px = mx, py = my, raf = 0;
    const loop = () => {
      cx += (mx - cx) * .2; cy += (my - cy) * .2; px += (mx - px) * .12; py += (my - py) * .12;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      preview.style.left = `${px}px`; preview.style.top = `${py}px`;
      raf = Math.abs(mx - cx) + Math.abs(my - cy) + Math.abs(mx - px) + Math.abs(my - py) > .3 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY; cur.classList.remove('is-hidden');
      const t = e.target instanceof Element ? e.target : null;
      cur.classList.toggle('is-view', !!t?.closest('[data-preview]'));
      cur.classList.toggle('is-link', !!t?.closest('a, button, [role="tab"], .reel-track'));
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.add('is-hidden'));
    $$('[data-preview]').forEach(row => {
      row.addEventListener('pointerenter', () => { pin.innerHTML = $('.case-art', row).innerHTML; preview.classList.add('is-on'); });
      row.addEventListener('pointerleave', () => preview.classList.remove('is-on'));
    });
    addEventListener('scroll', () => preview.classList.remove('is-on'), { passive: true });
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * .28).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * .38).toFixed(1)}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
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
  const go = (id, smooth) => { if (id === 'top') { scrollTo({ top: 0, behavior: smooth && !reduceMotion ? 'smooth' : 'auto' }); return; } const el = resolve(id); if (el) el.scrollIntoView({ block: 'start', behavior: smooth && !reduceMotion ? 'smooth' : 'auto' }); };
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
