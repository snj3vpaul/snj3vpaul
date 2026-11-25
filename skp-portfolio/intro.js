/*
 * Intro — "One job title. Many innings."
 *
 * A small studio, rendered live: a new cricket ball in the key light, a steel padlock
 * catching the rim light behind it, a bat turning in the foreground and a cryptographic
 * module drifting out of focus. Everything is raymarched in one fragment shader, so
 * there are no models or textures to download (this file is the whole scene).
 *
 * Exit: the padlock's shackle lifts, the pieces scatter past the camera, and the frame
 * flashes into the site's stone colour, so the dark intro hands over to the light page
 * without a seam.
 *
 * Runs once per visit (the head script adds .is-intro). With reduced motion it renders a
 * single still frame and leaves quickly. Without WebGL, the type sits on a lit backdrop.
 */
(() => {
  'use strict';
  const root = document.documentElement;
  const intro = document.getElementById('intro');
  if (!intro || !root.classList.contains('is-intro')) { intro?.remove(); return; }

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = intro.querySelector('.intro-canvas');
  const status = intro.querySelector('.intro-status');
  const go = intro.querySelector('.intro-go');
  const start = performance.now();
  const MIN_SHOW = reduceMotion ? 1400 : 6000;   // long enough to land the line; "Step inside" skips
  const EXIT_MS = reduceMotion ? 400 : 1500;

  /* ---------- headline: split into characters for the reveal (screen readers get the plain line) ---------- */
  intro.querySelectorAll('[data-split]').forEach(line => {
    const text = line.textContent;
    line.setAttribute('aria-hidden', 'true');
    line.textContent = '';
    let i = Number(line.dataset.split) || 0;
    text.split(' ').forEach((word, w, words) => {
      const ws = document.createElement('span');
      ws.className = 'iw';
      for (const ch of word) {
        const c = document.createElement('span');
        c.className = 'ic';
        c.textContent = ch;
        c.style.setProperty('--i', i++);
        ws.appendChild(c);
      }
      line.appendChild(ws);
      if (w < words.length - 1) line.appendChild(document.createTextNode(' '));
    });
  });

  /* ---------- the page behind is inert while the intro is up ---------- */
  let behind = [];
  const lockPage = () => {
    behind = Array.from(document.body.children).filter(el => el !== intro && el.tagName !== 'SCRIPT');
    behind.forEach(el => { el.inert = true; });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lockPage, { once: true });
  else lockPage();

  /* ---------- WebGL ---------- */
  const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime, uDist, uShift, uYaw, uPitch, uExit, uUnlock, uFade;
uniform vec3 uP0, uP1, uP2, uP3;
uniform mat3 uR0, uR1, uR2, uR3;
uniform float uS0, uS1, uS2, uS3;

const vec3 SITE = vec3(0.918, 0.898, 0.863);   /* #eae5dc, the page underneath */

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float hash3(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float noise(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(mix(hash3(i), hash3(i+vec3(1,0,0)), f.x), mix(hash3(i+vec3(0,1,0)), hash3(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(hash3(i+vec3(0,0,1)), hash3(i+vec3(1,0,1)), f.x), mix(hash3(i+vec3(0,1,1)), hash3(i+vec3(1,1,1)), f.x), f.y), f.z);
}
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float sdBox(vec3 p, vec3 b, float r){ vec3 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.) - r; }
float sdCapsule(vec3 p, vec3 a, vec3 b, float r){ vec3 pa = p-a, ba = b-a; float h = clamp(dot(pa,ba)/dot(ba,ba), 0., 1.); return length(pa - ba*h) - r; }
float sdEllipsoid(vec3 p, vec3 r){ float k0 = length(p/r); float k1 = length(p/(r*r)); return k0*(k0-1.)/k1; }
float smin(float a, float b, float k){ float h = clamp(.5+.5*(b-a)/k, 0., 1.); return mix(b, a, h) - k*h*(1.-h); }

/* ---- the cricket ball: raised seam, two rows of stitching ---- */
float ball(vec3 q){
  float d = length(q) - 1.;
  float ay = abs(q.y);
  d -= .016 * smoothstep(.07, .035, ay);
  float a = atan(q.z, q.x);
  d -= .007 * smoothstep(.022, .0, abs(ay - .092)) * smoothstep(.2, .9, cos(a * 96.));
  d += .004 * smoothstep(.012, .0, ay);              /* the groove down the middle of the seam */
  return d;
}
/* ---- the padlock: body with a keyhole, and a shackle that lifts on exit ---- */
float lockBody(vec3 q){
  float b = sdBox(q - vec3(0., -.15, 0.), vec3(.62, .5, .27), .11);
  vec3 k = q - vec3(0., -.08, .27);
  float kh = min(length(k.xy) - .09, sdBox(k - vec3(0., -.17, 0.), vec3(.038, .15, 1.), 0.));
  kh = max(kh, -k.z - .08);
  return max(b, -kh);
}
float shackle(vec3 q){
  vec3 c = q - vec3(0., .38 + .26*uUnlock, 0.);
  c.x += .4; c.xz = rot(-uUnlock * 1.9) * c.xz; c.x -= .4;
  float R = .4, r = .088, d;
  if (c.y > 0.) d = length(vec2(length(c.xy) - R, c.z)) - r;
  else d = length(vec2(abs(c.x) - R, c.z)) - r;
  return max(d, -(c.y + .55 - .26*uUnlock));
}
/* ---- the bat: blade with a spine, splice, and a gripped handle ---- */
float bat(vec3 q){
  float blade = sdBox(q - vec3(0., -.05, 0.), vec3(.24, 1., .04), .035);
  float spine = sdEllipsoid(q - vec3(0., -.25, -.035), vec3(.15, .82, .085));
  float d = smin(blade, spine, .06);
  d = smin(d, sdEllipsoid(q - vec3(0., .92, 0.), vec3(.12, .12, .065)), .08);   /* shoulders into splice */
  return min(d, sdCapsule(q, vec3(0., .95, 0.), vec3(0., 1.78, 0.), .072));
}
/* ---- the module: a square package with gull-wing pins ---- */
float chip(vec3 q){
  float body = sdBox(q, vec3(.5, .065, .5), .03);
  vec3 a = q; a.x -= .125 * clamp(floor(a.x/.125 + .5), -3., 3.);
  vec3 b = vec3(a.x, q.y, abs(q.z) - .58);
  float pins = sdBox(b, vec3(.028, .016, .08), .008);
  pins = min(pins, sdBox(vec3(a.x, q.y + .055, abs(q.z) - .655), vec3(.028, .06, .016), .008));
  vec3 c = q; c.z -= .125 * clamp(floor(c.z/.125 + .5), -3., 3.);
  pins = min(pins, sdBox(vec3(abs(q.x) - .58, q.y, c.z), vec3(.08, .016, .028), .008));
  pins = min(pins, sdBox(vec3(abs(q.x) - .655, q.y + .055, c.z), vec3(.016, .06, .028), .008));
  return min(body, pins);
}

/* scene: x = distance, y = material id */
vec2 map(vec3 p){
  vec2 res = vec2(1e5, 0.);
  vec3 q; float d, bd;
  q = p - uP0; bd = length(q) - 1.08*uS0;
  if (bd > .25) res = vec2(bd, 0.); else { q = (q * uR0) / uS0; res = vec2(ball(q) * uS0, 1.); }

  q = p - uP1; bd = length(q) - 1.35*uS1;
  if (bd > .25) d = bd; else { q = (q * uR1) / uS1; d = lockBody(q) * uS1; float s = shackle(q) * uS1; if (s < d) { if (s < res.x) res = vec2(s, 3.); } }
  if (d < res.x) res = vec2(d, 2.);

  q = p - uP2; bd = length(q - vec3(0.)) - 1.9*uS2;
  if (bd > .25) d = bd; else { q = (q * uR2) / uS2; d = bat(q) * uS2; }
  if (d < res.x) res = vec2(d, 4.);

  q = p - uP3; bd = length(q) - .95*uS3;
  if (bd > .25) d = bd; else { q = (q * uR3) / uS3; d = chip(q) * uS3; }
  if (d < res.x) res = vec2(d, 5.);
  return res;
}
vec3 normalAt(vec3 p){
  const vec2 e = vec2(.0012, -.0012);
  return normalize(e.xyy*map(p+e.xyy).x + e.yyx*map(p+e.yyx).x + e.yxy*map(p+e.yxy).x + e.xxx*map(p+e.xxx).x);
}
float shadow(vec3 ro, vec3 rd){
  float res = 1., t = .02;
  for (int i = 0; i < 28; i++) {
    float h = map(ro + rd*t).x;
    res = min(res, 9.*h/t);
    t += clamp(h, .03, .35);
    if (res < .01 || t > 6.) break;
  }
  return clamp(res, 0., 1.);
}
float occlusion(vec3 p, vec3 n){
  float o = 0., s = 1.;
  for (int i = 1; i <= 4; i++) { float h = .04 * float(i); o += (h - map(p + n*h).x) * s; s *= .7; }
  return clamp(1. - 2.2*o, 0., 1.);
}

/* the studio: a big warm softbox up left, a cool strip behind right, a bounce card below */
const vec3 KEY = vec3(-.55, .66, .52);
const vec3 RIM = vec3(.86, .16, -.48);
const vec3 BOUNCE = vec3(.08, -.92, .38);
vec3 studio(vec3 r, float rough){
  float w = mix(.015, .35, rough);
  float e = 1. / (1. + rough * rough * 40.);      /* rougher surfaces spread the same light thinner */
  vec3 c = vec3(.004, .0038, .0035);
  c += vec3(1., .87, .74) * 7. * e * smoothstep(.955 - w, .985, dot(r, normalize(KEY)));
  c += vec3(1., .87, .74) * .9 * smoothstep(.3, .9, rough) * smoothstep(.75 - w, .95, dot(r, normalize(KEY)));
  c += vec3(.4, .66, 1.) * 5. * e * smoothstep(.965 - w, .99, dot(r, normalize(RIM)));
  c += vec3(.4, .66, 1.)   * .9  * smoothstep(.07 + w, 0., abs(r.y - .1)) * smoothstep(.3, .9, r.x);
  c += vec3(1., .94, .86) * 1.3 * mix(1., e, .8) * smoothstep(.86 - w, .975, dot(r, normalize(BOUNCE)));
  c += vec3(.9, .7, .5)    * .015 * (r.y * .5 + .5);
  return c;
}

struct Mat { vec3 alb; float metal; float rough; float coat; };

Mat material(vec3 p, float id, inout vec3 n){
  Mat m; m.alb = vec3(.5); m.metal = 0.; m.rough = .5; m.coat = 0.;
  if (id < 1.5) {                                   /* ball */
    vec3 q = ((p - uP0) * uR0) / uS0;
    float ay = abs(q.y), a = atan(q.z, q.x);
    float grain = noise(q*22.) * .6 + noise(q*60.) * .4;
    m.alb = vec3(.24, .011, .008) * (.75 + .45*grain);
    m.rough = .42 + .14*noise(q*9.); m.coat = 1.;
    if (abs(q.x) < .006 && q.y > .12) m.alb *= .55;                                /* quarter seam */
    float seam = smoothstep(.068, .06, ay);
    m.alb = mix(m.alb, vec3(.5, .4, .28) * (.75 + .3*grain), seam);
    m.alb = mix(m.alb, vec3(.38, .3, .22), smoothstep(.012, .004, ay));
    float st = smoothstep(.02, .006, abs(ay - .092)) * smoothstep(.2, .9, cos(a*96.));
    m.alb = mix(m.alb, vec3(.66, .58, .45), st);
    m.rough = mix(m.rough, .6, max(seam, st));
  } else if (id < 2.5) {                            /* padlock body: brushed steel */
    vec3 q = ((p - uP1) * uR1) / uS1;
    m.metal = 1.; m.alb = vec3(.8, .82, .85);
    m.rough = .16 + .14*noise(vec3(q.x*2., q.y*140., q.z*2.));
    vec3 k = q - vec3(0., -.08, .27);
    if (k.z < -.005 && length(k.xy) < .2) { m.alb = vec3(.02); m.metal = 0.; m.rough = .8; }
  } else if (id < 3.5) {                            /* shackle: polished chrome */
    m.metal = 1.; m.alb = vec3(.94, .94, .96); m.rough = .045;
  } else if (id < 4.5) {                            /* bat */
    vec3 q = ((p - uP2) * uR2) / uS2;
    if (q.y > .97) {                                /* rubber grip with a spiral rib */
      float rib = smoothstep(.3, .9, sin(q.y*70. + atan(q.z, q.x)*2.));
      m.alb = vec3(.03, .034, .045) * (1. + .6*rib); m.rough = .55 - .25*rib;
    } else {
      float g = sin(q.x*70. + noise(q*vec3(3., 1., 3.))*6.) * .5 + .5;
      m.alb = mix(vec3(.52, .36, .2), vec3(.38, .24, .12), g*.6 + .2*noise(q*20.));
      m.rough = .38; m.coat = .35;
      if (q.z > .02 && q.y > .3 && q.y < .78) {     /* the maker's label */
        m.alb = vec3(.006, .006, .008); m.rough = .45; m.coat = .25;
        float band = smoothstep(.012, .0, abs(q.y - .36)) + smoothstep(.012, .0, abs(q.y - .72));
        float mark = smoothstep(.02, .0, abs(length(vec2(q.x*1.2, q.y - .54)) - .1));
        m.alb = mix(m.alb, vec3(1., .78, .4), clamp(band + mark, 0., 1.));
        m.metal = clamp(band + mark, 0., 1.);
      }
    }
  } else {                                          /* the module */
    vec3 q = ((p - uP3) * uR3) / uS3;
    if (abs(q.x) > .5 || abs(q.z) > .5 || q.y < -.06) { m.metal = 1.; m.alb = vec3(1., .78, .4); m.rough = .18; }
    else {
      m.alb = vec3(.022, .022, .026); m.rough = .5; m.coat = .2;
      if (q.y > .05) {
        float etch = smoothstep(.008, .0, abs(length(q.xz - vec2(-.34, .34)) - .045));
        etch += step(abs(q.z + .02), .012) * step(abs(q.x), .26);
        etch += step(abs(q.z + .1), .008) * step(abs(q.x + .07), .19);
        etch += smoothstep(.006, .0, abs(max(abs(q.x), abs(q.z)) - .44));
        m.alb += vec3(.16, .15, .14) * clamp(etch, 0., 1.);
      }
    }
  }
  return m;
}

vec3 shade(vec3 p, vec3 n, vec3 rd, float id){
  Mat m = material(p, id, n);
  vec3 v = -rd;
  float nv = max(dot(n, v), 0.);
  vec3 F0 = mix(vec3(.04), m.alb, m.metal);
  vec3 F = F0 + (1. - F0) * pow(1. - nv, 5.);
  float occ = occlusion(p, n);
  vec3 col = vec3(0.);

  vec3 Ls[3]; vec3 Cs[3];
  Ls[0] = normalize(KEY);    Cs[0] = vec3(1., .86, .72) * 2.6;
  Ls[1] = normalize(RIM);    Cs[1] = vec3(.42, .68, 1.) * 2.4;
  Ls[2] = normalize(BOUNCE); Cs[2] = vec3(1., .94, .86) * 1.1;
  float shininess = 2. / max(m.rough*m.rough, .002) - 2.;
  for (int i = 0; i < 3; i++) {
    vec3 l = Ls[i];
    float nl = max(dot(n, l), 0.);
    if (nl <= 0.) continue;
    float sh = i == 0 ? shadow(p + n*.01, l) : 1.;
    vec3 h = normalize(l + v);
    float spec = pow(max(dot(n, h), 0.), shininess) * (shininess + 8.) / 25.;
    col += Cs[i] * nl * sh * ((1. - m.metal) * m.alb * (1. - F) / 3.14159 * 3. + spec * F);
  }
  /* image-based light from the studio */
  vec3 r = reflect(rd, n);
  col += (1. - m.metal) * m.alb * studio(n, 1.) * .16 * occ;
  /* rim lights: cool from behind right, warm from behind left, the way the pieces separate from the dark */
  float fr = pow(1. - nv, 6.);
  col += vec3(.4, .66, 1.) * 2.2 * fr * smoothstep(-.1, .7, dot(n, normalize(vec3(1., .35, -.25)))) * occ;
  col += vec3(1., .66, .4) * 1.1 * fr * smoothstep(-.1, .7, dot(n, normalize(vec3(-1., .15, -.3)))) * occ;
  col += F * studio(r, m.rough) * occ;
  /* clear coat: a sharp second reflection over the leather and lacquer */
  float fc = .04 + .96 * pow(1. - nv, 5.);
  col += m.coat * fc * studio(r, .02) * occ;
  return col;
}

vec3 aces(vec3 x){ return clamp((x*(2.51*x + .03)) / (x*(2.43*x + .59) + .14), 0., 1.); }

void main(){
  vec2 uv = (2.*gl_FragCoord.xy - uRes) / uRes.y;
  vec3 ta = vec3(0., uShift, 0.);
  vec3 ro = vec3(0., 0., uDist);
  ro.yz = rot(uPitch) * ro.yz;
  ro.xz = rot(uYaw) * ro.xz;
  ro += ta;
  vec3 ww = normalize(ta - ro), uu = normalize(cross(ww, vec3(0., 1., 0.))), vv = cross(uu, ww);
  const float FOCAL = 2.4;
  vec3 rd = normalize(uv.x*uu + uv.y*vv + FOCAL*ww);

  /* where the cluster sits on screen, for the haze and the floor glow */
  vec3 oc = -ro;
  vec2 c = vec2(dot(oc, uu), dot(oc, vv)) * FOCAL / dot(oc, ww);

  /* backdrop: near-black with a warm pool of light under the pieces */
  vec2 dc = uv - c;
  vec3 col = vec3(.0035, .0032, .003);
  col += vec3(.5, .38, .27) * .035 * exp(-dot(dc*vec2(.7, 1.), dc*vec2(.7, 1.)) * 1.2);
  col += vec3(1., .9, .78) * .07 * exp(-pow(length((dc - vec2(0., -1.1)) * vec2(.6, 2.6)), 2.) * 2.5);
  /* out-of-focus specks drifting behind */
  for (int i = 0; i < 14; i++) {
    float fi = float(i);
    vec2 bp = vec2(hash(vec2(fi, 1.)) * 4. - 2., hash(vec2(fi, 7.)) * 3. - 1.5);
    bp += vec2(sin(uTime*.07 + fi), cos(uTime*.05 + fi*1.7)) * .12;
    bp.x *= uRes.x / uRes.y * .6;
    float br = .015 + .05 * hash(vec2(fi, 3.));
    float dd = length(uv - bp - c*.4);
    float disc = smoothstep(br, br*.75, dd);
    col += mix(vec3(1., .82, .62), vec3(.5, .7, 1.), step(.6, hash(vec2(fi, 9.)))) * disc * (.012 + .012*smoothstep(br*.6, br*.95, dd));
  }

  float t = 0.; vec2 h = vec2(0.);
  float tmax = uDist + 8.;
  bool hit = false;
  for (int i = 0; i < 110; i++) {
    h = map(ro + rd*t);
    if (h.x < .0008 * t) { hit = true; break; }
    t += h.x;
    if (t > tmax) break;
  }
  if (hit) {
    vec3 p = ro + rd*t;
    vec3 n = normalAt(p);
    col = shade(p, n, rd, h.y);
  }

  col *= 1. + 2.5 * uExit * uExit;                 /* the exit flares… */
  col = aces(col * .95);
  col = pow(col, vec3(1./2.2));
  vec2 q = gl_FragCoord.xy / uRes;
  col *= .35 + .65 * pow(16. * q.x * q.y * (1. - q.x) * (1. - q.y), .3);
  col += (hash(gl_FragCoord.xy + fract(uTime*13.)*100.) - .5) * .035;
  col = mix(col, SITE, smoothstep(.45, .95, uExit)); /* …into the page's own colour */
  col *= uFade;
  gl_FragColor = vec4(col, 1.);
}`;

  let gl = null, prog = null, U = {};
  if (canvas) {
    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
      const sh = (type, src) => {
        const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        return s;
      };
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['uRes', 'uTime', 'uDist', 'uShift', 'uYaw', 'uPitch', 'uExit', 'uUnlock', 'uFade',
        'uP0', 'uP1', 'uP2', 'uP3', 'uR0', 'uR1', 'uR2', 'uR3', 'uS0', 'uS1', 'uS2', 'uS3']
        .forEach(n => { U[n] = gl.getUniformLocation(prog, n); });
    } catch (err) {
      gl = null;
    }
  }
  if (!gl) intro.classList.add('no-gl');

  /* ---------- sizing: render below device resolution and let quality adapt to the device ---------- */
  const coarse = matchMedia('(pointer: coarse)').matches;
  let quality = coarse ? .72 : 1;
  let W = 0, H = 0, camDist = 8, camShift = 0;
  function resize() {
    const cw = innerWidth, ch = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let scale = dpr * quality;
    const maxPx = coarse ? 900000 : 1800000;
    if (cw * ch * scale * scale > maxPx) scale = Math.sqrt(maxPx / (cw * ch));
    W = Math.max(2, Math.round(cw * scale)); H = Math.max(2, Math.round(ch * scale));
    if (canvas) { canvas.width = W; canvas.height = H; }
    /* frame the cluster in the top ~60% of the screen, leaving room for the type */
    const a = cw / ch, f = 2.4;
    const k = a < 1 ? .17 : .3;                    /* cluster centre, screen-up from middle */
    camDist = Math.max((a < 1 ? 2.45 : 2.2) * f / a, 2.05 * f / (.96 - k), 6.3);
    camShift = -k * camDist / f;
    if (gl) gl.viewport(0, 0, W, H);
  }
  resize();
  addEventListener('resize', resize);

  /* ---------- choreography ---------- */
  const clamp01 = x => Math.min(1, Math.max(0, x));
  const easeOutExpo = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
  const easeInOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const easeIn = x => x * x * x;
  /* rotation: R = Rz · Rx · Ry, column-major for GLSL */
  function rotm(rx, ry, rz) {
    const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);
    const m00 = cz * cy - sz * sx * sy, m01 = -sz * cx, m02 = cz * sy + sz * sx * cy;
    const m10 = sz * cy + cz * sx * sy, m11 = cz * cx, m12 = sz * sy - cz * sx * cy;
    const m20 = -cx * sy, m21 = sx, m22 = cx * cy;
    return new Float32Array([m00, m10, m20, m01, m11, m21, m02, m12, m22]);
  }
  /* each piece: where it rests, how it drifts, when it arrives, where it flees on exit */
  const pieces = [
    { pos: [0, 0, 0], s: 1, delay: .1, fly: [0, -.2, 1], pose: t => [.48 + .08 * Math.sin(t * .6), t * .45, -.32 + .05 * Math.sin(t * .4)], bob: t => [0, .07 * Math.sin(t * .9), 0] },
    { pos: [1.55, 1.05, -.7], s: .74, delay: .45, fly: [1.3, 1, .4], pose: t => [.12 + .06 * Math.sin(t * .7), -.55 + .3 * Math.sin(t * .45), .24 + .06 * Math.sin(t * .6)], bob: t => [0, .09 * Math.sin(t * .8 + 1), 0] },
    { pos: [-1.68, -.58, .6], s: .86, delay: .3, fly: [-1.2, -.5, .9], pose: t => [.22, .5 + .7 * Math.sin(t * .42), .62 + .04 * Math.sin(t * .5)], bob: t => [.04 * Math.sin(t * .5), .08 * Math.sin(t * .7 + 2), 0] },
    { pos: [-1.2, 1.45, -1.35], s: .82, delay: .6, fly: [-1, 1.2, -.2], pose: t => [1.02 + .14 * Math.sin(t * .5), t * .28, .32], bob: t => [0, .1 * Math.sin(t * .6 + 3), 0] }
  ];

  let yaw = 0, pitch = 0, tYaw = 0, tPitch = 0;
  addEventListener('pointermove', e => {
    tYaw = (e.clientX / innerWidth - .5) * .22;
    tPitch = (e.clientY / innerHeight - .5) * .14;
  }, { passive: true });

  let exitAt = 0, frameTimes = [], last = 0, raf = 0, ended = false;

  function draw(now) {
    const t = reduceMotion ? 6 : (now - start) / 1000;
    const ex = exitAt ? clamp01((now - exitAt) / EXIT_MS) : 0;
    const unlock = easeInOut(clamp01(ex / .35));
    const scatter = easeIn(clamp01((ex - .2) / .8));
    if (!reduceMotion) {
      yaw += (tYaw + Math.sin(t * .23) * .05 - yaw) * .05;
      pitch += (tPitch + Math.cos(t * .19) * .03 - pitch) * .05;
    }
    pieces.forEach((pc, i) => {
      const e = reduceMotion ? 1 : easeOutExpo(clamp01((t - pc.delay) / 2.1));
      const b = pc.bob(t), r = pc.pose(t);
      const from = [pc.pos[0] * 2.2, pc.pos[1] * 2.2 - 3, pc.pos[2] - 9];
      const p = [0, 1, 2].map(j => from[j] + (pc.pos[j] - from[j]) * e + b[j] + pc.fly[j] * scatter * 7);
      if (i === 0) p[2] += scatter * (camDist - 1.5) * 1.1;       /* the ball comes for the camera */
      const spin = (1 - e) * 3.2 + scatter * 2.4;
      gl.uniform3fv(U['uP' + i], p);
      gl.uniformMatrix3fv(U['uR' + i], false, rotm(r[0] + spin * .6, r[1] + spin, r[2]));
      gl.uniform1f(U['uS' + i], pc.s * (.55 + .45 * e));
    });
    gl.uniform2f(U.uRes, W, H);
    gl.uniform1f(U.uTime, t);
    gl.uniform1f(U.uDist, camDist);
    gl.uniform1f(U.uShift, camShift);
    gl.uniform1f(U.uYaw, yaw);
    gl.uniform1f(U.uPitch, pitch);
    gl.uniform1f(U.uExit, ex);
    gl.uniform1f(U.uUnlock, unlock);
    gl.uniform1f(U.uFade, reduceMotion ? 1 : clamp01(t / .9));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function loop(now) {
    if (ended) return;
    if (last) {
      frameTimes.push(now - last);
      if (frameTimes.length === 40) {             /* too slow? draw fewer pixels */
        const avg = frameTimes.reduce((s, x) => s + x, 0) / frameTimes.length;
        if (avg > 24 && quality > .45) { quality *= .82; resize(); }
        frameTimes = [];
      }
    }
    last = now;
    draw(now);
    raf = requestAnimationFrame(loop);
  }
  if (gl) {
    if (reduceMotion) requestAnimationFrame(draw);
    else raf = requestAnimationFrame(loop);
  }

  /* ---------- magnetic button ---------- */
  if (go && !coarse && !reduceMotion) {
    go.addEventListener('pointermove', e => {
      const r = go.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
      go.style.transform = `translate(${x * 10}px, ${y * 8}px)`;
    });
    go.addEventListener('pointerleave', () => { go.style.transform = ''; });
  }

  /* ---------- leaving ---------- */
  function finish() {
    if (exitAt) return;
    exitAt = performance.now();
    try { sessionStorage.setItem('skp-intro', '1'); } catch { /* private mode: it shows again next time */ }
    intro.classList.add('is-leaving');
    if (gl && reduceMotion) { const tick = n => { draw(n); if (n - exitAt < EXIT_MS) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }
    setTimeout(() => {
      root.classList.remove('is-intro');
      behind.forEach(el => { el.inert = false; });
      intro.classList.add('is-gone');
      setTimeout(() => {
        ended = true; cancelAnimationFrame(raf);
        removeEventListener('resize', resize);
        gl?.getExtension('WEBGL_lose_context')?.loseContext();
        intro.remove();
      }, 700);
    }, EXIT_MS * (gl ? .94 : .5));
  }
  go?.addEventListener('click', finish);
  addEventListener('keydown', e => { if (e.key === 'Escape' || (e.key === 'Enter' && document.activeElement === document.body)) finish(); });

  const ready = () => {
    intro.classList.add('is-ready');
    if (status) status.textContent = 'Ready';
    setTimeout(finish, Math.max(0, MIN_SHOW - (performance.now() - start)));
  };
  if (document.readyState === 'complete') ready();
  else addEventListener('load', ready, { once: true });
  setTimeout(finish, 9000);                         /* never hold the page hostage to a slow asset */
})();
