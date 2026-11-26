// Source for side-scenes.js: the halftone 3D scenes for the ForkCast and What-The-Fabric sections.
// Build:  npx esbuild three-src/side-scenes.js --bundle --format=esm --minify --outfile=side-scenes.js   (needs the `three` package)
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, ShaderMaterial, Color, Vector3, DoubleSide,
  BoxGeometry, PlaneGeometry, CylinderGeometry, SphereGeometry, CapsuleGeometry, TorusGeometry,
} from 'three';

const VERT = `
uniform float uTime; uniform float uCloth; varying vec3 vView;
void main() {
  vec3 p = position;
  if (uCloth > .5) {
    float hang = 1. - uv.y;
    p.z += hang * (sin(p.x * 2.9 + uTime * 1.3) * .34 + sin(p.y * 3.4 + uTime * .9 + p.x * 1.6) * .16);
    p.x += hang * sin(uTime * .7 + p.y * 2.) * .05;
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  vView = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;
const FRAG = `
precision highp float;
uniform vec3 uInk; uniform vec3 uLight; uniform float uCell; uniform float uBase; varying vec3 vView;
void main() {
  vec3 n = normalize(cross(dFdx(vView), dFdy(vView)));
  float lit = smoothstep(.3, .98, dot(n, normalize(uLight)) * .5 + .5);
  float dark = uBase + (1. - uBase) * (1. - lit);
  vec2 f = fract(gl_FragCoord.xy / uCell) - .5;
  float r = .64 * sqrt(dark);
  float a = 1. - smoothstep(r - .07, r + .02, length(f));
  if (a < .02) discard;
  gl_FragColor = vec4(uInk, a);
}`;

const INK = { light: '#0d0d0d', dark: '#f1ece4' };

function buildFork(mat, add) {
  const g = new Group(), T = .18;
  const slab = (w, h, x, y) => { const m = new Mesh(new BoxGeometry(w, h, T), mat); m.position.set(x, y, 0); g.add(m); return m; };
  const pill = (x, y) => { const m = new Mesh(new CapsuleGeometry(.2, .62, 6, 18), mat); m.rotation.z = Math.PI / 2; m.scale.z = .5; m.position.set(x, y, 0); g.add(m); return m; };
  const nodes = [pill(0, 1.55), null, slab(.95, .5, -1.3, -.4), slab(.95, .5, 1.3, -.4), pill(0, -1.55)];
  const diamond = new Mesh(new BoxGeometry(.72, .72, T), mat); diamond.rotation.z = Math.PI / 4; diamond.position.set(0, .6, 0); g.add(diamond); nodes[1] = diamond;
  const wire = (x1, y1, x2, y2) => { const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy); const m = new Mesh(new BoxGeometry(len, .07, .07), mat); m.position.set((x1 + x2) / 2, (y1 + y2) / 2, 0); m.rotation.z = Math.atan2(dy, dx); g.add(m); };
  wire(0, 1.33, 0, 1.12);
  wire(-.52, .6, -1.3, .6); wire(-1.3, .6, -1.3, -.14);
  wire(.52, .6, 1.3, .6); wire(1.3, .6, 1.3, -.14);
  wire(-1.3, -.66, -1.3, -1.55); wire(-1.3, -1.55, -.52, -1.55);
  wire(1.3, -.66, 1.3, -1.55); wire(1.3, -1.55, .52, -1.55);
  for (let y = -.02; y > -1.2; y -= .2) wire(0, y, 0, y - .1); // the unstated path
  const token = new Mesh(new SphereGeometry(.15, 20, 14), mat); g.add(token);
  const routes = [
    [[0, 1.55], [0, .6], [-1.3, .6], [-1.3, -.4], [-1.3, -1.55], [0, -1.55]],
    [[0, 1.55], [0, .6], [1.3, .6], [1.3, -.4], [1.3, -1.55], [0, -1.55]],
  ].map(pts => { const seg = []; let total = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); total += l; } return { pts, seg, total }; });
  g.rotation.x = -.42; g.scale.setScalar(.96);
  add(g);
  return t => {
    g.rotation.y = Math.sin(t * .45) * .38; g.rotation.z = Math.sin(t * .3) * .04;
    nodes.forEach((n, i) => { n.position.z = Math.sin(t * 1.1 + i * 1.3) * .07; });
    const lap = t / 5, route = routes[Math.floor(lap) % 2]; let d = (lap % 1) * route.total, i = 0;
    while (i < route.seg.length - 1 && d > route.seg[i]) { d -= route.seg[i]; i++; }
    const k = Math.min(1, d / route.seg[i]), a = route.pts[i], b = route.pts[i + 1];
    token.position.set(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, .34 + Math.sin(t * 6) * .03);
  };
}

function buildFabric(mat, add, clothMat) {
  const g = new Group();
  const line = new Mesh(new CylinderGeometry(.03, .03, 4.4, 10), mat); line.rotation.z = Math.PI / 2; line.position.y = 1.36; g.add(line);
  const cloth = new Mesh(new PlaneGeometry(3, 2.5, 72, 56), clothMat); cloth.position.y = .1; g.add(cloth);
  [-1.15, 1.15].forEach(x => { const peg = new Mesh(new BoxGeometry(.13, .36, .16), mat); peg.position.set(x, 1.38, .02); g.add(peg); });
  const tag = new Group(); const card = new Mesh(new BoxGeometry(.62, .38, .04), mat); const eye = new Mesh(new TorusGeometry(.07, .022, 8, 18), mat); eye.position.set(-.2, .22, 0); tag.add(card, eye); tag.position.set(1.95, -1.05, .7); g.add(tag);
  const spool = new Group(); spool.add(new Mesh(new CylinderGeometry(.2, .2, .5, 22), mat));
  [-.28, .28].forEach(y => { const d = new Mesh(new CylinderGeometry(.33, .33, .07, 26), mat); d.position.y = y; spool.add(d); });
  spool.position.set(-2.05, -.85, .6); g.add(spool);
  const button = new Group(); const disc = new Mesh(new CylinderGeometry(.3, .3, .06, 28), mat); disc.rotation.x = Math.PI / 2; const rim = new Mesh(new TorusGeometry(.3, .045, 10, 30), mat); button.add(disc, rim); button.position.set(2.0, 1.0, .5); g.add(button);
  g.scale.setScalar(.9); g.position.y = -.08;
  add(g);
  return t => {
    g.rotation.y = Math.sin(t * .4) * .3;
    tag.rotation.set(Math.sin(t * .9) * .25, Math.sin(t * .6) * .9, -.25 + Math.sin(t * .7) * .2); tag.position.y = -1.05 + Math.sin(t * 1.1) * .08;
    spool.rotation.set(.5 + Math.sin(t * .5) * .2, t * .5, .3); spool.position.y = -.85 + Math.sin(t * .9 + 1) * .09;
    button.rotation.set(Math.sin(t * .8) * .5, Math.sin(t * .7 + 2.) * .8, 0); button.position.y = 1.0 + Math.sin(t * 1.2 + 2) * .07;
  };
}

export function mount(container, opts = {}) {
  const { scene: kind = 'forkcast', reducedMotion = false, compact = false, theme = 'light', capture = false } = opts;
  const renderer = new WebGLRenderer({ alpha: true, antialias: false, preserveDrawingBuffer: capture, powerPreference: 'low-power' });
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(ratio); renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  const scene = new Scene(), camera = new PerspectiveCamera(34, 1, .1, 50); camera.position.set(0, 0, 6.9);
  const uniforms = { uTime: { value: 0 }, uInk: { value: new Color(INK[theme] || INK.light) }, uLight: { value: new Vector3(.75, .7, .6) }, uCell: { value: (compact ? 4.2 : 5) * ratio }, uBase: { value: .2 } };
  const make = cloth => new ShaderMaterial({ uniforms: { ...uniforms, uCloth: { value: cloth ? 1 : 0 } }, vertexShader: VERT, fragmentShader: FRAG, transparent: true, side: DoubleSide });
  const rig = new Group(); scene.add(rig);
  const tick = (kind === 'fabric' ? buildFabric : buildFork)(make(false), o => rig.add(o), make(true));
  let w = 0, h = 0, raf = 0, running = false, visible = true, px = 0, py = 0, tx = 0, ty = 0, t0 = performance.now(), ready = false;
  const resize = () => { const r = container.getBoundingClientRect(); if (!r.width || !r.height) return; w = r.width; h = r.height; renderer.setSize(w, h, false); camera.aspect = w / h; rig.scale.setScalar(Math.min(1, camera.aspect * .86)); camera.updateProjectionMatrix(); };
  const draw = now => {
    const t = reducedMotion ? 1.6 : Math.max(0, (now - t0) / 1000);
    uniforms.uTime.value = t; tick(t);
    px += (tx - px) * .06; py += (ty - py) * .06; rig.rotation.set(py * .28, px * .42, 0);
    renderer.render(scene, camera);
    if (!ready) { ready = true; container.classList.add('is-ready'); }
  };
  const loop = now => { raf = 0; if (!running || !visible) return; draw(now); raf = requestAnimationFrame(loop); };
  const start = () => { if (reducedMotion) { draw(0); return; } running = true; if (!raf) raf = requestAnimationFrame(loop); };
  const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };
  const onMove = e => { const r = container.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - .5) * 2; ty = ((e.clientY - r.top) / r.height - .5) * 2; };
  container.addEventListener('pointermove', onMove); container.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
  new ResizeObserver(() => { resize(); if (reducedMotion) draw(0); }).observe(container);
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && running && !raf) raf = requestAnimationFrame(loop); }).observe(container);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; } else if (running && visible && !raf) raf = requestAnimationFrame(loop); });
  resize(); start();
  return { start, stop, setTheme: name => { uniforms.uInk.value.set(INK[name] || INK.light); if (reducedMotion) draw(0); } };
}
