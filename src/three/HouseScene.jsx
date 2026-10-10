import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor, Sky } from '@react-three/drei'
import { Bloom, EffectComposer, N8AO, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'
import { gsap } from '../lib/gsap'
import House from './House'
import Water from './Water'

const HORIZON = '#c9b6bd'
const SUN = new THREE.Vector3(-34, 7, 26)

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
    const fit = 19 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect)
    const r = Math.max(desktop ? 27 : 0, fit) * THREE.MathUtils.lerp(1.6, 1, e) + scrollY * 3
    const y = THREE.MathUtils.lerp(10, 4.6, e) + pointer.y * 0.5 - scrollY * 0.8
    const target = new THREE.Vector3(r * Math.sin(az) + 0.5, y, r * Math.cos(az) + 1)
    cur.current.lerp(target, 1 - Math.pow(0.0025, dt))
    camera.position.copy(cur.current)
    const lx = desktop ? -3.0 : 1.6
    look.current.set(lx, portrait ? 2.4 : 2.6, 1.2)
    camera.lookAt(look.current)
  })
  return null
}

/** Golden-hour image-based lighting: warm low sun panel, cool sky dome, bounce from the lawn. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={6} position={[-14, 5, 10]} rotation-y={Math.PI / 2.6} scale={[8, 5, 1]} color="#ffb877" />
      <Lightformer form="rect" intensity={1.6} position={[0, 12, 0]} rotation-x={Math.PI / 2} scale={[30, 30, 1]} color="#8fb2ff" />
      <Lightformer form="rect" intensity={1.2} position={[14, 4, 6]} rotation-y={-Math.PI / 2} scale={[14, 5, 1]} color="#9db8f0" />
      <Lightformer form="rect" intensity={0.9} position={[0, 3, 16]} scale={[30, 5, 1]} color="#f2d6c0" />
      <Lightformer form="rect" intensity={0.5} position={[0, -6, 0]} rotation-x={-Math.PI / 2} scale={[40, 40, 1]} color="#3b5a34" />
    </Environment>
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
        shadows
        dpr={[1, dpr]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ fov: desktop ? 30 : 36, near: 0.1, far: 300, position: [14, 9, 18] }}
        gl={{ antialias: !desktop, powerPreference: 'high-performance' }}
        style={{ touchAction: 'pan-y' }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1 }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <fog attach="fog" args={[HORIZON, 38, 105]} />
        <Rig desktop={desktop} reduced={reduced} />
        <Sky distance={200} sunPosition={SUN.toArray()} turbidity={8} rayleigh={2.2} mieCoefficient={0.006} mieDirectionalG={0.85} />

        <hemisphereLight args={['#9db8ff', '#4c6a3a', 0.8]} />
        <directionalLight
          position={SUN.toArray()} intensity={5.2} color="#ffb77a" castShadow
          shadow-mapSize={desktop ? [2048, 2048] : [1024, 1024]}
          shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={14} shadow-camera-bottom={-8} shadow-camera-near={5} shadow-camera-far={90}
          shadow-bias={-0.0003} shadow-normalBias={0.04} shadow-radius={4}
        />

        <Suspense fallback={null}>
          <Studio />
          <House desktop={desktop} reduced={reduced} />
          <Water ambient={desktop ? 90 : 45} spray={desktop ? 200 : 110} reduced={reduced} />
        </Suspense>

        {desktop && (
          <EffectComposer multisampling={4} disableNormalPass>
            <N8AO aoRadius={1.4} intensity={2.6} distanceFalloff={1} quality="medium" halfRes />
            <Bloom luminanceThreshold={1} intensity={0.45} mipmapBlur radius={0.7} />
            <Vignette offset={0.25} darkness={0.5} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
