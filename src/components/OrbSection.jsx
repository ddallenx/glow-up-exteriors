import { lazy, Suspense, useRef } from 'react'
import { useTier } from '../hooks/useTier'
import { Reveal } from './Reveal'
import SectionTitle from './SectionTitle'
import Button from './Button'
import Scene from './Scene'

const GlassOrb = lazy(() => import('../three/GlassOrb'))

/** Liquid-glass droplet section: reacts to cursor and scroll. Reused across pages with different copy. */
export default function OrbSection({ eyebrow, title, body, cta, flip = false }) {
  const box = useRef(null)
  const { reduced } = useTier()
  return (
    <section className="relative overflow-hidden bg-midnight py-12 md:py-24">
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-6 px-5 md:px-10 lg:grid-cols-12">
        <div className={`lg:col-span-6 ${flip ? 'lg:order-2' : ''}`}>
          <SectionTitle eyebrow={eyebrow} title={title}>{body}</SectionTitle>
          {cta && <Reveal delay={0.15} className="mt-10"><Button to={cta.to} variant="ghost">{cta.label}</Button></Reveal>}
        </div>
        <div ref={box} className={`lg:col-span-6 ${flip ? 'lg:order-1' : ''}`}>
          <Scene className="h-[380px] w-full sm:h-[520px]" camera={[0, 0, 9]} fov={34} label="Interactive 3D liquid-glass droplet that rotates as you move your cursor and scroll." minTier="mobile">
            {({ full }) => <Suspense fallback={null}><GlassOrb full={full} reduced={reduced} container={box} /></Suspense>}
          </Scene>
        </div>
      </div>
    </section>
  )
}
