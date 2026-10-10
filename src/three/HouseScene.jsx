import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, MeshReflectorMaterial, PerformanceMonitor, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from '../lib/gsap'
import House from './House'
import Water from './Water'

const BG = '#040a1c'

function Rig({ desktop, reduced }) {
  const { camera, pointer, size } = useThree()
  const intro = useRef({ v: reduced ? 1 : 0 })
  const cur = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())

  useEffect(() => {
    if (reduced) return
    const tween = gsap.to(intro.current, { v: 1, duration: 3.4, ease: 'expo.out', delay: 0.6 })
    return () => tween.kill()
  }, [reduced])

  useFrame((s, dt) => {
    const aspect = size.width / size.height
    const scrollY = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.2)
    const e = intro.current.v
    const sway = reduced ? 0 : Math.sin(s.clock.elapsedTime * 0.25) * 0.08
    const az = THREE.MathUtils.lerp(1.15, 0.5, e) + pointer.x * 0.16 + scrollY * 0.55 + sway
    const portrait = aspect < 1.1
    const fit = 14 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect)
    const r = Math.max(desktop ? 21 : 0, fit) * THREE.MathUtils.lerp(1.6, 1, e) + scrollY * 3
    const y = THREE.MathUtils.lerp(12, 6.2, e) + pointer.y * 0.7 - scrollY * 0.8
    const target = new THREE.Vector3(r * Math.sin(az) + 0.5, y, r * Math.cos(az) + 1)
    cur.current.lerp(target, 1 - Math.pow(0.0025, dt))
    camera.position.copy(cur.current)
    const lx = desktop ? -2.6 : 0.3
    look.current.set(lx, portrait ? 2.2 : 2.5, 1.2)
    camera.lookAt(look.current)
  })
  return null
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={2.4} position={[0, 7, 8]} scale={[16, 4, 1]} color="#dfe8ff" />
      <Lightformer form="rect" intensity={3.5} position={[-9, 3, 5]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} color="#6f8cff" />
      <Lightformer form="rect" intensity={1.6} position={[9, 4, 3]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} color="#ffffff" />
      <Lightformer form="ring" intensity={2} position={[2, 9, 10]} scale={6} color="#bcd0ff" />
      <Lightformer form="rect" intensity={0.8} position={[0, 2, -10]} scale={[20, 5, 1]} color="#2a52ff" />
    </Environment>
  )
}

function Ground({ desktop }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
      <circleGeometry args={[40, 64]} />
      {desktop ? (
        <MeshReflectorMaterial blur={[400, 120]} resolution={512} mixBlur={1} mixStrength={14} mirror={0.55} depthScale={0.6} minDepthThreshold={0.6} maxDepthThreshold={1.4} color="#08122e" roughness={0.9} metalness={0.4} />
      ) : (
        <meshStandardMaterial color="#08122e" roughness={0.6} metalness={0.4} />
      )}
    </mesh>
  )
}

export default function HouseScene({ desktop, reduced }) {
  const wrap = useRef(null)
  const [visible, setVisible] = useState(true)
  const [dpr, setDpr] = useState(desktop ? 1.75 : 1.4)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="absolute inset-0" role="img" aria-label="Interactive 3D model of a modern home with glass windows being washed. Move your pointer over it to spray water.">
      <Canvas
        shadows={desktop}
        dpr={[1, dpr]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ fov: desktop ? 32 : 38, near: 0.1, far: 120, position: [14, 9, 18] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'pan-y' }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05 }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 22, 48]} />
        <Rig desktop={desktop} reduced={reduced} />

        <ambientLight intensity={0.3} color="#9fb4ff" />
        <hemisphereLight args={['#8fa8ff', '#0a1230', 0.35]} />
        <directionalLight position={[-7, 12, 10]} intensity={1.7} color="#b9ccff" castShadow={desktop} shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-6} shadow-bias={-0.0004} />
        <pointLight position={[9, 4, -3]} intensity={22} color="#2a52ff" distance={26} />
        <pointLight position={[-6, 5, 9]} intensity={25} color="#9db1ff" distance={22} />

        <Suspense fallback={null}>
          <Studio />
          <House desktop={desktop} reduced={reduced} />
          <Ground desktop={desktop} />
          <Water ambient={desktop ? 90 : 45} spray={desktop ? 200 : 110} reduced={reduced} />
          {!reduced && <Sparkles count={desktop ? 60 : 24} scale={[22, 9, 18]} position={[0, 4, 2]} size={2.2} speed={0.25} opacity={0.5} color="#bcd0ff" />}
        </Suspense>
      </Canvas>
    </div>
  )
}
