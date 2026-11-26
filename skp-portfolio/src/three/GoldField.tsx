import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* Golden hour as a field of light: domain-warped noise in paper, honey and umber, with a soft bloom that
   follows the pointer. One full-screen triangle, one fragment shader, rendered only while on screen. */

const frag = /* glsl */ `
precision highp float;
uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse; uniform float uScroll;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
float fbm(vec2 p){ float v = 0., a = .5; mat2 r = mat2(.8,-.6,.6,.8); for (int i = 0; i < 5; i++){ v += a*noise(p); p = r*p*2.02 + 3.1; a *= .5; } return v; }
void main(){
  vec2 uv = vUv; vec2 p = (uv - .5) * vec2(uRes.x/uRes.y, 1.) * 2.2;
  float t = uTime * .045;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.5*q + vec2(1.7, 9.2) + .7*t), fbm(p + 3.5*q + vec2(8.3, 2.8) - .5*t));
  float f = fbm(p + 3.*r + uScroll*.6);
  vec2 m = (uMouse - .5) * vec2(uRes.x/uRes.y, 1.) * 2.2;
  float glow = exp(-2.2 * length(p - m));
  vec3 paper = vec3(.953, .933, .902), honey = vec3(.93, .74, .44), gold = vec3(.85, .6, .27), umber = vec3(.45, .3, .17);
  vec3 col = mix(paper, honey, smoothstep(.25, .75, f));
  col = mix(col, gold, smoothstep(.55, .95, f*f*1.6 + length(q)*.18));
  col = mix(col, umber, smoothstep(.75, 1.1, length(r)*.9) * .35);
  col += glow * vec3(1., .85, .6) * .28;
  col = mix(col, paper, smoothstep(.45, 1., 1. - uv.y) * .25);   // lighter toward the top, where the words sit
  float g = hash(uv * uRes + uTime) * .035; col += g - .017;    // film grain
  gl_FragColor = vec4(col, 1.);
}`;
const vert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;

function Field({ still }: { still: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, gl } = useThree();
  const mouse = useRef(new THREE.Vector2(0.7, 0.6)), target = useRef(new THREE.Vector2(0.7, 0.6));
  const uniforms = useMemo(() => ({ uTime: { value: 8 }, uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(0.7, 0.6) }, uScroll: { value: 0 } }), []);
  useEffect(() => {
    const el = gl.domElement.parentElement!.parentElement!;
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); target.current.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height); };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, [gl]);
  useFrame((_, dt) => {
    const m = mat.current; if (!m) return;
    m.uniforms.uRes.value.set(size.width, size.height);
    if (!still) m.uniforms.uTime.value += Math.min(dt, 1 / 30);
    mouse.current.lerp(target.current, 0.05); m.uniforms.uMouse.value.copy(mouse.current);
    const r = gl.domElement.getBoundingClientRect();
    m.uniforms.uScroll.value = 1 - (r.top + r.height) / (window.innerHeight + r.height);
  });
  return (
    <mesh frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3]} />
        <bufferAttribute attach="attributes-uv" args={[new Float32Array([0, 0, 2, 0, 0, 2]), 2]} />
      </bufferGeometry>
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthWrite={false} depthTest={false} />
    </mesh>
  );
}

export default function GoldField({ still }: { still: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '100px' });
    io.observe(host.current!);
    return () => io.disconnect();
  }, []);
  return (
    <div className="field-host" ref={host}>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }} frameloop={still ? 'demand' : active ? 'always' : 'never'} aria-hidden="true">
        <Field still={still} />
      </Canvas>
    </div>
  );
}
