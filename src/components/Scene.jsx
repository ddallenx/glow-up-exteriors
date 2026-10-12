import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { useTier } from '../hooks/useTier'
import { SceneBoundary } from './SceneBoundary'
import Throttle from '../three/Throttle'

/**
 * Shared wrapper for every interactive 3D scene:
 * lazy visibility (pauses off-screen), adaptive resolution, WebGL/error fallback, tier-aware.
 */
export default function Scene({ children, className = '', camera, fov = 35, label, fallback = null, minTier = 'lite', shadows = false, onReady, style }) {
  const { tier, full } = useTier()
  const wrap = useRef(null)
  const [visible, setVisible] = useState(true)
  const [dpr, setDpr] = useState(full ? 1.75 : 1.25)
  useEffect(() => setDpr(full ? 1.75 : 1.25), [full])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '120px' })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  const allowed = tier !== 'off' && !(minTier === 'mobile' && tier === 'lite') && !(minTier === 'full' && tier !== 'full')

  return (
    <div ref={wrap} className={`relative ${className}`} role="img" aria-label={label} style={style}>
      {allowed ? (
        <SceneBoundary fallback={fallback}>
          <Canvas
            shadows={shadows}
            dpr={[1, dpr]}
            frameloop={!visible ? 'never' : full ? 'always' : 'demand'}
            camera={{ fov, near: 0.1, far: 200, position: camera || [0, 0, 8] }}
            gl={{ antialias: full, alpha: true, powerPreference: 'high-performance' }}
            style={{ touchAction: 'pan-y' }}
            onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.1; gl.setClearColor(0x000000, 0); onReady?.() }}
          >
            <PerformanceMonitor onDecline={() => setDpr(1)} />
            {!full && <Throttle fps={30} />}
            <Suspense fallback={null}>{children({ tier, full })}</Suspense>
          </Canvas>
        </SceneBoundary>
      ) : fallback}
    </div>
  )
}
