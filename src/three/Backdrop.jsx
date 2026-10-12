import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Studio from './Studio'
import GlassOrb from './GlassOrb'
import { usePointer } from '../hooks/usePointer'

const rnd = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(160,210,255,.7)'); gr.addColorStop(1, 'rgba(0,122,255,0)')
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

/** Camera drifts with the pointer and scroll so every page has depth. */
function Drift({ amount = 1 }) {
  const { camera } = useThree()
  const ptr = usePointer(null)
  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.01, dt)
    const sy = window.scrollY / Math.max(window.innerHeight, 1)
    camera.position.x += (ptr.current.x * 0.8 * amount - camera.position.x) * k
    camera.position.y += (ptr.current.y * 0.5 * amount - sy * 1.2 - camera.position.y) * k
    camera.lookAt(0, -sy * 1.2, 0)
  })
  return null
}

/* ───────── Window Washing: drifting glass panes + light streaks ───────── */
function Panes({ count, reduced }) {
  const ref = useRef(), edge = useRef(), streaks = useRef()
  const data = useMemo(() => {
    const r = rnd(5)
    return Array.from({ length: count }, () => ({ x: (r() - 0.5) * 26, y: (r() - 0.5) * 18, z: -r() * 16 - 1, w: 1.4 + r() * 2.4, h: 1.8 + r() * 2.8, rx: (r() - 0.5) * 0.7, ry: (r() - 0.5) * 0.9, rz: (r() - 0.5) * 0.5, sp: 0.1 + r() * 0.25, ph: r() * 6.28 }))
  }, [count])
  const str = useMemo(() => { const r = rnd(9); return Array.from({ length: 14 }, () => ({ x: (r() - 0.5) * 30, y: (r() - 0.5) * 16, z: -2 - r() * 12, l: 6 + r() * 10, sp: 0.5 + r() * 1.2 })) }, [])
  const o = useMemo(() => new THREE.Object3D(), [])
  useFrame((s) => {
    const t = reduced ? 0 : s.clock.elapsedTime
    data.forEach((d, i) => {
      o.position.set(d.x + Math.sin(t * d.sp + d.ph) * 0.6, d.y + Math.cos(t * d.sp * 0.8 + d.ph) * 0.5, d.z)
      o.rotation.set(d.rx + Math.sin(t * d.sp) * 0.15, d.ry + t * d.sp * 0.2, d.rz); o.scale.set(d.w, d.h, 1); o.updateMatrix()
      ref.current.setMatrixAt(i, o.matrix)
      o.scale.set(d.w + 0.08, d.h + 0.08, 1); o.position.z -= 0.01; o.updateMatrix(); edge.current.setMatrixAt(i, o.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true; edge.current.instanceMatrix.needsUpdate = true
    str.forEach((d, i) => {
      const x = ((d.x + t * d.sp * 2 + 20) % 40) - 20
      o.position.set(x, d.y, d.z); o.rotation.set(0, 0, -0.5); o.scale.set(d.l, 0.025, 1); o.updateMatrix(); streaks.current.setMatrixAt(i, o.matrix)
    })
    streaks.current.instanceMatrix.needsUpdate = true
  })
  return (
    <>
      <instancedMesh ref={ref} args={[null, null, count]} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <meshPhysicalMaterial color="#9cc8ff" transparent opacity={0.1} roughness={0.03} clearcoat={1} envMapIntensity={3.2} side={THREE.DoubleSide} depthWrite={false} />
      </instancedMesh>
      <instancedMesh ref={edge} args={[null, null, count]} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#007aff" transparent opacity={0.07} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} wireframe />
      </instancedMesh>
      <instancedMesh ref={streaks} args={[null, null, 14]} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#7cc4ff" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </instancedMesh>
    </>
  )
}

/* ───────── Pressure Washing: spray jets + drifting mist ───────── */
function Spray({ jets = 3, per = 90, mist = 70, reduced }) {
  const ref = useRef(), mistRef = useRef()
  const tex = useMemo(() => glowTexture(), [])
  const p = useMemo(() => {
    const r = rnd(7); const out = []
    for (let j = 0; j < jets; j++) for (let i = 0; i < per; i++) out.push({ j, t: r(), v: 0.18 + r() * 0.12, sx: (j - 1) * 9 - 6, sy: -6 - r(), vy: 9 + r() * 5, vx: 7 + r() * 4, z: -2 - r() * 6, s: 0.05 + r() * 0.1 })
    return out
  }, [jets, per])
  const m = useMemo(() => { const r = rnd(3); return Array.from({ length: mist }, () => ({ x: (r() - 0.5) * 30, y: (r() - 0.5) * 16, z: -3 - r() * 10, s: 3 + r() * 5, v: 0.1 + r() * 0.25, a: r() })) }, [mist])
  const o = useMemo(() => new THREE.Object3D(), [])
  useFrame((st, dt) => {
    dt = Math.min(dt, 0.05)
    p.forEach((d, i) => {
      d.t += reduced ? 0 : dt * d.v * 2.2; if (d.t > 1) d.t = 0
      const tt = d.t * 2.2
      o.position.set(d.sx + d.vx * tt, d.sy + d.vy * tt - 9 * tt * tt * 0.5, d.z); o.scale.setScalar(d.s * (1 - d.t * 0.4)); o.updateMatrix(); ref.current.setMatrixAt(i, o.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
    const t = reduced ? 0 : st.clock.elapsedTime
    m.forEach((d, i) => {
      o.position.set(d.x + Math.sin(t * d.v + d.a * 6) * 1.2, ((d.y + t * d.v * 0.8 + 9) % 18) - 9, d.z)
      o.scale.setScalar(d.s); o.quaternion.copy(st.camera.quaternion); o.updateMatrix(); mistRef.current.setMatrixAt(i, o.matrix)
    })
    mistRef.current.instanceMatrix.needsUpdate = true
  })
  return (
    <>
      <instancedMesh ref={ref} args={[null, null, jets * per]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#bfe0ff" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={mistRef} args={[null, null, mist]} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={tex} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </instancedMesh>
    </>
  )
}

/* ───────── About: floating glowing particles ───────── */
function Particles({ count, reduced }) {
  const pts = useRef(), big = useRef()
  const tex = useMemo(() => glowTexture(), [])
  const geo = useMemo(() => {
    const r = rnd(11), pos = new Float32Array(count * 3), col = new Float32Array(count * 3), c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      pos.set([(r() - 0.5) * 34, (r() - 0.5) * 20, -r() * 18], i * 3)
      c.set(r() > 0.7 ? '#ffffff' : r() > 0.4 ? '#4da3ff' : '#007aff'); col.set([c.r, c.g, c.b], i * 3)
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); return g
  }, [count])
  const orbs = useMemo(() => { const r = rnd(2); return Array.from({ length: 14 }, () => ({ x: (r() - 0.5) * 28, y: (r() - 0.5) * 14, z: -4 - r() * 12, s: 1.5 + r() * 3.5, v: 0.1 + r() * 0.2, a: r() * 6 })) }, [])
  const o = useMemo(() => new THREE.Object3D(), [])
  useFrame((st) => {
    const t = reduced ? 0 : st.clock.elapsedTime
    pts.current.rotation.y = t * 0.012; pts.current.position.y = Math.sin(t * 0.15) * 0.4
    orbs.forEach((d, i) => { o.position.set(d.x + Math.sin(t * d.v + d.a) * 1.5, d.y + Math.cos(t * d.v * 0.9 + d.a) * 1.2, d.z); o.scale.setScalar(d.s); o.quaternion.copy(st.camera.quaternion); o.updateMatrix(); big.current.setMatrixAt(i, o.matrix) })
    big.current.instanceMatrix.needsUpdate = true
  })
  return (
    <>
      <points ref={pts} geometry={geo}><pointsMaterial map={tex} size={0.34} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation toneMapped={false} /></points>
      <instancedMesh ref={big} args={[null, null, 14]} frustumCulled={false}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={tex} transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></instancedMesh>
    </>
  )
}

/* ───────── Commercial: glass towers at night ───────── */
function City({ reduced }) {
  const ref = useRef()
  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 128; c.height = 256
    const g = c.getContext('2d'); g.fillStyle = '#0a1d4a'; g.fillRect(0, 0, 128, 256)
    const r = rnd(4)
    for (let y = 6; y < 250; y += 12) for (let x = 6; x < 122; x += 12) { const on = r() > 0.55; g.fillStyle = on ? (r() > 0.5 ? '#9cd0ff' : '#ffffff') : '#10306e'; g.globalAlpha = on ? 0.3 + r() * 0.4 : 1; g.fillRect(x, y, 7, 8) }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
  }, [])
  const towers = useMemo(() => {
    const r = rnd(15); const a = []
    for (let row = 0; row < 3; row++) for (let i = 0; i < 14; i++) a.push({ x: (i - 7) * 3.2 + (r() - 0.5) * 1.2 + row, z: -16 - row * 9, w: 1.8 + r() * 1.6, h: 5 + r() * 10 + row * 3, d: 1.6 + r() })
    return a
  }, [])
  const o = useMemo(() => new THREE.Object3D(), [])
  useFrame((s) => {
    const t = reduced ? 0 : s.clock.elapsedTime
    towers.forEach((d, i) => { o.position.set(d.x, -9 + d.h / 2 + Math.sin(t * 0.2 + i) * 0.04, d.z); o.scale.set(d.w, d.h, d.d); o.updateMatrix(); ref.current.setMatrixAt(i, o.matrix) })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[null, null, towers.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0.45} roughness={0.25} metalness={0.7} envMapIntensity={0.8} />
    </instancedMesh>
  )
}

function Content({ kind, full, reduced }) {
  switch (kind) {
    case 'panes': return <><Studio res={128} /><ambientLight intensity={0.4} /><Panes count={full ? 18 : 10} reduced={reduced} /></>
    case 'spray': return <Spray jets={3} per={full ? 90 : 50} mist={full ? 70 : 36} reduced={reduced} />
    case 'particles': return <Particles count={full ? 420 : 220} reduced={reduced} />
    case 'city': return <><Studio res={128} /><fog attach="fog" args={['#000000', 18, 58]} /><City reduced={reduced} /></>
    case 'orbit': return <group position={[full ? 5.6 : 0.6, full ? 1.8 : 3, -3]} scale={full ? 1.25 : 1}><GlassOrb full={full} reduced={reduced} calm /></group>
    default: return null
  }
}

export default function Backdrop({ kind, full, reduced }) {
  return (
    <Canvas
      dpr={[1, full ? 1.5 : 1.15]}
      camera={{ fov: 50, near: 0.1, far: 120, position: [0, 0, 10] }}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
      onCreated={({ gl }) => { gl.setClearColor(0, 0); gl.toneMapping = THREE.ACESFilmicToneMapping }}
    >
      <Drift amount={kind === 'orbit' ? 0.4 : 1} />
      <Content kind={kind} full={full} reduced={reduced} />
    </Canvas>
  )
}
