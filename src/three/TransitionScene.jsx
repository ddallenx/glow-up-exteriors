import { Suspense, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Studio from './Studio'
import { LogoSlab } from './LogoSlab'
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

/** Glass shatter: shards explode outward past the camera. */
function Shatter({ count = 120 }) {
  const ref = useRef()
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute([-0.5, -0.4, 0, 0.55, -0.3, 0, 0.05, 0.6, 0], 3))
    g.computeVertexNormals(); return g
  }, [])
  const shards = useMemo(() => {
    const r = rnd(21)
    return Array.from({ length: count }, () => {
      const x = (r() - 0.5) * 26, y = (r() - 0.5) * 15
      const d = new THREE.Vector3(x, y, 0).normalize()
      return { x, y, z: -9 + r() * 4, s: 0.8 + r() * 2.4, dx: d.x * (6 + r() * 14), dy: d.y * (6 + r() * 14), dz: 10 + r() * 26, rx: (r() - 0.5) * 6, ry: (r() - 0.5) * 6, rz: (r() - 0.5) * 6 }
    })
  }, [count])
  const o = useMemo(() => new THREE.Object3D(), [])
  useFrame(() => {
    const t = smooth(0.1, 0.8, tx.p)
    shards.forEach((s2, i) => {
      o.position.set(s2.x + s2.dx * t, s2.y + s2.dy * t, s2.z + s2.dz * t)
      o.rotation.set(s2.rx * t, s2.ry * t, s2.rz * t); o.scale.setScalar(s2.s * (1 - t * 0.2)); o.updateMatrix()
      ref.current.setMatrixAt(i, o.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[geo, null, count]} frustumCulled={false}>
      <meshPhysicalMaterial color="#a9d2ff" emissive="#007aff" emissiveIntensity={0.35} transparent opacity={0.42} roughness={0.04} metalness={0.2} clearcoat={1} envMapIntensity={3} side={THREE.DoubleSide} depthWrite={false} />
    </instancedMesh>
  )
}

/** Water ripple: concentric rings expand from the centre, with a splash of droplets. */
function Ripple({ rings = 14, drops = 70 }) {
  const rr = useRef(), dd = useRef()
  const o = useMemo(() => new THREE.Object3D(), [])
  const c = useMemo(() => new THREE.Color(), [])
  const dp = useMemo(() => { const r = rnd(33); return Array.from({ length: drops }, () => ({ a: r() * 6.283, v: 2 + r() * 8, u: 4 + r() * 9, s: 0.05 + r() * 0.16 })) }, [drops])
  useLayoutEffect(() => { for (let i = 0; i < rings; i++) rr.current.setColorAt(i, c.set('#fff')) }, [rings, c])
  useFrame(() => {
    const p = tx.p
    for (let i = 0; i < rings; i++) {
      const ph = Math.max(0, p * 1.9 - i * 0.075)
      o.position.set(0, 0, 0); o.rotation.set(0, 0, 0); o.scale.setScalar(Math.max(0.001, ph * 30)); o.updateMatrix()
      rr.current.setMatrixAt(i, o.matrix)
      const f = Math.max(0, 1 - ph * 1.1) * (ph > 0 ? 1 : 0)
      rr.current.setColorAt(i, c.set(i % 3 === 0 ? '#ffffff' : '#2fb8ff').multiplyScalar(f * 1.2))
    }
    rr.current.instanceMatrix.needsUpdate = true; rr.current.instanceColor.needsUpdate = true
    const t = p * 2.6
    dp.forEach((d, i) => {
      const life = Math.max(0, t - 0.05)
      o.position.set(Math.cos(d.a) * d.v * life * 0.6, d.u * life - 6 * life * life + 0.2, Math.sin(d.a) * d.v * life * 0.4)
      o.scale.setScalar(d.s * Math.max(0, 1 - life * 0.55)); o.updateMatrix(); dd.current.setMatrixAt(i, o.matrix)
    })
    dd.current.instanceMatrix.needsUpdate = true
  })
  return (
    <>
      <instancedMesh ref={rr} args={[null, null, rings]} frustumCulled={false} rotation={[0, 0, 0]}>
        <torusGeometry args={[1, 0.012, 10, 128]} />
        <meshBasicMaterial transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={dd} args={[null, null, drops]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial color="#d3eaff" emissive="#007aff" emissiveIntensity={0.5} roughness={0.05} clearcoat={1} transparent opacity={0.9} envMapIntensity={2.5} />
      </instancedMesh>
    </>
  )
}

const BEAM_VERT = 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }'
const BEAM_FRAG = 'varying vec2 vUv; uniform float uI; uniform vec3 uC; void main(){ float d=abs(vUv.x-.5)*2.; float core=exp(-d*d*22.); float halo=exp(-d*d*3.2)*.45; gl_FragColor=vec4(uC*(core*1.6+halo)*uI + vec3(core*.9)*uI, (core+halo)*uI); }'

/** Light sweep: bright beams cross the screen, lens-flare style. */
function Sweep() {
  const g = useRef()
  const beams = useMemo(() => [[6, 0, 1, '#4da3ff'], [2.6, -2.4, 1.12, '#ffffff'], [10, 3.5, 0.88, '#007aff'], [1.2, -5, 1.25, '#9cc8ff']].map(([w, o, s2, c]) => ({ w, o, s: s2, r: 0.32, u: { uI: { value: 0 }, uC: { value: new THREE.Color(c) } } })), [])
  useFrame(() => {
    const t = Math.min(1, Math.max(0, (tx.p - 0.08) / 0.84))
    g.current.children.forEach((m, i) => {
      const b = beams[i]
      m.position.x = THREE.MathUtils.lerp(-24, 24, Math.min(1, t * b.s)) + b.o
      beams[i].u.uI.value = Math.sin(Math.min(1, Math.max(0, t * b.s)) * Math.PI) * 1.1
    })
  })
  return (
    <group ref={g}>
      {beams.map((b, i) => (
        <mesh key={i} position={[0, 0, -1]} rotation={[0, 0, b.r]} frustumCulled={false}>
          <planeGeometry args={[b.w, 60]} />
          <shaderMaterial args={[{ vertexShader: BEAM_VERT, fragmentShader: BEAM_FRAG, uniforms: b.u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }]} />
        </mesh>
      ))}
    </group>
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
  uniforms: { uA: { value: 0 }, uFlash: { value: 0 }, uP: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
  fragmentShader: `varying vec2 vUv; uniform float uA; uniform float uFlash; uniform float uP;
    void main(){
      vec2 c = vUv - .5; c.x *= 1.6; float d = length(c);
      vec3 mid = vec3(.0,.16,.5); vec3 hot = vec3(.5,.82,1.);
      vec3 col = mix(mid, vec3(0.), smoothstep(.0,.62,d));
      float ring = exp(-pow((d - uFlash * .7) * 8., 2.)) * uFlash;
      col += hot * ring * 1.3 + hot * uFlash * smoothstep(.4,.0,d) * .9;
      float ang = atan(c.y, c.x);
      col += vec3(.1,.45,1.) * pow(max(0., sin(ang * 22. + uP * 12.)), 18.) * uFlash * smoothstep(.9,.1,d) * .5;
      col *= 1. - smoothstep(.5,.95,d) * .6;
      gl_FragColor = vec4(col, uA);
    }`,
})

/** Slow cosmic dust drifting past the lens for parallax in every transition. */
function Dust({ count = 160 }) {
  const ref = useRef()
  const d = useMemo(() => { const r = rnd(41); return Array.from({ length: count }, () => ({ x: (r() - 0.5) * 30, y: (r() - 0.5) * 17, z: r() * 60, s: 0.02 + r() * 0.05 })) }, [count])
  const o = useMemo(() => new THREE.Object3D(), [])
  useFrame(() => {
    const t = tx.p * 48
    d.forEach((q, i) => { o.position.set(q.x, q.y, ((q.z + t) % 60) - 48); o.scale.setScalar(q.s); o.updateMatrix(); ref.current.setMatrixAt(i, o.matrix) })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[null, null, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#9fd0ff" transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  )
}

/** The 3D logo emerges at the heart of the transition, always in front of the lens. */
function LogoCenter() {
  const g = useRef()
  const { camera } = useThree()
  useFrame(() => {
    const p = tx.p
    const s = smooth(0.3, 0.5, p) * (1 - smooth(0.64, 0.84, p))
    g.current.visible = s > 0.01
    g.current.position.set(camera.position.x, camera.position.y + 0.4, camera.position.z - 12)
    g.current.scale.setScalar(0.3 + 0.7 * s)
    g.current.rotation.set(0.08, (p - 0.5) * 3.6, 0)
  })
  return <group ref={g}><Suspense fallback={null}><LogoSlab width={15} layers={20} depth={1.6} overlay /></Suspense></group>
}

function Rig({ kind }) {
  const { camera } = useThree()
  const group = useRef()
  useFrame((_, dt) => {
    const p = tx.p
    tx.speed += ((Math.abs(p - tx.last) / Math.max(dt, 0.001)) * 0.02 - tx.speed) * 0.2
    tx.last = p
    group.current.visible = p > 0.001 && p < 0.999
    const e = p
    const fly = kind === 'frames' || kind === 'cards' || kind === 'rings'
    camera.position.set(fly ? Math.sin(p * 5) * 0.4 : 0, fly ? Math.cos(p * 4) * 0.25 : 0, fly ? THREE.MathUtils.lerp(12, -44, e) : 12)
    camera.rotation.z = Math.sin(p * 3.1) * (fly ? 0.06 : 0.035)
    const fov = 60 + Math.sin(Math.min(1, p) * Math.PI) * 30
    if (Math.abs(camera.fov - fov) > 0.05) { camera.fov = fov; camera.updateProjectionMatrix() }
    veilMat.uniforms.uP.value = p
    veilMat.uniforms.uA.value = smooth(0.26, 0.47, p) * (1 - smooth(0.56, 0.8, p))
    veilMat.uniforms.uFlash.value = Math.exp(-Math.pow((p - 0.5) * 7, 2)) * 0.9
  })
  return (
    <group ref={group}>
      {kind === 'shatter' ? <Shatter />
        : kind === 'ripple' ? <Ripple />
        : kind === 'sweep' ? <Sweep />
        : kind === 'rings' ? <Rings count={26} />
        : <Frames kind={kind} count={kind === 'cards' ? 16 : 22} />}
      {(kind === 'frames' || kind === 'cards' || kind === 'rings') && <Streaks count={140} />}
      <Dust />
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
      <LogoCenter />
      <mesh renderOrder={999} frustumCulled={false} material={veilMat}><planeGeometry args={[2, 2]} /></mesh>
    </Canvas>
  )
}
