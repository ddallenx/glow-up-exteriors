import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Studio from './Studio'
import { paverTexture } from './textures'

const W = 1024, H = 640
const prng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

function dirtCanvas() {
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const g = c.getContext('2d', { willReadFrequently: true })
  const r = prng(12)
  g.fillStyle = '#44493f'; g.fillRect(0, 0, W, H)
  for (let i = 0; i < 420; i++) {
    const x = r() * W, y = r() * H, rad = 20 + r() * 80
    const gr = g.createRadialGradient(x, y, 0, x, y, rad)
    const col = r() > 0.55 ? '26,32,22' : '88,104,62'
    gr.addColorStop(0, `rgba(${col},${0.25 + r() * 0.3})`); gr.addColorStop(1, `rgba(${col},0)`)
    g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2)
  }
  g.fillStyle = 'rgba(18,18,14,.35)'
  for (let i = 0; i < 3000; i++) g.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2)
  return c
}

const SPRAY = 90, SPLASH = 50
const up = new THREE.Vector3(0, 0, 1)

/** A tilted paver slab covered in grime. Aim the pressure wand with the cursor to wash it clean. */
export default function WashSlab({ api, onProgress, full, reduced }) {
  const grp = useRef(), dirtMesh = useRef(), nozzle = useRef(), cone = useRef(), jet = useRef(), splash = useRef()
  const hit = useRef(new THREE.Vector3(0, 0, 0.02)), want = useRef(false), glow = useRef(0)
  const state = useRef({ last: null, touched: false, auto: null, t: 0 })
  const dom = useThree((s) => s.gl.domElement)
  const clean = useMemo(() => paverTexture([3.2, 2]), [])
  const dirt = useMemo(() => dirtCanvas(), [])
  const dirtTex = useMemo(() => { const t = new THREE.CanvasTexture(dirt); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t }, [dirt])
  const jetP = useMemo(() => Array.from({ length: SPRAY }, () => ({ t: Math.random(), v: 0.9 + Math.random() * 0.8, o: new THREE.Vector3((Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.08, 0) })), [])
  const splP = useMemo(() => Array.from({ length: SPLASH }, () => ({ p: new THREE.Vector3(0, 0, -5), v: new THREE.Vector3(), life: 0 })), [])
  const obj = useMemo(() => new THREE.Object3D(), [])
  const head = useRef(0)

  const erase = (u, v) => {
    const g = dirt.getContext('2d')
    const x = u * W, y = (1 - v) * H
    const l = state.current.last
    g.save(); g.globalCompositeOperation = 'destination-out'
    const rad = 46
    const steps = l ? Math.ceil(Math.hypot(x - l.x, y - l.y) / (rad * 0.3)) : 1
    for (let i = 1; i <= steps; i++) {
      const px = l ? l.x + ((x - l.x) * i) / steps : x, py = l ? l.y + ((y - l.y) * i) / steps : y
      const gr = g.createRadialGradient(px, py, 0, px, py, rad)
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.65, 'rgba(0,0,0,.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = gr; g.beginPath(); g.arc(px, py, rad, 0, 6.283); g.fill()
    }
    g.restore(); state.current.last = { x, y }; dirtTex.needsUpdate = true
  }

  const measure = () => {
    const s = document.createElement('canvas'); s.width = 40; s.height = 25
    const g = s.getContext('2d', { willReadFrequently: true }); g.drawImage(dirt, 0, 0, 40, 25)
    const d = g.getImageData(0, 0, 40, 25).data
    let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] < 40) n++
    const p = Math.round((n / 1000) * 100); onProgress?.(p >= 94 ? 100 : p)
    if (p >= 94) { const c = dirt.getContext('2d'); c.clearRect(0, 0, W, H); dirtTex.needsUpdate = true }
  }

  useEffect(() => {
    if (!api) return
    api.current = {
      auto() { state.current.auto = { t: 0 }; state.current.last = null },
      reset() { const c = dirt.getContext('2d'); c.clearRect(0, 0, W, H); const fresh = dirtCanvas(); c.drawImage(fresh, 0, 0); dirtTex.needsUpdate = true; state.current.last = null; state.current.auto = null; onProgress?.(0) },
    }
    const id = setInterval(measure, 450)
    // gentle hint once, if the visitor has not touched it
    const hint = setTimeout(() => { if (!state.current.touched && !reduced) api.current.auto() }, 1800)
    return () => { clearInterval(id); clearTimeout(hint) }
  }, [])

  const onMove = (e) => {
    state.current.touched = true; state.current.auto = null
    e.stopPropagation()
    hit.current.copy(dirtMesh.current.worldToLocal(e.point.clone()))
    want.current = true
    if (e.uv) erase(e.uv.x, e.uv.y)
  }

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime
    // idle sway
    grp.current.rotation.z = Math.sin(t * 0.3) * 0.04
    // auto-wash serpentine
    const a = state.current.auto
    if (a) {
      a.t += dt / 5
      const rows = 6, tt = Math.min(a.t, 1) * rows, row = Math.min(Math.floor(tt), rows - 1), f = tt - row
      const u = row % 2 ? 1 - f : f, v = (row + 0.5) / rows
      hit.current.set((u - 0.5) * 6, (v - 0.5) * 3.75, 0.02); want.current = true
      erase(u, 1 - v)
      if (a.t >= 1) { state.current.auto = null; measure() }
    }
    const on = want.current
    glow.current += ((on ? 1 : 0) - glow.current) * (1 - Math.pow(0.002, dt))
    want.current = false
    // nozzle + cone + jet particles (local to slab plane)
    const tip = new THREE.Vector3(hit.current.x + 1.5, hit.current.y + 1.3, 1.6)
    nozzle.current.position.copy(tip)
    nozzle.current.quaternion.setFromUnitVectors(up, hit.current.clone().sub(tip).normalize().multiplyScalar(-1))
    nozzle.current.visible = glow.current > 0.02
    const dir = hit.current.clone().sub(tip), len = dir.length()
    cone.current.position.copy(tip).addScaledVector(dir, 0.5)
    cone.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
    cone.current.scale.set(1, len, 1)
    cone.current.material.opacity = 0.32 * glow.current
    jetP.forEach((p, i) => {
      p.t += dt * p.v * 2.2
      if (p.t > 1) {
        p.t = 0
        if (glow.current > 0.3) { const q = splP[head.current++ % SPLASH]; q.p.copy(hit.current); q.v.set((Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 2.2, 0.8 + Math.random() * 1.2); q.life = 1 }
      }
      obj.position.copy(tip).addScaledVector(dir, p.t).add(p.o); obj.position.z += Math.sin(p.t * Math.PI) * 0.05
      const k = 0.032 * glow.current
      obj.scale.set(k, k, k); obj.updateMatrix(); jet.current.setMatrixAt(i, obj.matrix)
    })
    jet.current.instanceMatrix.needsUpdate = true
    splP.forEach((q, i) => {
      if (q.life > 0) { q.life -= dt * 1.8; q.v.z -= 5 * dt; q.p.addScaledVector(q.v, dt); if (q.p.z < 0.02) { q.p.z = 0.02; q.v.z *= -0.2 } obj.position.copy(q.p); obj.scale.setScalar(0.03 * q.life) }
      else { obj.position.set(0, 0, -5); obj.scale.setScalar(0.0001) }
      obj.updateMatrix(); splash.current.setMatrixAt(i, obj.matrix)
    })
    splash.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <Studio res={full ? 256 : 128} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-4, 6, 5]} intensity={2.2} color="#dbeaff" />
      <pointLight position={[3, 2, 4]} intensity={30} color="#007aff" />
      <group ref={grp} rotation={[-0.95, 0, 0]} position={[0, -0.3, 0]}>
        <mesh position={[0, 0, -0.2]}><boxGeometry args={[6.2, 3.95, 0.4]} /><meshStandardMaterial color="#1a2345" roughness={0.7} /></mesh>
        <mesh><planeGeometry args={[6, 3.75]} /><meshPhysicalMaterial map={clean} roughness={0.28} clearcoat={0.6} clearcoatRoughness={0.25} envMapIntensity={1.4} /></mesh>
        <mesh ref={dirtMesh} position={[0, 0, 0.012]} onPointerMove={onMove} onPointerDown={onMove} onPointerOut={() => { state.current.last = null }}>
          <planeGeometry args={[6, 3.75]} />
          <meshStandardMaterial map={dirtTex} transparent roughness={1} />
        </mesh>
        {/* wand */}
        <group ref={nozzle}>
          <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.05, 0.05, 1.1, 14]} /><meshStandardMaterial color="#dfe9ff" metalness={0.9} roughness={0.2} /></mesh>
          <mesh position={[0, -0.08, 0]}><coneGeometry args={[0.09, 0.2, 14]} /><meshStandardMaterial color="#007aff" metalness={0.6} roughness={0.3} emissive="#007aff" emissiveIntensity={0.6} /></mesh>
        </group>
        <mesh ref={cone}><cylinderGeometry args={[0.2, 0.02, 1, 16, 1, true]} /><meshBasicMaterial color="#8cc8ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>
        <instancedMesh ref={jet} args={[null, null, SPRAY]} frustumCulled={false}><sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color="#cfe6ff" toneMapped={false} /></instancedMesh>
        <instancedMesh ref={splash} args={[null, null, SPLASH]} frustumCulled={false}><sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color="#e6f2ff" transparent opacity={0.9} toneMapped={false} /></instancedMesh>
      </group>
    </>
  )
}
