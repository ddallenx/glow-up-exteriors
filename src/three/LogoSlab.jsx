import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import Studio from './Studio'
import { usePointer } from '../hooks/usePointer'

const shineVert = 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }'
const shineFrag = `varying vec2 vUv; uniform sampler2D uMap; uniform float uT;
  void main(){
    float a = texture2D(uMap, vUv).a;
    float d = vUv.x + vUv.y * .35 - uT;
    float band = exp(-d * d * 90.) * .9 + exp(-(d + .12) * (d + .12) * 400.) * .5;
    gl_FragColor = vec4(vec3(.75,.9,1.) * band, a * band);
  }`

/**
 * The raster logo turned into a real 3D object: a stack of depth slices (extrusion), a glossy front face,
 * a travelling shine and a halo. `overlay` draws it above everything (used inside page transitions).
 */
export function LogoSlab({ width = 6, layers = 22, depth = 0.7, overlay = false, order = 1000 }) {
  const tex = useTexture('/logo.webp')
  const ar = tex.image.width / tex.image.height
  const height = width / ar
  const shine = useRef()
  const mats = useMemo(() => {
    const arr = []
    for (let i = 0; i < layers; i++) {
      const t = i / (layers - 1) // 0 = front
      const m = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.4, toneMapped: false, depthWrite: !overlay, depthTest: !overlay })
      m.color = new THREE.Color().lerpColors(new THREE.Color('#ffffff'), new THREE.Color('#06245f'), Math.min(1, t * 1.5))
      arr.push(m)
    }
    return arr
  }, [tex, layers, overlay])
  const shineMat = useMemo(() => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: !overlay, blending: THREE.AdditiveBlending, uniforms: { uMap: { value: tex }, uT: { value: -1 } }, vertexShader: shineVert, fragmentShader: shineFrag }), [tex, overlay])
  useFrame((s) => { shineMat.uniforms.uT.value = ((s.clock.elapsedTime * 0.38) % 2.6) - 0.8 })
  return (
    <group>
      {mats.map((m, i) => (
        <mesh key={i} position={[0, 0, -(i / (layers - 1)) * depth]} material={m} renderOrder={overlay ? order - i : 0}>
          <planeGeometry args={[width, height]} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.02]} material={shineMat} ref={shine} renderOrder={overlay ? order + 1 : 1}><planeGeometry args={[width, height]} /></mesh>
    </group>
  )
}

/** Showpiece scene: logo tilts to the cursor, floats, catches light. */
export function Logo3DScene({ full, reduced }) {
  const g = useRef()
  const dom = useThree((s) => s.gl.domElement)
  const ptr = usePointer(useMemo(() => ({ current: dom }), [dom]))
  const halo = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 256
    const x = c.getContext('2d'); const gr = x.createRadialGradient(128, 128, 0, 128, 128, 128)
    gr.addColorStop(0, 'rgba(60,150,255,.85)'); gr.addColorStop(0.5, 'rgba(0,122,255,.25)'); gr.addColorStop(1, 'rgba(0,122,255,0)')
    x.fillStyle = gr; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c)
  }, [])
  useFrame((s, dt) => {
    const k = 1 - Math.pow(0.002, dt), t = reduced ? 0 : s.clock.elapsedTime
    const tx = ptr.current.inside ? ptr.current.x : Math.sin(t * 0.5) * 0.5
    const ty = ptr.current.inside ? ptr.current.y : Math.cos(t * 0.4) * 0.2
    g.current.rotation.y += (tx * 0.65 - g.current.rotation.y) * k
    g.current.rotation.x += (-ty * 0.4 - g.current.rotation.x) * k
    g.current.position.y = Math.sin(t * 0.9) * 0.12
  })
  return (
    <>
      <Studio res={full ? 256 : 128} />
      <mesh position={[0, 0, -1.6]}><planeGeometry args={[8.2, 5.2]} /><meshBasicMaterial map={halo} opacity={0.8} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
      <group ref={g}><LogoSlab width={6.2} layers={full ? 26 : 16} depth={0.9} /></group>
    </>
  )
}
