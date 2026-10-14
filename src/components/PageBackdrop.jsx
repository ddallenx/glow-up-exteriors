import { lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import { useTier } from '../hooks/useTier'
import { SceneBoundary } from './SceneBoundary'

const Backdrop = lazy(() => import('../three/Backdrop'))

const KIND = {
  '/window-washing': 'panes',
  '/pressure-washing': 'spray',
  '/commercial': 'city',
  '/about': 'particles',
  '/contact': 'orbit',
}

/** One persistent fixed canvas behind the page; the scene swaps per route. Skipped on weak / reduced-motion devices. */
export default function PageBackdrop() {
  const { pathname } = useLocation()
  const { tier, full, reduced } = useTier()
  const kind = KIND[pathname]
  if (!kind || tier !== 'full') return null
  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 -z-10 ${kind === 'city' ? 'bg-midnight/50' : 'bg-midnight/15'} ${kind === 'orbit' ? 'opacity-50' : ''}`}>
      <SceneBoundary fallback={null}>
        <Suspense fallback={null}><Backdrop kind={kind} full={full} reduced={reduced} /></Suspense>
      </SceneBoundary>
    </div>
  )
}
