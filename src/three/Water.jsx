import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const tmp = new THREE.Object3D()
const rand = (a, b) => a + Math.random() * (b - a)

/** Ambient drips running down the upper glass + interactive spray that follows the pointer. */
export default function Water({ ambient = 70, spray = 160, reduced = false }) {
  const amb = useRef()
  const spr = useRef()
  const { camera, pointer } = useThree()
  const down = useRef(false)
  const lastMove = useRef(0)

  const drops = useMemo(() => Array.from({ length: ambient }, () => ({ x: rand(-1.2, 2.4), y: rand(3.5, 5), z: 3.08, v: rand(0.2, 0.7), s: rand(0.012, 0.03), life: Math.random() })), [ambient])
  const parts = useMemo(() => Array.from({ length: spray }, () => ({ p: new THREE.Vector3(0, -50, 0), v: new THREE.Vector3(), life: 0 })), [spray])
  const head = useRef(0)

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), -3.4), [])
  const ray = useMemo(() => new THREE.Raycaster(), [])
  const hit = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const move = () => { lastMove.current = performance.now() }
    const dn = () => { down.current = true; lastMove.current = performance.now() }
    const up = () => { down.current = false }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', dn, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', dn); window.removeEventListener('pointerup', up) }
  }, [])

  useFrame((_, dt) => {
    dt = Math.min(dt, 0.05)
    if (amb.current && !reduced) {
      drops.forEach((d, i) => {
        d.y -= d.v * dt * 0.9
        d.life += dt * 0.25
        if (d.y < 2.95 || d.life > 1) { d.y = rand(4.6, 5); d.x = rand(-1.2, 2.5); d.life = 0; d.v = rand(0.2, 0.7) }
        tmp.position.set(d.x, d.y, d.z)
        tmp.scale.set(d.s, d.s * (1 + d.v * 3), d.s * 0.6)
        tmp.updateMatrix()
        amb.current.setMatrixAt(i, tmp.matrix)
      })
      amb.current.instanceMatrix.needsUpdate = true
    }
    if (spr.current) {
      const active = performance.now() - lastMove.current < 120 || down.current
      if (active && !reduced) {
        ray.setFromCamera(pointer, camera)
        if (ray.ray.intersectPlane(plane, hit)) {
          for (let k = 0; k < 4; k++) {
            const q = parts[head.current++ % parts.length]
            q.p.copy(hit).add(new THREE.Vector3(rand(-0.08, 0.08), rand(-0.08, 0.08), 0))
            q.v.set(rand(-0.5, 0.5), rand(0.2, 1.2), rand(-1.2, -0.2))
            q.life = 1
          }
        }
      }
      parts.forEach((q, i) => {
        if (q.life > 0) {
          q.life -= dt * 1.4
          q.v.y -= 4.2 * dt
          q.p.addScaledVector(q.v, dt)
          const s = 0.045 * Math.max(q.life, 0)
          tmp.position.copy(q.p)
          tmp.scale.setScalar(s)
        } else {
          tmp.position.set(0, -50, 0); tmp.scale.setScalar(0.0001)
        }
        tmp.updateMatrix()
        spr.current.setMatrixAt(i, tmp.matrix)
      })
      spr.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      <instancedMesh ref={amb} args={[null, null, ambient]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshPhysicalMaterial color="#cfe0ff" transparent opacity={0.55} roughness={0} clearcoat={1} envMapIntensity={3} />
      </instancedMesh>
      <instancedMesh ref={spr} args={[null, null, spray]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#bcd2ff" transparent opacity={0.85} toneMapped={false} />
      </instancedMesh>
    </>
  )
}
