import { useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Studio from './Studio'
import { tx } from '../lib/tx'

const rnd = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

const TUNNEL = { near: 6, far: -48 }

/** Glass frames / panes / cards flying past the camera. */
function Frames({ kind, count }) {
  const bars = useRef(), glow = useRef(), pane = useRef()
  const bar = kind === 'cards' ? 0 : 1
  useLayoutEffect(() => {
    const r = rnd(7 + (kind === 'panes' ? 3 : 0))
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3()
    let bi = 0
    for (let i = 0; i < count; i++) {
      const ang = r() * Math.PI * 2, rad = 2.6 + r() * 6.5
      const cx = Math.cos(ang) * rad, cy = Math.sin(ang) * rad * 0.62, cz = TUNNEL.near - (i / count) * (TUNNEL.near - TUNNEL.far)
      const w = kind === 'cards' ? 2.2 + r() : kind === 'panes' ? 2.4 + r() * 1.4 : 1.8 + r() * 2.2
      const h = kind === 'cards' ? w * 1.35 : kind === 'panes' ? w * 1.25 : w * (0.7 + r() * 0.8)
      const rot = (r() - 0.5) * (kind === 'panes' ? 0.18 : 0.9)
      e.set((r() - 0.5) * 0.5, (r() - 0.5) * 0.7, rot)
      q.setFromEuler(e)
      const place = (lx, ly, sx, sy, sz, arr, idx) => {
        const o = new THREE.Vector3(lx, ly, 0).applyQuaternion(q)
        p.set(cx + o.x, cy + o.y, cz + o.z); s.set(sx, sy, sz)
        m.compose(p, q, s); arr.setMatrixAt(idx, m)
      }
      place(0, 0, w, h, 1, pane.current, i)
      if (bar) {
        const t = 0.09
        ;[[0, h / 2, w + t, t], [0, -h / 2, w + t, t], [-w / 2, 0, t, h], [w / 2, 0, t, h]].forEach(([lx, ly, sx, sy]) => {
          place(lx, ly, sx, sy, 0.12, bars.current, bi)
          place(lx, ly, sx * 1.04, sy * 1.04 + 0.05, 0.3, glow.current, bi)
          bi++
        })
      } else {
        place(0, 0, w + 0.12, h + 0.12, 0.05, glow.current, i)
      }
    }
    ;[bars.current, glow.current, pane.current].forEach((m2) => m2 && (m2.instanceMatrix.needsUpdate = true))
  }, [kind, count, bar])

  const nBars = bar ? count * 4 : 0
  return (
    <>
      <instancedMesh ref={pane} args={[null, null, count]} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <meshPhysicalMaterial color="#9cc8ff" transparent opacity={0.2} roughness={0.04} metalness={0.1} clearcoat={1} envMapIntensity={3} side={THREE.DoubleSide} depthWrite={false} />
      </instancedMesh>
      {bar ? (
        <instancedMesh ref={bars} args={[null, null, nBars]} frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#e6f1ff" metalness={0.85} roughness={0.25} envMapIntensity={2} />
        </instancedMesh>
      ) : <group ref={bars} />}
      <instancedMesh ref={glow} args={[null, null, bar ? nBars : count]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#007aff" transparent opacity={bar ? 0.55 : 0.28} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </instancedMesh>
    </>
  )
}

function Drops({ count }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const r = rnd(11)
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      const ang = r() * 6.283, rad = 1.6 + r() * 8
      p.set(Math.cos(ang) * rad, Math.sin(ang) * rad * 0.65, TUNNEL.near - r() * (TUNNEL.near - TUNNEL.far))
      const k = 0.12 + r() * 0.5
      s.set(k, k, k * (1.6 + r() * 2))
      m.compose(p, q, s); ref.current.setMatrixAt(i, m)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [count])
  return (
    <instancedMesh ref={ref} args={[null, null, count]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 2]} />
      <meshPhysicalMaterial color="#b6dcff" emissive="#007aff" emissiveIntensity={0.7} roughness={0.05} clearcoat={1} transparent opacity={0.85} envMapIntensity={2.5} />
    </instancedMesh>
  )
}

function Rings({ count }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const r = rnd(5)
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const k = 1.8 + r() * 4.5
      p.set((r() - 0.5) * 2.5, (r() - 0.5) * 1.5, TUNNEL.near - (i / count) * (TUNNEL.near - TUNNEL.far))
      e.set((r() - 0.5) * 0.35, (r() - 0.5) * 0.35, r() * 6)
      q.setFromEuler(e); s.set(k, k, k)
      m.compose(p, q, s); ref.current.setMatrixAt(i, m)
      c.set(r() > 0.5 ? '#007aff' : '#7cc4ff'); ref.current.setColorAt(i, c)
    }
    ref.current.instanceMatrix.needsUpdate = true; ref.current.instanceColor.needsUpdate = true
  }, [count])
  return (
    <instancedMesh ref={ref} args={[null, null, count]} frustumCulled={false}>
      <torusGeometry args={[1, 0.018, 12, 96]} />
      <meshBasicMaterial transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  )
}

/** Speed streaks give the fly-through its sense of velocity. */
function Streaks({ count }) {
  const ref = useRef()
  const base = useMemo(() => {
    const r = rnd(3)
    return Array.from({ length: count }, () => {
      const a = r() * 6.283, rad = 1.2 + r() * 10
      return { x: Math.cos(a) * rad, y: Math.sin(a) * rad * 0.7, z: TUNNEL.near - r() * (TUNNEL.near - TUNNEL.far), l: 0.6 + r() * 1.4 }
    })
  }, [count])
  const tmp = useMemo(() => new THREE.Object3D(), [])
  useFrame(() => {
    const len = 0.4 + tx.speed * 70
    base.forEach((b, i) => {
      tmp.position.set(b.x, b.y, b.z); tmp.scale.set(0.012, 0.012, b.l * len); tmp.updateMatrix()
      ref.current.setMatrixAt(i, tmp.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[null, null, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#8cc8ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  )
}

const veilMat = new THREE.ShaderMaterial({
  transparent: true, depthTest: false, depthWrite: false,
  uniforms: { uA: { value: 0 }, uFlash: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
  fragmentShader: `varying vec2 vUv; uniform float uA; uniform float uFlash;
    void main(){
      vec2 c = vUv - .5; float d = length(c);
      vec3 deep = vec3(.02,.05,.14); vec3 mid = vec3(.0,.28,.75); vec3 hot = vec3(.45,.78,1.);
      vec3 col = mix(mid, deep, smoothstep(.0,.75,d));
      col += hot * uFlash * smoothstep(.55,.0,d);
      gl_FragColor = vec4(col, uA);
    }`,
})

function Rig({ kind }) {
  const { camera } = useThree()
  const group = useRef()
  useFrame((_, dt) => {
    const p = tx.p
    tx.speed += ((Math.abs(p - tx.last) / Math.max(dt, 0.001)) * 0.02 - tx.speed) * 0.2
    tx.last = p
    group.current.visible = p > 0.001 && p < 0.999
    const e = p
    camera.position.set(Math.sin(p * 5) * 0.4, Math.cos(p * 4) * 0.25, THREE.MathUtils.lerp(12, -44, e))
    camera.rotation.z = Math.sin(p * 3.1) * 0.06
    veilMat.uniforms.uA.value = smooth(0.26, 0.47, p) * (1 - smooth(0.56, 0.8, p))
    veilMat.uniforms.uFlash.value = Math.exp(-Math.pow((p - 0.5) * 7, 2)) * 0.9
  })
  return (
    <group ref={group}>
      {kind === 'drops' ? <Drops count={70} />
        : kind === 'rings' ? <Rings count={26} />
        : <Frames kind={kind} count={kind === 'cards' ? 16 : 22} />}
      <Streaks count={140} />
    </group>
  )
}

export default function TransitionScene({ active, kind, mobile }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, mobile ? 1.25 : 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      camera={{ fov: 60, near: 0.1, far: 120, position: [0, 0, 12] }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none' }}
      onCreated={({ gl, scene, camera }) => { gl.setClearColor(0, 0); gl.toneMapping = THREE.ACESFilmicToneMapping; requestAnimationFrame(() => gl.compile(scene, camera)) }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 4]} intensity={30} color="#4da3ff" distance={30} />
      <Studio res={64} />
      <Rig kind={kind} />
      <mesh renderOrder={999} frustumCulled={false} material={veilMat}><planeGeometry args={[2, 2]} /></mesh>
    </Canvas>
  )
}
