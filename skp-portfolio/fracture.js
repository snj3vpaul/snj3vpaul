/*
 * The fracture. The headline is set in HTML (readable, selectable, works without JS); this module
 * lays pre-cut glass shards of the same words exactly over it, then on a slow cycle cracks it at
 * "trade.", lets it fall apart, and stands it back up. The pointer pushes nearby shards aside.
 *
 * Shards are cut at build time (tools/shards/bake.py → img/shards.webp + shards.js). Atlas pixels:
 * A = glyph coverage, R = 255 on a crack edge and 0 on the body.
 * Renderer: WebGPU instanced quads when available, otherwise Canvas 2D sprites. One canvas, one
 * rAF loop, idle while the headline holds, paused when the tab is hidden or the hero is off screen.
 */
import { atlasUrl, map } from './shards.js';

const HOLD = 5200, CRACK = 450, BREAK = 1300, DRIFT = 700, REFORM = 1500, FIRST = 1400;
const ACTIVE = CRACK + BREAK + DRIFT + REFORM;
const HI = [0.93, 0.68, 0.36]; // warm highlight along the cracks

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = t => t * t * (3 - 2 * t);
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
function prng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* How far apart the glass is at a given moment of the cycle: P in 0..1, crack glow in 0..1. */
function phase(tau) {
  if (tau < 0 || tau >= ACTIVE) return { P: 0, crack: 0 };
  if (tau < CRACK) return { P: 0, crack: smooth(tau / CRACK) };
  if (tau < CRACK + BREAK) return { P: .86 * smooth((tau - CRACK) / BREAK), crack: 1 };
  if (tau < CRACK + BREAK + DRIFT) return { P: .86 + .14 * Math.sin((tau - CRACK - BREAK) / DRIFT * Math.PI / 2), crack: 1 };
  const r = (tau - CRACK - BREAK - DRIFT) / REFORM;
  return { P: 1 - smooth(r), crack: 1 - smooth(clamp((r - .55) / .45)) };
}

export async function mount(h1) {
  if (!h1 || h1.dataset.fracture) return;
  h1.dataset.fracture = 'on';
  await document.fonts.ready;
  const img = new Image(); img.src = atlasUrl.href; img.decoding = 'async';
  await img.decode();

  /* split each line into word spans so shards follow the real layout, wrapped or not */
  const words = [];
  h1.querySelectorAll('.ln').forEach(ln => {
    const parts = ln.textContent.trim().split(/\s+/);
    ln.textContent = '';
    parts.forEach((t, i) => { const s = document.createElement('span'); s.className = 'w'; s.textContent = t; ln.appendChild(s); if (i < parts.length - 1) ln.appendChild(document.createTextNode(' ')); words.push(s); });
  });
  if (words.length !== map.words.length || words.some((w, i) => w.textContent !== map.words[i].t)) return; // copy changed: re-run the baker

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  h1.appendChild(canvas);

  /* one record per shard; positions are filled in by layout() */
  const rnd = prng(20261125);
  const shards = [];
  map.words.forEach((w, wi) => w.shards.forEach(([x, y, sw, sh, u, v]) => shards.push({ wi, x, y, sw, sh, u, v, r1: rnd(), r2: rnd(), r3: rnd(), hx: 0, hy: 0, n: 0, ux: 0, uy: 0, dim: w.line === 2, ox: 0, oy: 0, vx: 0, vy: 0 })));

  let W = 0, H = 0, dpr = 1, em = 1, bleedX = 0, bleedY = 0, narrow = false;
  const layout = () => {
    const cs = getComputedStyle(h1);
    em = parseFloat(cs.fontSize); narrow = innerWidth < 640;
    bleedX = em * 1.1; bleedY = em * 1.4;
    const box = h1.getBoundingClientRect();
    W = box.width + bleedX * 2; H = box.height + bleedY * 2;
    dpr = Math.min(2, devicePixelRatio || 1);
    Object.assign(canvas.style, { left: `${-bleedX}px`, top: `${-bleedY}px`, width: `${W}px`, height: `${H}px` });
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const s = em / map.size;
    const rects = words.map(w => w.getBoundingClientRect());
    let ix = 0, iy = 0;
    map.words.forEach((w, i) => {
      if (!w.impact) return;
      const r = rects[i], base = r.top + (r.height + w.A * s - w.D * s) / 2;
      ix = r.left - box.left + bleedX + (w.impact[0] - map.pad) * s;
      iy = base - box.top + bleedY + (w.impact[1] - map.pad - w.A) * s;
    });
    const maxD = em * 9;
    for (const p of shards) {
      const w = map.words[p.wi], r = rects[p.wi], base = r.top + (r.height + w.A * s - w.D * s) / 2;
      p.hw = p.sw * s / 2; p.hh = p.sh * s / 2;
      p.hx = r.left - box.left + bleedX + (p.x - map.pad) * s + p.hw;
      p.hy = base - box.top + bleedY + (p.y - map.pad - w.A) * s + p.hh;
      const dx = p.hx - ix, dy = p.hy - iy, d = Math.hypot(dx, dy) || 1;
      p.n = clamp(d / maxD); p.ux = dx / d; p.uy = dy / d;
    }
  };

  /* where a shard is drawn this frame */
  const pose = (p, P) => {
    let t = smooth(clamp(P * 1.7 - p.n * .95));
    if (narrow) t *= p.dim ? .18 : .8;
    const push = t * (.08 + .3 * p.r1) * em * (1.1 - p.n * .5);
    return {
      x: p.hx + p.ux * push * .62 + p.ox,
      y: p.hy + p.uy * push * .5 + t * t * .22 * em * p.r3 + p.oy,
      rot: (p.r1 - .5) * .5 * t + (p.ox - p.oy) / em * .25,
      scale: 1 + t * .06 * p.r2,
      alpha: 1 - t * (.15 + .35 * p.r3),
    };
  };

  /* pointer: shards near it are pushed away and spring back */
  let px = -1e5, py = -1e5, lastMove = 0;
  const springs = () => {
    let moving = false;
    const R = em * 1.25;
    for (const p of shards) {
      const dx = p.hx + p.ox - px, dy = p.hy + p.oy - py, d = Math.hypot(dx, dy);
      let tx = 0, ty = 0;
      if (d < R && d > .01) { const f = (1 - d / R) ** 2 * em * .38; tx = dx / d * f; ty = dy / d * f; }
      p.vx = (p.vx + (tx - p.ox) * .14) * .78; p.vy = (p.vy + (ty - p.oy) * .14) * .78;
      p.ox += p.vx; p.oy += p.vy;
      if (Math.abs(p.vx) + Math.abs(p.vy) > .02 || Math.abs(p.ox) + Math.abs(p.oy) > .05) moving = true;
    }
    return moving;
  };

  const ink = hex('#efe9df'), dim = hex('#948b80');
  layout();
  const restPose = p => pose(p, 0);
  const renderer = (await gpuRenderer(canvas, img, shards, restPose, ink, dim).catch(() => null)) || cpuRenderer(canvas, img, ink, dim);

  const draw = (P, crack) => renderer.draw(shards, p => pose(p, P), crack, W, H, dpr, ink, dim);

  /* ---------- the loop ---------- */
  let raf = 0, visible = true, onScreen = true, cycleStart = performance.now() - HOLD + FIRST, lastP = -1;
  const frame = now => {
    raf = 0;
    const tau = (now - cycleStart) - HOLD;
    if (tau >= ACTIVE) cycleStart = now;
    const { P, crack } = phase(tau);
    const moving = springs();
    if (P > 0 || crack > 0 || moving || P !== lastP) draw(P, crack);
    lastP = P;
    if (!visible || !onScreen) return;
    if (P > 0 || crack > 0 || moving || now - lastMove < 300) { raf = requestAnimationFrame(frame); return; }
    /* holding: nothing moves, so sleep until the next break or the pointer comes back */
    const wait = Math.max(16, HOLD - (now - cycleStart));
    timer = setTimeout(() => { timer = 0; kick(); }, wait);
  };
  let timer = 0;
  const kick = () => { if (!raf && visible && onScreen) { clearTimeout(timer); timer = 0; raf = requestAnimationFrame(frame); } };

  layout(); draw(0, 0);
  h1.classList.add('is-cast');
  kick();

  new ResizeObserver(() => { layout(); draw(0, 0); kick(); }).observe(h1);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) { cycleStart = performance.now() - HOLD + 600; kick(); } });
  new IntersectionObserver(es => { onScreen = es[0].isIntersecting; if (onScreen) kick(); }).observe(h1);
  const stage = h1.closest('.hero') || h1;
  stage.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; lastMove = performance.now(); kick(); }, { passive: true });
  stage.addEventListener('pointerleave', () => { px = py = -1e5; lastMove = performance.now(); kick(); });
  /* the visitor's own preference wins, even mid-visit */
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => { if (e.matches) { cancelAnimationFrame(raf); clearTimeout(timer); canvas.remove(); h1.classList.remove('is-cast'); visible = false; } });
  h1.dataset.renderer = renderer.kind;
}

/* ---------- Canvas 2D: pre-tinted copies of the atlas, plain and with lit crack edges ---------- */
function cpuRenderer(canvas, img, ink, dim) {
  const ctx = canvas.getContext('2d');
  const [aw, ah] = map.atlas;
  const src = document.createElement('canvas'); src.width = aw; src.height = ah;
  const sx = src.getContext('2d', { willReadFrequently: true }); sx.drawImage(img, 0, 0);
  const data = sx.getImageData(0, 0, aw, ah).data;
  const tint = (rgb, lit) => {
    const c = document.createElement('canvas'); c.width = aw; c.height = ah;
    const cx = c.getContext('2d'), out = cx.createImageData(aw, ah), o = out.data;
    for (let i = 0; i < data.length; i += 4) {
      const edge = data[i] > 127, col = lit && edge ? HI : rgb;
      o[i] = col[0] * 255; o[i + 1] = col[1] * 255; o[i + 2] = col[2] * 255; o[i + 3] = lit ? (edge ? data[i + 3] : 0) : data[i + 3];
    }
    cx.putImageData(out, 0, 0); return c;
  };
  const sheets = { ink: tint(ink, false), dim: tint(dim, false), inkLit: tint(ink, true), dimLit: tint(dim, true) };
  return {
    kind: 'canvas2d',
    draw(shards, poseOf, crack, W, H, dpr) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of shards) {
        const q = poseOf(p);
        ctx.setTransform(dpr * q.scale * Math.cos(q.rot), dpr * q.scale * Math.sin(q.rot), -dpr * q.scale * Math.sin(q.rot), dpr * q.scale * Math.cos(q.rot), q.x * dpr, q.y * dpr);
        ctx.globalAlpha = q.alpha;
        ctx.drawImage(p.dim ? sheets.dim : sheets.ink, p.u, p.v, p.sw, p.sh, -p.hw, -p.hh, p.hw * 2, p.hh * 2);
        if (crack > 0) { ctx.globalAlpha = q.alpha * crack; ctx.drawImage(p.dim ? sheets.dimLit : sheets.inkLit, p.u, p.v, p.sw, p.sh, -p.hw, -p.hh, p.hw * 2, p.hh * 2); }
      }
      ctx.globalAlpha = 1;
    },
  };
}

/* ---------- WebGPU: every shard is one instanced quad ---------- */
const WGSL = /* wgsl */`
struct U { res: vec2f, crack: f32, pad: f32, hi: vec4f };
@group(0) @binding(0) var<uniform> u: U;
@group(0) @binding(1) var samp: sampler;
@group(0) @binding(2) var tex: texture_2d<f32>;
struct I { @location(0) a: vec4f, @location(1) b: vec4f, @location(2) uv: vec4f, @location(3) tint: vec4f };
struct V { @builtin(position) pos: vec4f, @location(0) uv: vec2f, @location(1) tint: vec3f, @location(2) alpha: f32 };
@vertex fn vs(@builtin(vertex_index) vi: u32, i: I) -> V {
  var corners = array<vec2f, 6>(vec2f(-1, -1), vec2f(1, -1), vec2f(-1, 1), vec2f(-1, 1), vec2f(1, -1), vec2f(1, 1));
  let c = corners[vi];
  let rot = i.b.x; let sc = i.b.y;
  let l = c * i.a.zw * sc;
  let p = i.a.xy + vec2f(l.x * cos(rot) - l.y * sin(rot), l.x * sin(rot) + l.y * cos(rot));
  var o: V;
  o.pos = vec4f(p / u.res * 2.0 - 1.0, 0.0, 1.0) * vec4f(1, -1, 1, 1);
  o.uv = mix(i.uv.xy, i.uv.zw, (c + 1.0) * 0.5);
  o.tint = i.tint.rgb; o.alpha = i.b.z;
  return o;
}
@fragment fn fs(v: V) -> @location(0) vec4f {
  let s = textureSample(tex, samp, v.uv);
  let edge = step(0.5, s.r);
  let col = mix(v.tint, u.hi.rgb, edge * u.crack);
  let a = s.a * v.alpha;
  return vec4f(col * a, a);
}`;

async function gpuRenderer(canvas, img, shards, restPose, ink, dim) {
  const count = shards.length;
  if (!navigator.gpu) return null;
  const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'low-power' });
  if (!adapter) return null;
  const device = await adapter.requestDevice();
  const format = navigator.gpu.getPreferredCanvasFormat();
  device.pushErrorScope('validation');

  const bmp = await createImageBitmap(img, { premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
  const [aw, ah] = map.atlas;
  const tex = device.createTexture({ size: [aw, ah], format: 'rgba8unorm', usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT });
  device.queue.copyExternalImageToTexture({ source: bmp }, { texture: tex, premultipliedAlpha: false }, [aw, ah]);

  const mod = device.createShaderModule({ code: WGSL });
  const STRIDE = 16 * 4;
  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: { module: mod, entryPoint: 'vs', buffers: [{ arrayStride: STRIDE, stepMode: 'instance', attributes: [0, 1, 2, 3].map(i => ({ shaderLocation: i, offset: i * 16, format: 'float32x4' })) }] },
    fragment: { module: mod, entryPoint: 'fs', targets: [{ format, blend: { color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' }, alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' } } }] },
    primitive: { topology: 'triangle-list' },
  });
  const ubuf = device.createBuffer({ size: 32, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  const ibuf = device.createBuffer({ size: count * STRIDE, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST });
  const bind = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [
    { binding: 0, resource: { buffer: ubuf } },
    { binding: 1, resource: device.createSampler({ magFilter: 'linear', minFilter: 'linear' }) },
    { binding: 2, resource: tex.createView() },
  ] });
  const inst = new Float32Array(count * 16), uni = new Float32Array(8);
  let lost = false;
  device.lost.then(() => { lost = true; });
  device.addEventListener('uncapturederror', e => { console.warn('fracture/webgpu:', e.error?.message); });
  const encode = (shards, poseOf, crack, dpr, view) => {
    shards.forEach((p, k) => {
      const q = poseOf(p), o = k * 16, t = p.dim ? dim : ink;
      inst.set([q.x * dpr, q.y * dpr, p.hw * dpr, p.hh * dpr, q.rot, q.scale, q.alpha, 0, p.u / aw, p.v / ah, (p.u + p.sw) / aw, (p.v + p.sh) / ah, t[0], t[1], t[2], 1], o);
    });
    uni.set([canvas.width, canvas.height, crack, 0, HI[0], HI[1], HI[2], 1]);
    device.queue.writeBuffer(ubuf, 0, uni);
    device.queue.writeBuffer(ibuf, 0, inst);
    const enc = device.createCommandEncoder();
    const pass = enc.beginRenderPass({ colorAttachments: [{ view, loadOp: 'clear', clearValue: { r: 0, g: 0, b: 0, a: 0 }, storeOp: 'store' }] });
    pass.setPipeline(pipeline); pass.setBindGroup(0, bind); pass.setVertexBuffer(0, ibuf); pass.draw(6, count);
    pass.end();
    return enc;
  };

  /* prove it before taking the canvas (once it is a WebGPU canvas, 2D can't have it): the pipeline
     must compile, and a small offscreen render of the resting headline must actually put ink down */
  const err = await device.popErrorScope();
  if (err) { device.destroy(); return null; }
  const tw = 256, th = Math.max(8, Math.round(256 * canvas.height / canvas.width)), row = tw * 4;
  const probe = device.createTexture({ size: [tw, th], format, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC });
  const read = device.createBuffer({ size: row * th, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
  const enc = encode(shards, restPose, 0, Math.min(2, devicePixelRatio || 1), probe.createView());
  enc.copyTextureToBuffer({ texture: probe }, { buffer: read, bytesPerRow: row }, [tw, th]);
  device.queue.submit([enc.finish()]);
  await read.mapAsync(GPUMapMode.READ);
  const px = new Uint8Array(read.getMappedRange());
  let inked = 0; for (let i = 3; i < px.length; i += 4) if (px[i] > 40) inked++;
  read.unmap(); read.destroy(); probe.destroy();
  if (inked < 200) { device.destroy(); return null; }

  const ctx = canvas.getContext('webgpu');
  if (!ctx) { device.destroy(); return null; }
  ctx.configure({ device, format, alphaMode: 'premultiplied' });

  return {
    kind: 'webgpu',
    draw(shards, poseOf, crack, W, H, dpr) {
      if (lost) return;
      device.queue.submit([encode(shards, poseOf, crack, dpr, ctx.getCurrentTexture().createView()).finish()]);
    },
  };
}
