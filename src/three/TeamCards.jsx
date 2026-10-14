import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import Studio from './Studio'
import { usePointer } from '../hooks/usePointer'

const CW = 768, CH = 1024

function wrap(g, text, x, y, maxW, lh) {
  const words = text.split(' '); let line = ''
  words.forEach((w) => {
    const test = line + w + ' '
    if (g.measureText(test).width > maxW && line) { g.fillText(line.trim(), x, y); line = w + ' '; y += lh } else line = test
  })
  g.fillText(line.trim(), x, y)
}

function bg(g) {
  const gr = g.createLinearGradient(0, 0, CW, CH)
  gr.addColorStop(0, '#0f2d78'); gr.addColorStop(0.55, '#091a48'); gr.addColorStop(1, '#000000')
  g.fillStyle = gr; g.fillRect(0, 0, CW, CH)
  const glow = g.createRadialGradient(CW * 0.85, CH * 0.12, 10, CW * 0.85, CH * 0.12, CW * 0.8)
  glow.addColorStop(0, 'rgba(0,122,255,.75)'); glow.addColorStop(1, 'rgba(0,122,255,0)')
  g.fillStyle = glow; g.fillRect(0, 0, CW, CH)
  g.strokeStyle = 'rgba(160,200,255,.07)'; g.lineWidth = 1
  for (let i = 0; i < CW; i += 48) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, CH); g.stroke() }
  for (let i = 0; i < CH; i += 48) { g.beginPath(); g.moveTo(0, i); g.lineTo(CW, i); g.stroke() }
  g.strokeStyle = 'rgba(190,215,255,.35)'; g.lineWidth = 3; g.strokeRect(14, 14, CW - 28, CH - 28)
}

function face() {
  const c = document.createElement('canvas'); c.width = CW; c.height = CH
  const g = c.getContext('2d'); bg(g)
  const spot = g.createRadialGradient(CW / 2, CH * 0.42, 10, CW / 2, CH * 0.42, CW * 0.65)
  spot.addColorStop(0, 'rgba(120,180,255,.55)'); spot.addColorStop(1, 'rgba(0,122,255,0)')
  g.fillStyle = spot; g.fillRect(0, 0, CW, CH)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}

/** Transparent overlay: name, role, focus, age badge, and a dark gradient so text reads over the photo. */
function label(p) {
  const c = document.createElement('canvas'); c.width = CW; c.height = CH
  const g = c.getContext('2d')
  const fade = g.createLinearGradient(0, CH * 0.58, 0, CH)
  fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(0.55, 'rgba(0,0,0,.78)'); fade.addColorStop(1, 'rgba(0,0,0,.95)')
  g.fillStyle = fade; g.fillRect(14, CH * 0.58, CW - 28, CH * 0.42 - 14)
  g.fillStyle = '#9cc8ff'; g.font = '700 22px Manrope, sans-serif'; g.letterSpacing = '8px'; g.fillText('GLOW UP EXTERIORS', 56, 84); g.letterSpacing = '0px'
  g.strokeStyle = '#6cb2ff'; g.lineWidth = 4; g.beginPath(); g.arc(CW - 118, 138, 62, 0, 7); g.stroke()
  g.fillStyle = 'rgba(0,0,0,.55)'; g.beginPath(); g.arc(CW - 118, 138, 60, 0, 7); g.fill()
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '800 60px Manrope, sans-serif'; g.fillText(String(p.age), CW - 118, 158)
  g.font = '700 15px Manrope, sans-serif'; g.fillStyle = '#9cc8ff'; g.letterSpacing = '4px'; g.fillText('YEARS OLD', CW - 116, 186); g.letterSpacing = '0px'
  g.textAlign = 'left'
  g.fillStyle = '#4da3ff'; g.font = '700 28px Manrope, sans-serif'; g.letterSpacing = '9px'; g.fillText(p.role.toUpperCase(), 56, 800); g.letterSpacing = '0px'
  g.fillStyle = '#fff'; g.font = '800 140px Manrope, sans-serif'; g.letterSpacing = '-6px'; g.fillText(p.name, 50, 925); g.letterSpacing = '0px'
  g.fillStyle = '#c3cad8'; g.font = 'italic 46px "Instrument Serif", Georgia, serif'; g.fillText(p.focus, 56, 982)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}

function back(p) {
  const c = document.createElement('canvas'); c.width = CW; c.height = CH
  const g = c.getContext('2d'); bg(g)
  g.fillStyle = '#4da3ff'; g.font = '700 26px Manrope, sans-serif'; g.letterSpacing = '8px'; g.fillText(`${p.role.toUpperCase()}  ·  AGE ${p.age}`, 56, 110); g.letterSpacing = '0px'
  g.fillStyle = '#fff'; g.font = '800 96px Manrope, sans-serif'; g.letterSpacing = '-4px'; g.fillText(p.name, 52, 230); g.letterSpacing = '0px'
  g.fillStyle = '#dbe6fa'; g.font = '500 38px Manrope, sans-serif'; wrap(g, p.bio, 56, 330, CW - 112, 58)
  g.fillStyle = '#6cb2ff'; g.font = 'italic 46px "Instrument Serif", Georgia, serif'; g.fillText('Glow Up Exteriors — co-founder', 56, 940)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}

/** Background-removed cut-out standing in front of the card so it parallaxes as the card tilts. */
function Photo({ person }) {
  const tex = useTexture(person.photo)
  const ar = tex.image.width / tex.image.height
  const full = person.crop === 'full'
  const w = full ? 1.5 : 2.05
  const h = w / ar
  const bottom = full ? -1.55 : -1.17
  return (
    <mesh position={[0, bottom + h / 2, 0.2]} renderOrder={2}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

function Card({ person, x, index, reduced, full }) {
  const g = useRef(), light = useRef()
  const [hover, setHover] = useState(false)
  const flip = useRef(0)
  const tf = useMemo(() => face(), [])
  const tl = useMemo(() => label(person), [person])
  const tb = useMemo(() => back(person), [person])
  const dom = useThree((s) => s.gl.domElement)
  const ptr = usePointer(useMemo(() => ({ current: dom }), [dom]))
  useEffect(() => { dom.style.cursor = hover ? 'pointer' : 'auto' }, [hover, dom])
  useFrame((s, dt) => {
    const k = 1 - Math.pow(0.0008, dt), t = s.clock.elapsedTime
    const tx = hover ? -ptr.current.y * 0.18 : 0
    g.current.rotation.x += (tx + (reduced ? 0 : Math.sin(t * 0.7 + index) * 0.03) - g.current.rotation.x) * k
    const targetY = flip.current * Math.PI + (hover ? ptr.current.x * 0.22 : 0) + (reduced ? 0 : Math.sin(t * 0.5 + index * 2) * 0.05)
    g.current.rotation.y += (targetY - g.current.rotation.y) * k
    g.current.position.y += ((reduced ? 0 : Math.sin(t * 0.9 + index * 1.7) * 0.1) - g.current.position.y) * k
    g.current.scale.setScalar(THREE.MathUtils.lerp(g.current.scale.x, hover ? 1.06 : 1, k))
    light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, hover ? 36 : 12, k)
  })
  return (
    <group position={[x, 0, 0]}>
      <group ref={g} onPointerOver={(e) => { e.stopPropagation(); setHover(true) }} onPointerOut={() => setHover(false)} onClick={(e) => { e.stopPropagation(); flip.current = flip.current ? 0 : 1 }}>
        <RoundedBox args={[2.45, 3.3, 0.14]} radius={0.12} smoothness={5}>
          <meshPhysicalMaterial color="#0d2766" metalness={0.6} roughness={0.2} clearcoat={1} envMapIntensity={1.8} />
        </RoundedBox>
        <mesh position={[0, 0, 0.076]}><planeGeometry args={[2.35, 3.13]} /><meshBasicMaterial map={tf} toneMapped={false} /></mesh>
        <mesh position={[0, 0, -0.076]} rotation={[0, Math.PI, 0]}><planeGeometry args={[2.35, 3.13]} /><meshBasicMaterial map={tb} toneMapped={false} /></mesh>
        {person.photo && <Photo person={person} />}
        <mesh position={[0, 0, 0.26]} renderOrder={4}><planeGeometry args={[2.35, 3.13]} /><meshBasicMaterial map={tl} transparent toneMapped={false} depthWrite={false} /></mesh>
        {/* glass sheen */}
        <mesh position={[0, 0, 0.085]}><planeGeometry args={[2.35, 3.13]} /><meshPhysicalMaterial transparent opacity={0.08} roughness={0.02} clearcoat={1} envMapIntensity={3.5} depthWrite={false} /></mesh>
        <pointLight ref={light} position={[0, 0.5, 1.4]} intensity={12} color="#4da3ff" distance={7} />
      </group>
    </group>
  )
}

export default function TeamCards({ team, reduced, full }) {
  const { viewport } = useThree()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let live = true
    Promise.all([document.fonts.load('800 100px Manrope'), document.fonts.load('italic 100px "Instrument Serif"')]).catch(() => {}).finally(() => live && setReady(true))
    return () => { live = false }
  }, [])
  const s = Math.min(1, viewport.width / 9.3)
  return (
    <>
      <Studio res={full ? 256 : 128} />
      <ambientLight intensity={0.5} />
      {ready && (
        <group scale={s}>
          {team.map((p, i) => <Card key={p.name} person={p} index={i} x={(i - 1) * 3.05} reduced={reduced} full={full} />)}
        </group>
      )}
    </>
  )
}
