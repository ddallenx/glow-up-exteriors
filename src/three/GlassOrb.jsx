import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import Studio from './Studio'
import { usePointer } from '../hooks/usePointer'

function Satellites({ count = 26 }) {
  const ref = useRef()
  const o = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => ({ a: (i / count) * 6.283, r: 2.2 + Math.random() * 1.3, y: (Math.random() - 0.5) * 2.4, s: 0.04 + Math.random() * 0.1, v: 0.15 + Math.random() * 0.35 })), [count])
  useFrame((st) => {
    const t = st.clock.elapsedTime
    seeds.forEach((p, i) => {
      const a = p.a + t * p.v
      o.position.set(Math.cos(a) * p.r, p.y + Math.sin(t * p.v * 2 + i) * 0.2, Math.sin(a) * p.r)
      o.scale.setScalar(p.s); o.updateMatrix(); ref.current.setMatrixAt(i, o.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh ref={ref} args={[null, null, count]} frustumCulled={false}><sphereGeometry args={[1, 12, 12]} /><meshBasicMaterial color="#7cc4ff" toneMapped={false} /></instancedMesh>
}

/** Liquid-glass droplet with orbiting rings. Reacts to cursor and to how far its container has scrolled into view. */
export default function GlassOrb({ full, reduced, container, calm = false }) {
  const core = useRef(), rings = useRef(), wrap = useRef()
  const dom = useThree((s) => s.gl.domElement)
  const ptr = usePointer(useMemo(() => ({ current: dom }), [dom]))
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime
    const k = 1 - Math.pow(0.002, dt)
    let prog = 0.5
    if (container?.current) { const r = container.current.getBoundingClientRect(); prog = 1 - (r.top + r.height / 2) / (window.innerHeight + r.height) }
    const tx = ptr.current.x * 0.7, ty = -ptr.current.y * 0.5
    wrap.current.rotation.y += ((reduced ? 0 : t * 0.15) + tx + prog * 2.4 - wrap.current.rotation.y) * k
    wrap.current.rotation.x += (ty + (prog - 0.5) * 0.6 - wrap.current.rotation.x) * k
    const sc = 0.85 + Math.min(1, Math.max(0, prog)) * 0.25
    wrap.current.scale.setScalar(THREE.MathUtils.lerp(wrap.current.scale.x, sc, k))
    if (!reduced) { rings.current.children.forEach((r, i) => { r.rotation.x = t * (0.2 + i * 0.12); r.rotation.y = t * (0.15 - i * 0.07) }) }
  })
  return (
    <>
      <Studio res={full ? 256 : 128} intensity={1.2} />
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 4]} intensity={30} color="#9cc8ff" />
      <group ref={wrap}>
        <Float speed={reduced ? 0 : 1.6} rotationIntensity={0.3} floatIntensity={calm ? 0.2 : 0.7}>
          <mesh ref={core}>
            <icosahedronGeometry args={[1.35, full ? 24 : 12]} />
            {full ? (
              <MeshTransmissionMaterial samples={6} resolution={512} thickness={1.4} ior={1.35} chromaticAberration={0.08} anisotropicBlur={0.3} distortion={0.35} distortionScale={0.4} temporalDistortion={reduced ? 0 : 0.12} roughness={0.02} color="#bcdcff" backside backsideThickness={0.4} envMapIntensity={2.4} />
            ) : (
              <meshPhysicalMaterial color="#8cc4ff" roughness={0.04} metalness={0.1} clearcoat={1} transparent opacity={0.55} envMapIntensity={3} />
            )}
          </mesh>
          <mesh scale={0.52}><icosahedronGeometry args={[1, 3]} /><meshBasicMaterial color="#007aff" toneMapped={false} /></mesh>
        </Float>
        <group ref={rings}>
          {[2.1, 2.55, 3.0].map((r, i) => (
            <mesh key={i}><torusGeometry args={[r, 0.012 + i * 0.004, 12, 160]} /><meshBasicMaterial color={i === 1 ? '#ffffff' : '#2fb8ff'} transparent opacity={0.85} toneMapped={false} /></mesh>
          ))}
        </group>
        <Satellites count={full ? 30 : 14} />
      </group>
    </>
  )
}
