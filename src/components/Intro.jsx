import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { introDebug, introState, markIntroSeen } from '../lib/intro'
import { pageState } from '../lib/scroll'

const IntroScene = lazy(() => import('../three/IntroScene'))
const MIN_MS = 2600

const img = (src) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = src })

/**
 * First-visit opening: a fogged glass window carries the logo, gets squeegeed clean, then swings open
 * and the camera flies through to the homepage. Real loading work (fonts, 3D chunks, textures) happens underneath.
 */
export default function Intro({ onOpen }) {
  const [alive, setAlive] = useState(true)
  const root = useRef(null), bg = useRef(null), bar = useRef(null), flash = useRef(null), skipBtn = useRef(null)
  const state = useRef({ opened: false, tl: null })

  useEffect(() => {
    const start = performance.now()
    let done = 0, total = 5
    const bump = () => { done++; gsap.to(bar.current, { scaleX: Math.min(0.96, done / total), duration: 0.6, ease: 'power2.out', overwrite: true }) }
    const tasks = [
      document.fonts.ready,
      img('/logo.webp'),
      import('../three/HouseScene'),
      import('../three/House').then((m) => m.prewarmHouse()),
      Promise.all(['/team/divine.webp', '/team/jeremy.webp', '/team/colin.webp'].map(img)),
    ].map((p) => Promise.resolve(p).then(bump, bump))
    gsap.set(bar.current, { scaleX: 0.04, transformOrigin: '0 50%' })
    gsap.to(introState, { appear: 1, duration: 1.6, ease: 'power3.out', delay: 0.35 })

    Promise.all(tasks).then(() => {
      if (introDebug) { onOpen(); return }
      const wait = Math.max(0, MIN_MS - (performance.now() - start))
      setTimeout(() => open(false), wait)
    })
    return () => state.current.tl?.kill()
  }, [])

  const open = (fast) => {
    if (state.current.opened) return
    state.current.opened = true
    gsap.to(bar.current, { scaleX: 1, duration: 0.4 })
    gsap.to(skipBtn.current, { opacity: 0, duration: 0.3 })
    const k = fast ? 0.35 : 1
    const tl = gsap.timeline({ onComplete: () => { markIntroSeen(); setAlive(false) } })
    state.current.tl = tl
    tl.to(introState, { appear: 1, duration: 0.3 * k })
      .to(introState, { wipe: 1, duration: 1.5 * k, ease: 'power2.inOut' })
      .to(bar.current.parentNode, { opacity: 0, duration: 0.4 * k }, '<0.2')
      .add(() => { pageState.delay = fast ? 0.15 : 0.5; onOpen() }, `+=${0.15 * k}`)
      .to(introState, { open: 1, duration: 2.6 * k, ease: 'expo.inOut' }, '<')
      .to(flash.current, { opacity: 0.9, duration: 0.5 * k, ease: 'power2.out' }, '<0.9')
      .to(flash.current, { opacity: 0, duration: 1.1 * k, ease: 'power2.inOut' })
      .to(bg.current, { opacity: 0, duration: 1.3 * k, ease: 'power2.inOut' }, '<-0.9')
  }

  if (!alive) return null
  return (
    <div ref={root} className="fixed inset-0 z-[120]" role="status" aria-label="Loading Glow Up Exteriors">
      <div ref={bg} className="absolute inset-0 bg-black" />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(55% 45% at 50% 50%, rgba(0,122,255,.2), transparent 70%)' }} />
      <Suspense fallback={null}><IntroScene /></Suspense>
      <div ref={flash} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0" style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(190,225,255,.95), rgba(0,122,255,.35) 60%, transparent 85%)' }} />
      <div className="absolute inset-x-0 bottom-[9vh] flex flex-col items-center gap-3 px-8">
        <div className="h-[2px] w-[min(320px,60vw)] overflow-hidden rounded-full bg-white/10"><div ref={bar} className="h-full w-full rounded-full bg-gradient-to-r from-royal-light via-white to-royal-light shadow-[0_0_14px_rgba(77,163,255,.9)]" /></div>
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-silver-dim">Window cleaning · Power washing</span>
      </div>
      <button ref={skipBtn} onClick={() => open(true)} className="absolute bottom-6 right-6 min-h-[44px] rounded-full border border-silver/25 px-5 text-xs font-bold uppercase tracking-[0.2em] text-silver backdrop-blur transition-colors hover:border-white hover:text-white">Skip intro</button>
    </div>
  )
}
