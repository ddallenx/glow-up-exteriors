import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { makeGrimeMaterial } from './glass'
import {
  claddingMaps, concreteMap, grassMaps, interiorTexture, mulchMap, paverTexture, stoneMaps, stuccoMaps, woodMap,
} from './textures'

const METAL = '#171c2e'
const COPING = '#c9ced9'

function Box({ args, position, rotation, shadows = true, children, ...mat }) {
  return (
    <mesh position={position} rotation={rotation} castShadow={shadows} receiveShadow={shadows}>
      <boxGeometry args={args} />
      <meshStandardMaterial {...mat} />
      {children}
    </mesh>
  )
}

/** Window set into a wall: protruding surround, physical glass, grime-wipe overlay, lit interior behind. */
function GlassWindow({ position, rotation = [0, 0, 0], size, cols = 1, seed = 0, lit = true, reduced }) {
  const [w, h] = size
  const interior = useMemo(() => interiorTexture(seed, lit), [seed, lit])
  const grime = useMemo(() => makeGrimeMaterial(seed * 0.173, w / h, reduced), [seed, w, h, reduced])
  useFrame((s) => { if (!reduced) grime.uniforms.uTime.value = s.clock.elapsedTime })
  const t = 0.09
  const frame = { color: METAL, roughness: 0.4, metalness: 0.7, shadows: false }
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={interior} toneMapped={false} color={lit ? '#ffffff' : '#9aa6c4'} />
      </mesh>
      {/* glass */}
      <mesh position={[0, 0, 0.07]} renderOrder={2}>
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial color="#cfe0ff" roughness={0.02} metalness={0.0} transparent opacity={lit ? 0.16 : 0.5} envMapIntensity={3.2} clearcoat={1} clearcoatRoughness={0} ior={1.52} specularIntensity={1} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.075]} material={grime} renderOrder={3}><planeGeometry args={[w, h]} /></mesh>
      {/* surround */}
      <Box args={[w + t * 2, t, 0.2]} position={[0, h / 2 + t / 2, 0.08]} {...frame} />
      <Box args={[w + t * 2, t, 0.2]} position={[0, -h / 2 - t / 2, 0.08]} {...frame} />
      <Box args={[t, h, 0.2]} position={[-w / 2 - t / 2, 0, 0.08]} {...frame} />
      <Box args={[t, h, 0.2]} position={[w / 2 + t / 2, 0, 0.08]} {...frame} />
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <Box key={i} args={[0.04, h, 0.1]} position={[-w / 2 + ((i + 1) * w) / cols, 0, 0.085]} {...frame} />
      ))}
      <Box args={[w + 0.3, 0.05, 0.34]} position={[0, -h / 2 - t - 0.025, 0.15]} color={COPING} roughness={0.35} metalness={0.6} shadows={false} />
    </group>
  )
}

function Foliage({ count = 220, light = false, rx = 1.3, ry = 1.05, rz = 1.3, base = '#22492f', seed = 1 }) {
  const ref = useRef()
  count = light ? Math.round(count * 0.4) : count
  useLayoutEffect(() => {
    let s = seed * 9301
    const rnd = () => { s = (s * 16807) % 2147483647; return (s % 10000) / 10000 }
    const m = new THREE.Matrix4(), c = new THREE.Color(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, rr = Math.cbrt(rnd())
      const k = Math.sqrt(1 - u * u)
      p.set(rx * rr * k * Math.cos(th), ry * rr * u, rz * rr * k * Math.sin(th))
      const r = 0.17 + rnd() * 0.22
      sc.set(r, r * 0.85, r)
      m.compose(p, q, sc)
      ref.current.setMatrixAt(i, m)
      c.set(base).offsetHSL((rnd() - 0.5) * 0.04, (rnd() - 0.5) * 0.1, (p.y / ry) * 0.06 + (rnd() - 0.5) * 0.07)
      ref.current.setColorAt(i, c)
    }
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [count, rx, ry, rz, base, seed])
  return (
    <instancedMesh ref={ref} args={[null, null, count]} castShadow receiveShadow frustumCulled={false}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial roughness={0.95} />
    </instancedMesh>
  )
}

function Tree({ position, s = 1, seed = 1, base, light }) {
  return (
    <group position={position} scale={s}>
      <mesh position={[0, 1.2, 0]} castShadow><cylinderGeometry args={[0.09, 0.16, 2.4, 10]} /><meshStandardMaterial color="#3a2f2a" roughness={1} /></mesh>
      <group position={[0, 3.2, 0]}><Foliage seed={seed} base={base} light={light} /></group>
    </group>
  )
}

function Shrub({ position, s = 1, seed = 3, light }) {
  return (
    <group position={position} scale={s}>
      <Foliage count={70} rx={0.7} ry={0.5} rz={0.65} base="#2a5a3a" seed={seed} light={light} />
    </group>
  )
}

function Sconce({ position }) {
  return (
    <group position={position}>
      <mesh><cylinderGeometry args={[0.07, 0.07, 0.26, 16]} /><meshStandardMaterial color={METAL} metalness={0.8} roughness={0.35} /></mesh>
      <mesh position={[0, 0, 0.0]}><cylinderGeometry args={[0.055, 0.055, 0.2, 16]} /><meshBasicMaterial color="#ffe3b0" toneMapped={false} /></mesh>
      <pointLight intensity={2.2} distance={4} color="#ffcf8f" decay={2} />
    </group>
  )
}

function PathLight({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.025, 0.03, 0.44, 8]} /><meshStandardMaterial color={METAL} metalness={0.8} roughness={0.35} /></mesh>
      <mesh position={[0, 0.48, 0]}><cylinderGeometry args={[0.09, 0.07, 0.08, 16]} /><meshBasicMaterial color="#ffe0a8" toneMapped={false} /></mesh>
      <pointLight position={[0, 0.5, 0]} intensity={1.2} distance={3} color="#ffd29a" decay={2} />
    </group>
  )
}

function GarageDoor({ position }) {
  return (
    <group position={position}>
      <Box args={[3.5, 2.3, 0.08]} position={[0, 0, 0.02]} color="#d4d9e4" roughness={0.45} metalness={0.2} />
      {[-0.7, -0.15, 0.4, 0.95].map((y, i) => (
        <Box key={i} args={[3.5, 0.025, 0.1]} position={[0, y, 0.04]} color="#8e96a8" roughness={0.6} shadows={false} />
      ))}
      <mesh position={[0, 0.85, 0.075]}><planeGeometry args={[3.2, 0.25]} /><meshPhysicalMaterial color="#a9c4f2" roughness={0.05} metalness={0.2} envMapIntensity={2.5} /></mesh>
      <Box args={[3.66, 0.08, 0.14]} position={[0, 1.2, 0.04]} color={METAL} roughness={0.5} metalness={0.5} shadows={false} />
      <Box args={[0.08, 2.4, 0.14]} position={[-1.79, 0, 0.04]} color={METAL} roughness={0.5} metalness={0.5} shadows={false} />
      <Box args={[0.08, 2.4, 0.14]} position={[1.79, 0, 0.04]} color={METAL} roughness={0.5} metalness={0.5} shadows={false} />
    </group>
  )
}

let cachedMats = null
/** Procedural textures are expensive; build them once (and ahead of time during the intro). */
export function prewarmHouse() {
  if (!cachedMats) {
    cachedMats = {
      stucco: stuccoMaps([1.6, 1]),
      clad: claddingMaps([1.6, 1]),
      stone: stoneMaps([0.7, 1.4]),
      grass: grassMaps([36, 36]),
      wood: woodMap([1, 1]),
      slat: woodMap([1, 1]),
      concrete: concreteMap([1, 3.2]),
      pavers: paverTexture([2.4, 1.2]),
      mulch: mulchMap([8, 1]),
    }
  }
  return cachedMats
}

export default function House({ reduced = false, desktop = true }) {
  const sh = true
  const m = useMemo(() => prewarmHouse(), [])

  return (
    <group>
      {/* lawn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <circleGeometry args={[70, 64]} />
        <meshStandardMaterial map={m.grass.map} bumpMap={m.grass.bump} bumpScale={1.2} roughness={1} />
      </mesh>

      {/* foundation plinth */}
      <Box shadows={sh} args={[12.2, 0.22, 5.4]} position={[1.6, 0.11, 0]} color="#8c93a4" roughness={0.9} />

      {/* GROUND FLOOR — rendered white */}
      <Box shadows={sh} args={[7, 2.7, 5]} position={[-0.5, 1.57, 0]} map={m.stucco.map} bumpMap={m.stucco.bump} bumpScale={0.6} roughness={0.92} color="#ffffff" />
      {/* stone feature wall */}
      <mesh position={[-3.9, 1.57, 2.505]} receiveShadow><planeGeometry args={[0.9, 2.7]} /><meshStandardMaterial map={m.stone.map} bumpMap={m.stone.bump} bumpScale={2.2} roughness={0.95} /></mesh>
      {/* GARAGE */}
      <Box shadows={sh} args={[4.4, 2.6, 4.6]} position={[5.2, 1.52, -0.1]} map={m.clad.map} bumpMap={m.clad.bump} bumpScale={1.4} roughness={0.7} color="#ffffff" />
      <Box shadows={sh} args={[4.8, 0.14, 5.0]} position={[5.2, 2.9, -0.1]} color={COPING} roughness={0.35} metalness={0.7} />
      <GarageDoor position={[5.2, 1.37, 2.21]} />

      {/* UPPER FLOOR — board & batten */}
      <Box shadows={sh} args={[5.2, 2.5, 5]} position={[1.1, 4.17, 0.5]} map={m.clad.map} bumpMap={m.clad.bump} bumpScale={1.4} roughness={0.62} metalness={0.1} color="#ffffff" />
      {/* roof slabs with coping */}
      <Box shadows={sh} args={[5.7, 0.14, 5.5]} position={[1.1, 5.49, 0.5]} color={COPING} roughness={0.32} metalness={0.7} />
      <Box shadows={sh} args={[5.3, 0.2, 5.1]} position={[1.1, 5.35, 0.5]} color="#e6e9f0" roughness={0.6} />
      <Box shadows={sh} args={[7.5, 0.14, 5.4]} position={[-0.5, 2.98, 0]} color={COPING} roughness={0.32} metalness={0.7} />
      {/* wood soffit under cantilever + recessed lights */}
      <mesh position={[1.1, 2.915, 2.78]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.2, 0.5]} />
        <meshStandardMaterial map={m.wood} roughness={0.7} />
      </mesh>
      {[-1, 0.2, 1.4, 2.6].map((x, i) => (
        <mesh key={i} position={[x, 2.905, 2.78]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.07, 20]} /><meshBasicMaterial color="#fff1d0" toneMapped={false} /></mesh>
      ))}

      {/* roof terrace glass railing */}
      <mesh position={[-2.6, 3.58, 2.46]}><boxGeometry args={[3.8, 0.9, 0.03]} /><meshPhysicalMaterial color="#cfe0ff" transparent opacity={0.22} roughness={0.05} envMapIntensity={2.5} depthWrite={false} /></mesh>
      <Box shadows={false} args={[3.84, 0.04, 0.06]} position={[-2.6, 4.04, 2.46]} color={METAL} metalness={0.8} roughness={0.35} />
      <mesh position={[-4.45, 3.58, 0.2]}><boxGeometry args={[0.03, 0.9, 4.8]} /><meshPhysicalMaterial color="#cfe0ff" transparent opacity={0.22} roughness={0.05} envMapIntensity={2.5} depthWrite={false} /></mesh>

      {/* GROUND-FLOOR GLAZING */}
      <GlassWindow position={[-2.0, 1.6, 2.5]} size={[3.1, 2.0]} cols={3} seed={1} reduced={reduced} />
      <GlassWindow position={[2.2, 1.6, 2.5]} size={[1.3, 2.0]} cols={1} seed={4} lit={false} reduced={reduced} />
      {/* entry door (cedar, pivot) */}
      <group position={[0.35, 1.3, 2.52]}>
        <Box shadows={false} args={[1.2, 2.45, 0.12]} position={[0, 0.0, 0.03]} color={METAL} roughness={0.5} metalness={0.5} />
        <mesh position={[0, 0, 0.1]}><planeGeometry args={[1.0, 2.3]} /><meshStandardMaterial map={m.wood} roughness={0.6} /></mesh>
        <mesh position={[0.38, 0, 0.14]}><boxGeometry args={[0.04, 1.1, 0.05]} /><meshStandardMaterial color="#e3e7f1" metalness={1} roughness={0.2} /></mesh>
      </group>
      <Sconce position={[-0.55, 2.1, 2.62]} />
      <Sconce position={[1.25, 2.1, 2.62]} />

      {/* UPPER GLAZING */}
      <GlassWindow position={[0.55, 4.2, 3.0]} size={[3.6, 1.55]} cols={4} seed={2} reduced={reduced} />
      <GlassWindow position={[3.05, 4.2, 3.0]} size={[0.85, 1.55]} cols={1} seed={5} reduced={reduced} />
      <GlassWindow position={[3.7, 4.2, 0.5]} rotation={[0, Math.PI / 2, 0]} size={[3.4, 1.55]} cols={3} seed={3} reduced={reduced} />
      <GlassWindow position={[-4.35, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]} size={[2.6, 1.8]} cols={2} seed={6} reduced={reduced} />

      {/* vertical cedar slat screen beside the stone */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-3.28 + i * 0.1, 1.57, 2.62]} castShadow={sh}>
          <boxGeometry args={[0.06, 2.5, 0.1]} />
          <meshStandardMaterial map={m.slat} roughness={0.65} />
        </mesh>
      ))}

      {/* mulch bed + hedge */}
      <mesh position={[-1.6, 0.012, 3.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6.4, 1.2]} /><meshStandardMaterial map={m.mulch} roughness={1} /></mesh>
      <RoundedBox args={[3.4, 0.6, 0.55]} radius={0.25} smoothness={4} position={[-2.4, 0.4, 3.0]} castShadow={sh} receiveShadow={sh}>
        <meshStandardMaterial color="#244d33" roughness={1} bumpMap={m.grass.bump} bumpScale={4} />
      </RoundedBox>
      <Shrub position={[2.2, 0.35, 3.05]} s={0.9} seed={2} light={!desktop} />
      <Shrub position={[3.0, 0.3, 3.2]} s={0.7} seed={5} light={!desktop} />
      <Shrub position={[-4.7, 0.4, 2.7]} s={1.1} seed={7} light={!desktop} />

      {/* paver patio + path */}
      <mesh position={[-0.5, 0.03, 4.7]} receiveShadow={sh} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.6, 3.2]} />
        <meshStandardMaterial map={m.pavers} roughness={0.6} />
      </mesh>
      {[...Array(5)].map((_, i) => (
        <Box key={i} shadows={false} args={[1.0, 0.05, 0.55]} position={[0.35, 0.025, 7.0 + i * 0.85]} color="#9aa2b4" roughness={0.8} />
      ))}
      {/* driveway */}
      <mesh position={[5.2, 0.02, 9.2]} receiveShadow={sh} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.0, 15.8]} />
        <meshStandardMaterial map={m.concrete} roughness={0.85} />
      </mesh>

      {/* trees: foreground + a backdrop line */}
      <Tree position={[10.6, 0, 1.0]} s={1.1} seed={4} light={!desktop} />
      <Tree position={[-8.2, 0, -0.6]} s={1.25} seed={9} base="#1f4630" light={!desktop} />
      {desktop && (
        <>
          <Tree position={[-3, 0, -9]} s={1.8} seed={12} base="#1d4430" />
          <Tree position={[4, 0, -10]} s={2.0} seed={15} base="#255236" />
          <Tree position={[11, 0, -6]} s={1.7} seed={18} base="#1f4a31" />
          <Tree position={[-11, 0, -5]} s={1.9} seed={21} base="#214d33" />
        </>
      )}

      <PathLight position={[-0.4, 0, 6.5]} />
      <PathLight position={[1.1, 0, 8.3]} />
      <PathLight position={[3.0, 0, 6.0]} />
    </group>
  )
}
