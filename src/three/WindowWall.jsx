import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import Studio from './Studio'
import { makeGrimeMaterial } from './glass'
import { usePointer } from '../hooks/usePointer'

function skyTexture(i) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 384
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 0, 384)
  grad.addColorStop(0, '#0a4fc4'); grad.addColorStop(0.5, '#4da3ff'); grad.addColorStop(1, '#d6ebff')
  g.fillStyle = grad; g.fillRect(0, 0, 256, 384)
  g.fillStyle = 'rgba(255,255,255,.85)'
  ;[[70, 90, 60, 16], [170, 140, 70, 18], [110, 230, 80, 14]].forEach(([x, y, rx, ry], k) => { g.beginPath(); g.ellipse(x + ((i * 17 + k * 31) % 40), y, rx, ry, 0, 0, 7); g.fill() })
  g.fillStyle = 'rgba(8,30,90,.55)'
  g.beginPath(); g.moveTo(0, 384); g.lineTo(0, 320); g.bezierCurveTo(80, 290, 140, 330, 256, 300); g.lineTo(256, 384); g.fill()
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}

function Unit({ x, y, i, w = 1.7, h = 2.2, reduced }) {
  const g = useRef()
  const tex = useMemo(() => skyTexture(i), [i])
  const grime = useMemo(() => makeGrimeMaterial(i * 0.17, w / h, reduced), [i, w, h, reduced])
  useFrame((s) => {
    if (!reduced) {
      grime.uniforms.uTime.value = s.clock.elapsedTime
      g.current.position.z = Math.sin(s.clock.elapsedTime * 0.8 + i * 1.3) * 0.12 + (i % 2) * 0.1
    }
  })
  const f = { color: '#0c1c46', metalness: 0.8, roughness: 0.3 }
  const t = 0.1
  return (
    <group ref={g} position={[x, y, 0]}>
      <mesh position={[0, 0, 0.01]}><planeGeometry args={[w, h]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
      <mesh position={[0, 0, 0.08]}><planeGeometry args={[w, h]} /><meshPhysicalMaterial color="#cfe3ff" transparent opacity={0.14} roughness={0.02} clearcoat={1} envMapIntensity={3.4} depthWrite={false} /></mesh>
      <mesh position={[0, 0, 0.09]} material={grime}><planeGeometry args={[w, h]} /></mesh>
      {[[0, h / 2, w + t * 2, t], [0, -h / 2, w + t * 2, t], [-w / 2, 0, t, h], [w / 2, 0, t, h], [0, 0, 0.04, h]].map(([a, b, c, d], k) => (
        <mesh key={k} position={[a, b, 0.07]}><boxGeometry args={[c, d, 0.2]} /><meshStandardMaterial {...f} emissive="#007aff" emissiveIntensity={k === 4 ? 0.2 : 0.35} /></mesh>
      ))}
    </group>
  )
}

function Drips({ count = 60 }) {
  const ref = useRef()
  const d = useMemo(() => Array.from({ length: count }, () => ({ x: (Math.random() - 0.5) * 6, y: Math.random() * 5 - 2.5, z: 0.5 + Math.random() * 0.8, v: 0.3 + Math.random() * 0.8, s: 0.012 + Math.random() * 0.03 })), [count])
  const o = useMemo(() => new THREE.Object3D(), [])
  useFrame((_, dt) => {
    d.forEach((p, i) => {
      p.y -= p.v * dt; if (p.y < -2.8) p.y = 2.8
      o.position.set(p.x, p.y, p.z); o.scale.set(p.s, p.s * (1 + p.v * 3), p.s); o.updateMatrix(); ref.current.setMatrixAt(i, o.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh ref={ref} args={[null, null, count]} frustumCulled={false}><sphereGeometry args={[1, 8, 8]} /><meshPhysicalMaterial color="#d9ecff" transparent opacity={0.7} roughness={0} clearcoat={1} envMapIntensity={3} /></instancedMesh>
}

export default function WindowWall({ reduced, full }) {
  const grp = useRef(), light = useRef()
  const dom = useThree((s) => s.gl.domElement)
  const ref = useMemo(() => ({ current: dom }), [dom])
  const ptr = usePointer(ref)
  const { viewport } = useThree()
  useFrame((s, dt) => {
    const k = 1 - Math.pow(0.001, dt)
    grp.current.rotation.y += (ptr.current.x * 0.45 - grp.current.rotation.y) * k
    grp.current.rotation.x += (-ptr.current.y * 0.25 - grp.current.rotation.x) * k
    light.current.position.x += (ptr.current.x * 4 - light.current.position.x) * k
    light.current.position.y += (ptr.current.y * 3 - light.current.position.y) * k
  })
  const scale = Math.min(1, viewport.width / 6.2)
  return (
    <>
      <Studio res={full ? 256 : 128} />
      <ambientLight intensity={0.35} />
      <pointLight ref={light} position={[0, 0, 3.5]} intensity={full ? 45 : 28} color="#bfe0ff" distance={14} />
      <pointLight position={[-4, 3, 2]} intensity={25} color="#007aff" distance={14} />
      <group ref={grp} scale={scale} rotation={[0, -0.35, 0]}>
        <RoundedBox args={[6.2, 5.2, 0.35]} radius={0.18} smoothness={4} position={[0, 0, -0.25]}>
          <meshPhysicalMaterial color="#0b1c4a" roughness={0.45} metalness={0.5} clearcoat={0.6} envMapIntensity={1.2} />
        </RoundedBox>
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <Unit key={n} i={n + 1} x={-1.95 + (n % 3) * 1.95} y={1.28 - Math.floor(n / 3) * 2.5} reduced={reduced} />
        ))}
        {!reduced && <Drips count={full ? 70 : 36} />}
      </group>
    </>
  )
}
