import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { makeGrimeMaterial } from './glass'
import { interiorTexture, paverTexture } from './textures'

const C = {
  stucco: '#e4e9f3',
  charcoal: '#111b3a',
  metal: '#1a2547',
  silver: '#aab3c8',
  glass: '#a9c8ff',
  hedge: '#14352f',
}

function Box({ args, position, color, rough = 0.7, metal = 0, shadows = true, ...rest }) {
  return (
    <mesh position={position} castShadow={shadows} receiveShadow={shadows} {...rest}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={rough} metalness={metal} />
    </mesh>
  )
}

/** A window set into a wall: warm interior card, framed physical glass, animated grime-wipe overlay. */
function GlassWindow({ position, rotation = [0, 0, 0], size, cols = 1, seed = 0, lit = true, reduced }) {
  const [w, h] = size
  const interior = useMemo(() => interiorTexture(seed, lit), [seed, lit])
  const grime = useMemo(() => makeGrimeMaterial(seed * 0.173, w / h, reduced), [seed, w, h, reduced])
  useFrame((s) => { if (!reduced) grime.uniforms.uTime.value = s.clock.elapsedTime })
  const t = 0.07
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={interior} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial color={C.glass} roughness={0.03} metalness={0.25} transparent opacity={0.3} envMapIntensity={2.6} clearcoat={1} clearcoatRoughness={0} side={THREE.FrontSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.065]} material={grime}>
        <planeGeometry args={[w, h]} />
      </mesh>
      {/* frame */}
      <Box shadows={false} args={[w + t * 2, t, 0.14]} position={[0, h / 2 + t / 2, 0.06]} color={C.metal} rough={0.35} metal={0.8} />
      <Box shadows={false} args={[w + t * 2, t, 0.14]} position={[0, -h / 2 - t / 2, 0.06]} color={C.metal} rough={0.35} metal={0.8} />
      <Box shadows={false} args={[t, h, 0.14]} position={[-w / 2 - t / 2, 0, 0.06]} color={C.metal} rough={0.35} metal={0.8} />
      <Box shadows={false} args={[t, h, 0.14]} position={[w / 2 + t / 2, 0, 0.06]} color={C.metal} rough={0.35} metal={0.8} />
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <Box key={i} shadows={false} args={[0.035, h, 0.09]} position={[-w / 2 + ((i + 1) * w) / cols, 0, 0.07]} color={C.metal} rough={0.35} metal={0.8} />
      ))}
      {/* sill */}
      <Box shadows={false} args={[w + 0.35, 0.06, 0.28]} position={[0, -h / 2 - t - 0.03, 0.12]} color={C.silver} rough={0.3} metal={0.7} />
    </group>
  )
}

function Shrub({ position, s = 1 }) {
  return (
    <mesh position={position} scale={[s * 1.25, s * 0.85, s]} castShadow>
      <icosahedronGeometry args={[0.5, 2]} />
      <meshStandardMaterial color={C.hedge} roughness={0.95} flatShading />
    </mesh>
  )
}

function Tree({ position, s = 1 }) {
  return (
    <group position={position} scale={s}>
      <mesh position={[0, 0.9, 0]} castShadow><cylinderGeometry args={[0.07, 0.11, 1.8, 8]} /><meshStandardMaterial color="#2b2a35" roughness={0.9} /></mesh>
      <mesh position={[0, 2.5, 0]} castShadow><icosahedronGeometry args={[0.95, 1]} /><meshStandardMaterial color="#173f37" roughness={0.95} flatShading /></mesh>
      <mesh position={[0.35, 3.1, 0.1]} castShadow><icosahedronGeometry args={[0.6, 1]} /><meshStandardMaterial color="#1c4a40" roughness={0.95} flatShading /></mesh>
    </group>
  )
}

function PathLight({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.03, 0.03, 0.5, 8]} /><meshStandardMaterial color={C.metal} metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0, 0.54, 0]}><sphereGeometry args={[0.07, 12, 12]} /><meshBasicMaterial color="#ffe6b8" toneMapped={false} /></mesh>
      <pointLight position={[0, 0.6, 0]} intensity={1.4} distance={3.2} color="#ffd9a0" decay={2} />
    </group>
  )
}

export default function House({ reduced = false, desktop = true }) {
  const pavers = useMemo(() => paverTexture(), [])
  const sh = desktop
  return (
    <group>
      {/* foundation + terrace slab */}
      <Box shadows={sh} args={[8.4, 0.2, 5.6]} position={[-0.4, 0.1, 0]} color="#0d1634" rough={0.6} />

      {/* ground floor volume */}
      <Box shadows={sh} args={[7, 2.7, 5]} position={[-0.5, 1.55, 0]} color={C.stucco} rough={0.85} />
      {/* upper cantilevered volume */}
      <Box shadows={sh} args={[5.2, 2.5, 5]} position={[1.1, 4.15, 0.5]} color={C.charcoal} rough={0.55} metal={0.15} />
      {/* feature stone wall left */}
      <Box shadows={sh} args={[0.9, 2.7, 5.1]} position={[-3.9, 1.55, 0]} color="#2a3558" rough={0.9} />
      {/* roof slabs */}
      <Box shadows={sh} args={[5.9, 0.2, 5.7]} position={[1.1, 5.5, 0.5]} color={C.silver} rough={0.35} metal={0.75} />
      <Box shadows={sh} args={[7.6, 0.16, 5.4]} position={[-0.5, 2.97, 0]} color={C.silver} rough={0.35} metal={0.75} />
      {/* roof terrace parapet glow */}
      <mesh position={[-2.4, 3.1, 2.55]}><boxGeometry args={[4.2, 0.03, 0.03]} /><meshBasicMaterial color="#6f8cff" toneMapped={false} /></mesh>

      {/* GROUND FLOOR GLAZING */}
      <GlassWindow position={[-2.0, 1.55, 2.5]} size={[3.1, 1.9]} cols={3} seed={1} reduced={reduced} />
      <GlassWindow position={[2.15, 1.55, 2.5]} size={[1.4, 1.9]} cols={1} seed={4} lit={false} reduced={reduced} />
      {/* entry door */}
      <group position={[0.35, 1.3, 2.52]}>
        <Box shadows={false} args={[1.1, 2.3, 0.1]} position={[0, 0, 0.03]} color="#0c1534" rough={0.35} metal={0.5} />
        <mesh position={[0.35, 0, 0.1]}><boxGeometry args={[0.04, 0.9, 0.04]} /><meshStandardMaterial color="#dfe4f1" metalness={1} roughness={0.15} /></mesh>
        <mesh position={[0, 0.2, 0.09]}><planeGeometry args={[0.12, 1.5]} /><meshBasicMaterial color="#8fa6ff" toneMapped={false} /></mesh>
      </group>

      {/* UPPER FLOOR GLAZING */}
      <GlassWindow position={[0.55, 4.2, 3.0]} size={[3.6, 1.45]} cols={4} seed={2} reduced={reduced} />
      <GlassWindow position={[3.0, 4.2, 3.0]} size={[0.9, 1.45]} cols={1} seed={5} reduced={reduced} />
      <GlassWindow position={[3.7, 4.2, 0.5]} rotation={[0, Math.PI / 2, 0]} size={[3.2, 1.45]} cols={3} seed={3} reduced={reduced} />
      <GlassWindow position={[-4.35, 1.55, 0]} rotation={[0, -Math.PI / 2, 0]} size={[2.6, 1.7]} cols={2} seed={6} reduced={reduced} />

      {/* wood-tone slat screen for warmth */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-3.45 + i * 0.09, 1.5, 2.6]} castShadow={sh}>
          <boxGeometry args={[0.05, 2.4, 0.08]} />
          <meshStandardMaterial color="#9b7a58" roughness={0.6} />
        </mesh>
      ))}

      {/* paver patio */}
      <mesh position={[-0.2, 0.05, 4.7]} receiveShadow={sh} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.6, 3.4]} />
        <meshStandardMaterial map={pavers} roughness={0.38} metalness={0.1} envMapIntensity={0.9} />
      </mesh>
      {[...Array(5)].map((_, i) => (
        <Box key={i} shadows={false} args={[1.0, 0.06, 0.55]} position={[0.35, 0.03, 7.0 + i * 0.85]} color="#8a93a8" rough={0.5} />
      ))}

      {/* landscaping */}
      <RoundedBox args={[3.4, 0.55, 0.5]} radius={0.2} smoothness={3} position={[-2.3, 0.35, 3.0]} castShadow={sh}>
        <meshStandardMaterial color={C.hedge} roughness={0.95} />
      </RoundedBox>
      <Shrub position={[2.6, 0.35, 3.0]} s={0.9} />
      <Shrub position={[3.4, 0.3, 3.3]} s={0.7} />
      <Shrub position={[-4.6, 0.35, 2.2]} s={1.1} />
      <Tree position={[5.2, 0, 1.6]} s={1.15} />
      <Tree position={[-6.2, 0, -0.6]} s={1.35} />
      <Tree position={[6.6, 0, -2.8]} s={1.0} />

      <PathLight position={[-0.4, 0, 6.1]} />
      <PathLight position={[1.1, 0, 7.9]} />
      <PathLight position={[3.9, 0, 4.2]} />
    </group>
  )
}
