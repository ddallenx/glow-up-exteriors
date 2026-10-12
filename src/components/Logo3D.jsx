import Scene from './Scene'
import { Logo3DScene } from '../three/LogoSlab'
import { useReducedMotion } from '../hooks/useMedia'

/** Interactive 3D logo. Falls back to the flat logo on weak / reduced-motion devices. */
export default function Logo3D({ className = 'h-[300px] md:h-[380px]' }) {
  const reduced = useReducedMotion()
  return (
    <Scene
      className={`mx-auto w-full max-w-[720px] ${className}`}
      camera={[0, 0, 9.2]}
      fov={32}
      minTier="mobile"
      label="Interactive 3D Glow Up Exteriors logo. Move your cursor to tilt it."
      fallback={<div className="flex h-full items-center justify-center"><img src="/logo.webp" alt="Glow Up Exteriors" className="max-h-full w-auto drop-shadow-[0_0_40px_rgba(0,122,255,.5)]" /></div>}
    >
      {({ full }) => <Logo3DScene full={full} reduced={reduced} />}
    </Scene>
  )
}
