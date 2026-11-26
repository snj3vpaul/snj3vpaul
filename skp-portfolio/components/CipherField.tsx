'use client';
/*
 * The hero's cipher field: a raw WebGL2 fragment shader, no 3D library.
 *
 * Every cell holds one letter of a real message, XORed with a repeating four-byte key; the cell shows one hex
 * nibble of the ciphertext byte. A lens (pointer, finger, or a short scripted pass on load) decrypts the cells under
 * it back into the message. On load a sweep settles the scrambled field left to right.
 *
 * Frames are drawn only while something changes: the sweep, the lens moving, or a resize. Off screen, hidden tab,
 * reduced motion or no WebGL2: no loop at all (reduced motion gets one finished frame; no WebGL keeps the SVG beneath).
 */
import { useEffect, useRef } from 'react';
import { chain, cipherKey } from '@/lib/content';

const GLYPHS = '0123456789abcdefABCDEFGHIJKLMNOPQRSTUVWXYZ →·';
const HEX = 16;
const MESSAGE = chain.map(w => w.toUpperCase()).join(' → ') + ' · ';

const VERT = `#version 300 es
in vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uDpr; uniform float uCell; uniform float uTime; uniform float uSweep;
uniform vec3 uLens; uniform float uLensAmt; uniform vec2 uPar; uniform float uMaskX; uniform float uGlyphs;
uniform sampler2D uAtlas; uniform sampler2D uData; uniform vec2 uDims;
out vec4 outColor;
const vec3 STEEL = vec3(0.498, 0.596, 0.741);
const vec3 TEAL  = vec3(0.361, 0.761, 0.706);
const vec3 AMBER = vec3(0.878, 0.678, 0.384);

float glyphAlpha(float g, vec2 f){
  vec2 uv = vec2((g + clamp(f.x, 0.0, 1.0)) / uGlyphs, clamp(f.y, 0.0, 1.0));
  return texture(uAtlas, uv).a;
}
float rnd(float x){ return fract(sin(x * 91.3458) * 47453.5453); }

vec4 layer(vec2 p, float cell, vec2 off, float far){
  vec2 cs = vec2(cell * 0.66, cell);
  vec2 q = p + off;
  vec2 c = floor(q / cs);
  vec2 f = fract(q / cs);
  vec2 center = (c + 0.5) * cs - off;
  vec4 d = texelFetch(uData, ivec2(mod(c, uDims)), 0);
  float cipherG = floor(d.r * 255.0 + 0.5);
  float plainG  = floor(d.g * 255.0 + 0.5);
  float h = d.b;
  float settledAt = clamp(center.x / uRes.x, 0.0, 1.0) * 0.85 + h * 0.15;
  bool settled = uSweep >= settledAt;
  float scramble = floor(rnd(h * 13.1 + floor(uTime * 14.0)) * 16.0);
  float lens = 0.0;
  if (far < 0.5) {
    float dist = distance(center, uLens.xy);
    lens = (1.0 - smoothstep(uLens.z * 0.55, uLens.z, dist)) * uLensAmt;
  }
  float g; vec3 col; float a;
  if (lens > 0.62) { g = plainG; col = mix(TEAL, AMBER, step(0.5, rnd(h * 3.7)) * 0.0); a = 0.95; }
  else if (lens > 0.18) { g = scramble; col = TEAL; a = 0.55; }
  else if (settled) { g = cipherG; col = STEEL; a = (0.13 + 0.12 * h) * (far > 0.5 ? 0.55 : 1.0); }
  else { g = scramble; col = STEEL; a = 0.32 * (far > 0.5 ? 0.5 : 1.0); }
  if (plainG == 43.0 && lens > 0.62) { col = AMBER; }
  float m = glyphAlpha(g, vec2((f.x - 0.12) / 0.76, (f.y - 0.14) / 0.72));
  return vec4(col, m * a);
}

void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 n = p / uRes;
  float mask = mix(1.0, smoothstep(0.30, 0.62, n.x), uMaskX);
  mask *= smoothstep(0.0, 0.10, n.y) * (1.0 - smoothstep(0.86, 1.0, n.y));
  vec4 far = layer(p, uCell * 1.9, uPar * 0.45 + vec2(7.0, 11.0), 1.0);
  vec4 near = layer(p, uCell, uPar, 0.0);
  float a = near.a + far.a * (1.0 - near.a);
  vec3 col = (near.rgb * near.a + far.rgb * far.a * (1.0 - near.a)) / max(a, 1e-4);
  a *= mask;
  outColor = vec4(col * a, a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
  return s;
}

export default function CipherField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: false, alpha: true, powerPreference: 'low-power' });
    if (!gl) return; // the SVG beneath stays as the visual
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const host = canvas.parentElement!;
    const area = (canvas.closest('.hero') as HTMLElement | null) ?? host; // the whole hero steers the lens, text included
    let disposed = false, raf = 0, visible = true;

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    } catch { return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u = { res: U('uRes'), dpr: U('uDpr'), cell: U('uCell'), time: U('uTime'), sweep: U('uSweep'), lens: U('uLens'), lensAmt: U('uLensAmt'),
      par: U('uPar'), maskX: U('uMaskX'), glyphs: U('uGlyphs'), atlas: U('uAtlas'), data: U('uData'), dims: U('uDims') };
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    /* glyph atlas, drawn with the page's own mono face once it has loaded */
    const atlasTex = gl.createTexture(); const dataTex = gl.createTexture();
    const makeAtlas = () => {
      const tw = 32, th = 48, c = document.createElement('canvas'); c.width = tw * GLYPHS.length; c.height = th;
      const x = c.getContext('2d')!; const fam = getComputedStyle(document.documentElement).getPropertyValue('--font-mono') || 'monospace';
      x.font = `500 34px ${fam}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff';
      [...GLYPHS].forEach((g, i) => x.fillText(g, i * tw + tw / 2, th / 2 + 2));
      gl.bindTexture(gl.TEXTURE_2D, atlasTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    /* the message, encrypted cell by cell: R = ciphertext nibble, G = plaintext glyph, B = per-cell noise */
    let cols = 1, rows = 1;
    const makeData = (w: number, h: number, cell: number) => {
      cols = Math.ceil(w / (cell * 0.66)) + 2; rows = Math.ceil(h / cell) + 2;
      const px = new Uint8Array(cols * rows * 4);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const i = r * cols + c, k = (r * 7 + c) % MESSAGE.length, ch = MESSAGE[k];
        const code = ch === '→' ? 0x3e : ch === '·' ? 0x2e : ch.charCodeAt(0);
        const byte = code ^ cipherKey[(r * 7 + c) % 4];
        const nib = c % 2 === 0 ? byte >> 4 : byte & 15;
        const plain = GLYPHS.indexOf(ch);
        px[i * 4] = nib; px[i * 4 + 1] = plain < 0 ? GLYPHS.indexOf(' ') : plain;
        px[i * 4 + 2] = Math.floor(((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1 * 255); px[i * 4 + 3] = 255;
      }
      gl.bindTexture(gl.TEXTURE_2D, dataTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, px);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    };

    /* state */
    let W = 0, H = 0, dpr = 1, cell = 22, maskX = 1;
    const lens = { x: 0, y: 0, tx: 0, ty: 0, r: 120, amt: 0, tamt: 1 };
    const par = { x: 0, y: 0, tx: 0, ty: 0 };
    let sweep = reduce ? 1 : 0, start = 0, tourUntil = 0, lastMove = 0, userControlled = false;
    const rest = () => ({ x: W * (maskX ? 0.74 : 0.5), y: H * (maskX ? 0.52 : 0.5) });

    const resize = () => {
      const r = host.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      maskX = W >= 768 ? 1 : 0; cell = W >= 768 ? 22 : 18; lens.r = W >= 768 ? 150 : 110;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      makeData(W + 80, H + 80, cell);
      if (!userControlled) { const p = rest(); lens.tx = p.x; lens.ty = p.y; if (reduce || !start) { lens.x = p.x; lens.y = p.y; } }
    };

    const draw = (t: number) => {
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(u.res, W, H); gl.uniform1f(u.dpr, dpr); gl.uniform1f(u.cell, cell); gl.uniform1f(u.time, t / 1000);
      gl.uniform1f(u.sweep, sweep); gl.uniform3f(u.lens, lens.x, lens.y, lens.r); gl.uniform1f(u.lensAmt, lens.amt);
      gl.uniform2f(u.par, par.x, par.y); gl.uniform1f(u.maskX, maskX); gl.uniform1f(u.glyphs, GLYPHS.length);
      gl.uniform2f(u.dims, cols, rows);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, atlasTex); gl.uniform1i(u.atlas, 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, dataTex); gl.uniform1i(u.data, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (t: number) => {
      raf = 0; if (disposed) return;
      if (!start) start = t;
      const el = t - start;
      sweep = Math.min(1, el / 1800);
      if (t < tourUntil && !userControlled) {
        /* the scripted pass on load: the lens drifts in from the right and settles on its resting point */
        const k = 1 - Math.pow(1 - Math.min(1, el / 2200), 3), p = rest();
        lens.tx = p.x + (1 - k) * W * 0.18; lens.ty = p.y - (1 - k) * H * 0.12;
      }
      lens.x += (lens.tx - lens.x) * 0.16; lens.y += (lens.ty - lens.y) * 0.16; lens.amt += (lens.tamt - lens.amt) * 0.08;
      par.x += (par.tx - par.x) * 0.08; par.y += (par.ty - par.y) * 0.08;
      draw(t);
      const busy = sweep < 1 || t < tourUntil || Math.hypot(lens.tx - lens.x, lens.ty - lens.y) > 0.4 || Math.abs(lens.tamt - lens.amt) > 0.01
        || Math.hypot(par.tx - par.x, par.ty - par.y) > 0.05 || t - lastMove < 400;
      if (busy && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && visible && !reduce && !disposed) raf = requestAnimationFrame(frame); };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect(); userControlled = true;
      lens.tx = e.clientX - r.left; lens.ty = e.clientY - r.top; lens.tamt = 1; lastMove = performance.now();
      par.tx = (e.clientX / innerWidth - 0.5) * -18; par.ty = (e.clientY / innerHeight - 0.5) * -12;
      kick();
    };
    const onLeave = () => { userControlled = false; const p = rest(); lens.tx = p.x; lens.ty = p.y; par.tx = 0; par.ty = 0; kick(); };

    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(0); else kick(); });
    const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); });
    const onVis = () => { if (!document.hidden) kick(); };

    (async () => {
      try { await document.fonts.ready; } catch {}
      if (disposed) return;
      makeAtlas(); resize();
      if (reduce) { lens.amt = 1; draw(0); }
      else { lens.amt = 0; tourUntil = performance.now() + 2400; kick(); area.addEventListener('pointermove', onMove); area.addEventListener('pointerdown', onMove); area.addEventListener('pointerleave', onLeave); }
      canvas.dataset.ready = '1';
      ro.observe(host); io.observe(host); document.addEventListener('visibilitychange', onVis);
    })();

    return () => {
      disposed = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      area.removeEventListener('pointermove', onMove); area.removeEventListener('pointerdown', onMove); area.removeEventListener('pointerleave', onLeave);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className="field-canvas" aria-hidden="true" />;
}
