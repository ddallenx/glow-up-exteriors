import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Studio from './Studio'
import { LogoSlab } from './LogoSlab'
import { introState } from '../lib/intro'
import { usePointer } from '../hooks/usePointer'

const fogVert = 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }'
const fogFrag = `varying vec2 vUv; uniform float uW; uniform float uOff; uniform float uSeed;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
  float fbm(vec2 p){ float v=0.; float a=.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.1; a*=.5; } return v; }
  void main(){
    float gx = vUv.x * .5 + uOff;
    float p = uW * 1.12 - .06;
    float cleaned = 1. - smoothstep(p - .035, p, gx);
    float fog = .22 + .42 * fbm(vUv * vec2(5., 7.) + uSeed);
    float drops = smoothstep(.8, .86, noise(vUv * 120. + uSeed)) * .32;
    float a = (fog + drops) * (1. - cleaned);
    float edge = exp(-abs(gx - p) * 55.) * step(.001, uW) * step(uW, .995);
    vec3 col = mix(vec3(.72,.84,1.), vec3(1.), edge);
    gl_FragColor = vec4(col, clamp(a + edge * .6, 0., .95));
  }`

function Sash({ side, w, h }) {
  const g = useRef()
  const fog = useMemo(() => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uW: { value: 0 }, uOff: { value: side < 0 ? 0 : 0.5 }, uSeed: { value: side < 0 ? 3 : 9 } }, vertexShader: fogVert, fragmentShader: fogFrag }), [side])
  useFrame(() => {
    fog.uniforms.uW.value = introState.wipe
    const o = introState.open
    // stagger so the sashes feel hand-opened, not mechanical
    const k = THREE.MathUtils.clamp(o * 1.0, 0, 1)
    g.current.rotation.y = -side * 2.0 * k
  })
  const t = 0.16 * (h / 7.6)
  const frame = { color: '#0a1022', metalness: 0.9, roughness: 0.32, emissive: '#007aff', emissiveIntensity: 0.18 }
  const glow = <meshBasicMaterial color="#4da3ff" transparent opacity={0.9} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} />
  const bars = [
    [0, h / 2 - t / 2, w, t], [0, -h / 2 + t / 2, w, t],
    [-side * (w / 2 - t / 2), 0, t, h], [side * (w / 2 - t / 2), 0, t * 1.4, h], // hinge side / meeting stile
    [0, 0, t * 0.7, h], [0, 0, w, t * 0.7],
  ]
  return (
    <group ref={g} position={[side * (w), 0, 0]}>
      <group position={[-side * (w / 2), 0, 0]}>
        <mesh position={[0, 0, -0.02]}><planeGeometry args={[w - t, h - t]} /><meshPhysicalMaterial color="#8fb8ff" transparent opacity={0.16} roughness={0.12} clearcoat={1} envMapIntensity={3.4} depthWrite={false} /></mesh>
        <mesh position={[0, 0, 0.03]} material={fog}><planeGeometry args={[w - t, h - t]} /></mesh>
        {bars.map(([x, y, bw, bh], i) => (
          <group key={i} position={[x, y, 0]}>
            <mesh><boxGeometry args={[bw, bh, t * 1.6]} /><meshStandardMaterial {...frame} /></mesh>
            <mesh position={[0, 0, t * 0.82]}><boxGeometry args={[bw * 0.96, bh * 0.2 + 0.012, 0.01]} />{glow}</mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

function Rig({ children }) {
  const { camera, viewport } = useThree()
  const logo = useRef()
  const light = useRef()
  const ptr = usePointer(null)
  const lightMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#8cc8ff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), [])
  useFrame((s, dt) => {
    const { appear, open } = introState
    const t = s.clock.elapsedTime
    const k = 1 - Math.pow(0.003, dt)
    // camera dollies forward through the opening windows
    camera.position.z = 11 - open * open * 5.6
    camera.position.x += (ptr.current.x * 0.35 * (1 - open) - camera.position.x) * k
    camera.position.y += (ptr.current.y * 0.2 * (1 - open) - camera.position.y) * k
    camera.lookAt(0, 0, 0)
    // logo: pops in, floats, then flies through the lens as the windows open
    const l = logo.current
    const pop = THREE.MathUtils.smoothstep(appear, 0, 1)
    const fly = open * open * open
    l.visible = fly < 0.995
    l.scale.setScalar((0.55 + 0.45 * pop) * (1 + fly * 2.2))
    l.position.set(0, Math.sin(t * 0.9) * 0.08 + fly * 0.4, 0.7 + fly * 11)
    l.rotation.set(-ptr.current.y * 0.12, (1 - pop) * -1.2 + ptr.current.x * 0.3 + Math.sin(t * 0.5) * 0.12 + fly * 0.8, 0)
    // light that pours through as the windows open
    lightMat.opacity = Math.sin(Math.min(1, open * 1.15) * Math.PI) * 0.75
    light.current.scale.setScalar(1 + open * 1.5)
  })
  const w = viewport.width / 2 + 0.02, h = viewport.height + 0.02
  const lw = Math.min(7, viewport.width * 0.7, viewport.height * 0.84)
  return (
    <>
      <Sash side={-1} w={w} h={h} />
      <Sash side={1} w={w} h={h} />
      <mesh ref={light} position={[0, 0, -1.2]} material={lightMat}><circleGeometry args={[Math.max(viewport.width, viewport.height) * 0.5, 48]} /></mesh>
      <group ref={logo}><Suspense fallback={null}><LogoSlab width={lw} layers={20} depth={0.8} /></Suspense></group>
    </>
  )
}

export default function IntroScene({ onReady }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 38, near: 0.1, far: 80, position: [0, 0, 11] }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
      onCreated={({ gl, scene, camera }) => { gl.setClearColor(0, 0); gl.toneMapping = THREE.ACESFilmicToneMapping; requestAnimationFrame(() => { gl.compile(scene, camera); onReady?.() }) }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 6]} intensity={40} color="#4da3ff" distance={24} />
      <pointLight position={[-6, 3, 5]} intensity={30} color="#ffffff" distance={24} />
      <Suspense fallback={null}><Studio res={128} intensity={1.1} /></Suspense>
      <Rig />
    </Canvas>
  )
}
