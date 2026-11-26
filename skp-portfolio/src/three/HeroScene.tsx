import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* Float: a slow, individual bob and sway (what drei's <Float> does, in a few lines) */
function Float({ speed = 1, children }: { speed?: number; children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null), seed = useMemo(() => Math.random() * 100, []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed * 0.6 + seed, o = g.current; if (!o) return;
    o.position.y = Math.sin(t) * 0.08;
    o.rotation.x = Math.cos(t * 0.8) * 0.06; o.rotation.z = Math.sin(t * 0.7) * 0.05;
  });
  return <group ref={g}>{children}</group>;
}

/* Warm studio light for reflections: three's RoomEnvironment, pre-filtered once, tinted golden by the scene lights */
function Studio() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.035).texture;
    scene.environment = env; scene.environmentIntensity = 0.55;
    return () => { env.dispose(); pm.dispose(); scene.environment = null; };
  }, [gl, scene]);
  return null;
}

/* A soft floor shadow: a plane that only shows the shadows cast on it */
function Floor({ y }: { y: number }) {
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.4, y, 0]} receiveShadow><planeGeometry args={[18, 18]} /><shadowMaterial opacity={0.2} color="#5c3f22" /></mesh>;
}

/* A golden-hour still life that is alive: plaster, gold, charcoal, terracotta and frosted glass,
   floating over a soft contact shadow. The group leans toward the pointer, drifts apart as you scroll,
   and every shape spins when clicked. Rendering stops whenever the hero is off screen. */

type Kind = 'sphere' | 'torus' | 'box' | 'cone' | 'column' | 'ico' | 'pebble' | 'glass' | 'knot';
type ShapeDef = { kind: Kind; pos: [number, number, number]; rot?: [number, number, number]; scale?: number; mat: keyof typeof MATS; drift: [number, number, number]; speed?: number };

const MATS = {
  plaster: { color: '#ece0cc', roughness: 0.86, metalness: 0, clearcoat: 0, sheen: 0.4, sheenColor: '#fff3df' },
  gold: { color: '#d8a24a', roughness: 0.2, metalness: 1, envMapIntensity: 1.3 },
  charcoal: { color: '#2a2622', roughness: 0.5, metalness: 0.15, clearcoat: 0.5, clearcoatRoughness: 0.3 },
  terracotta: { color: '#c98d64', roughness: 0.72, metalness: 0 },
  sand: { color: '#dbc6a6', roughness: 0.8, metalness: 0 },
  glass: { color: '#fff6ea', roughness: 0.12, metalness: 0, transmission: 1, thickness: 1.2, ior: 1.35, attenuationColor: '#f2c98a', attenuationDistance: 2.2 },
} as const;

const SHAPES: ShapeDef[] = [
  { kind: 'sphere', pos: [0.15, -0.05, 0], scale: 1, mat: 'plaster', drift: [-0.6, 0.4, 0.2], speed: 1 },
  { kind: 'torus', pos: [1.55, 0.75, -0.4], rot: [0.3, -0.6, 0.2], mat: 'gold', drift: [0.7, 0.9, -0.2], speed: 1.4 },
  { kind: 'box', pos: [1.25, -0.75, 0.7], rot: [0.4, 0.6, 0.1], mat: 'charcoal', drift: [0.5, -0.6, 0.4], speed: 1.1 },
  { kind: 'cone', pos: [2.45, -0.35, -0.2], rot: [0.15, 0, -0.2], mat: 'terracotta', drift: [1, -0.2, 0], speed: 1.2 },
  { kind: 'column', pos: [-1.25, 0.55, -1.1], rot: [0.05, 0, 0.12], mat: 'sand', drift: [-0.9, 0.8, -0.4], speed: 0.8 },
  { kind: 'ico', pos: [-0.85, -1.05, 0.9], scale: 0.9, mat: 'gold', drift: [-0.7, -0.8, 0.5], speed: 1.6 },
  { kind: 'glass', pos: [0.95, 0.35, 1.35], scale: 0.9, mat: 'glass', drift: [0.3, 0.3, 0.9], speed: 1.3 },
  { kind: 'pebble', pos: [2.3, 1.25, 0.4], scale: 0.7, mat: 'gold', drift: [1.1, 1.1, 0.2], speed: 2 },
  { kind: 'knot', pos: [-1.6, -0.6, -0.3], scale: 0.75, mat: 'charcoal', drift: [-1.2, -0.4, 0], speed: 0.9 },
];

function Geometry({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'sphere': return <sphereGeometry args={[0.78, 96, 64]} />;
    case 'torus': return <torusGeometry args={[0.52, 0.19, 48, 128]} />;
    case 'cone': return <coneGeometry args={[0.46, 1.05, 96, 1]} />;
    case 'column': return <cylinderGeometry args={[0.26, 0.26, 2.1, 72, 1]} />;
    case 'ico': return <icosahedronGeometry args={[0.36, 0]} />;
    case 'pebble': return <sphereGeometry args={[0.2, 48, 32]} />;
    case 'glass': return <sphereGeometry args={[0.42, 96, 64]} />;
    case 'knot': return <torusKnotGeometry args={[0.32, 0.1, 160, 24, 2, 3]} />;
    case 'box': return <primitive object={new RoundedBoxGeometry(0.95, 0.95, 0.95, 6, 0.09)} attach="geometry" />;
    default: return null;
  }
}

function Shape({ def, scroll, still }: { def: ShapeDef; scroll: React.RefObject<number>; still: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const spin = useRef(0), hover = useRef(0), base = useMemo(() => new THREE.Vector3(...def.pos), [def.pos]);
  const [hovered, setHovered] = useState(false);
  useFrame((_, dt) => {
    const m = mesh.current; if (!m) return;
    const d = Math.min(dt, 1 / 30);
    hover.current += ((hovered ? 1 : 0) - hover.current) * 0.12;
    m.rotation.y += (spin.current + 0.12 * (def.speed ?? 1)) * d;
    m.rotation.x += spin.current * 0.35 * d;
    spin.current *= 0.95;
    const s = scroll.current ?? 0;
    m.position.set(base.x + def.drift[0] * s * 2.2, base.y + def.drift[1] * s * 2.2, base.z + def.drift[2] * s * 2.2);
    const k = (def.scale ?? 1) * (1 + hover.current * 0.12);
    m.scale.setScalar(k);
  });
  const onDown = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); spin.current += 9; };
  const body = <mesh ref={mesh} rotation={def.rot} castShadow receiveShadow
        onPointerOver={e => { e.stopPropagation(); setHovered(true); document.body.dataset.cursorHint = 'spin'; }}
        onPointerOut={() => { setHovered(false); delete document.body.dataset.cursorHint; }} onPointerDown={onDown}>
        <Geometry kind={def.kind} />
        <meshPhysicalMaterial {...MATS[def.mat]} flatShading={def.kind === 'ico'} />
      </mesh>;
  if (still) return body;
  return <Float speed={1.2 * (def.speed ?? 1)}>{body}</Float>;
}

function Rig({ children, scroll, compact }: { children: React.ReactNode; scroll: React.RefObject<number>; compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { pointer, camera } = useThree();
  useFrame(() => {
    const g = group.current; if (!g) return;
    const s = scroll.current ?? 0;
    g.rotation.y += ((pointer.x * 0.35 + s * 0.8) - g.rotation.y) * 0.05;
    g.rotation.x += ((-pointer.y * 0.18 + s * 0.25) - g.rotation.x) * 0.05;
    camera.position.y += ((0.55 + pointer.y * 0.15 - s * 0.6) - camera.position.y) * 0.05;
    camera.lookAt(compact ? 0.4 : 0.55, compact ? -0.2 : 0.05, 0);
  });
  return <group ref={group} position={compact ? [-0.35, -0.55, 0] : [0.55, 0, 0]} scale={compact ? 0.72 : 1}>{children}</group>;
}

function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => { if (!done.current) { done.current = true; requestAnimationFrame(onReady); } });
  return null;
}

export default function HeroScene({ onReady, still, eventSource }: { onReady: () => void; still: boolean; eventSource?: HTMLElement | null }) {
  const host = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const [active, setActive] = useState(true);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const el = host.current!;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '80px' });
    io.observe(el);
    const on = () => { scroll.current = Math.min(1.2, Math.max(0, window.scrollY / window.innerHeight)); };
    const size = () => setCompact(window.innerWidth < 900);
    on(); size();
    window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', size);
    return () => { io.disconnect(); window.removeEventListener('scroll', on); window.removeEventListener('resize', size); };
  }, []);
  return (
    <div className="scene-host" ref={host}>
      <Canvas shadows="variance" dpr={[1, 1.75]} camera={{ position: [0, 0.55, 7.2], fov: 30 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={still ? 'demand' : active ? 'always' : 'never'} aria-hidden="true"
        eventSource={eventSource ?? undefined} eventPrefix="client">
        <ambientLight intensity={0.35} color="#f6e7d0" />
        <directionalLight position={[-4.5, 5, 3.5]} intensity={2.6} color="#ffcf92" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-radius={8} shadow-blurSamples={16}
          shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} />
        <directionalLight position={[5, 1.5, -3]} intensity={0.9} color="#ffb36b" />
        <Studio />
        <Rig scroll={scroll} compact={compact}>
          {SHAPES.map((d, i) => <Shape key={i} def={d} scroll={scroll} still={still} />)}
        </Rig>
        <Floor y={-1.75} />
        <FirstFrame onReady={onReady} />
      </Canvas>
    </div>
  );
}
