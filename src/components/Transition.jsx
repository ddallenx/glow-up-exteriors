import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { getLenis, pageState, scrollToTop } from '../lib/scroll'
import { useReducedMotion } from '../hooks/useMedia'
import { useTier } from '../hooks/useTier'
import { KIND, LABEL, tx } from '../lib/tx'
import { LogoMark } from './Logo'

const Ctx = createContext({ go: () => {} })
export const useTransition = () => useContext(Ctx)

const PANELS = 4
const loadTx = () => import('../three/TransitionScene')
const TxScene = lazy(loadTx)

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  const { tier } = useTier()
  const use3d = tier === 'full' || tier === 'mobile'
  const [mount3d, setMount3d] = useState(false)
  const [active, setActive] = useState(false)
  const [kind, setKind] = useState('frames')
  const label3d = useRef(null)
  const root = useRef(null)
  const busy = useRef(false)
  const path = useRef(pathname)
  path.current = pathname

  const panels = () => root.current.querySelectorAll('[data-panel]')

  // Opening curtain on first load
  useLayoutEffect(() => {
    if (!root.current) return
    if (reduced) {
      gsap.set(root.current, { display: 'none' })
      pageState.delay = 0
      return
    }
    pageState.delay = 1.0
    const ctx = gsap.context(() => {
      gsap.set(root.current, { display: 'block' })
      gsap.set(panels(), { yPercent: 0 })
      gsap.set('[data-curtain-logo]', { opacity: 1, y: 0 })
      gsap
        .timeline({ delay: 0.5, onComplete: () => { gsap.set(root.current, { display: 'none' }); pageState.delay = 0.1 } })
        .to('[data-curtain-logo]', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' })
        .to(panels(), { yPercent: -100, duration: 0.9, ease: 'expo.inOut', stagger: 0.07 }, '-=0.1')
    }, root)
    return () => ctx.revert()
  }, [reduced])

  // Warm up the 3D transition (chunk + shader compile) once the page is idle.
  useEffect(() => {
    if (!use3d) return
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1500))
    const id = idle(() => { loadTx().then(() => setMount3d(true)) }, { timeout: 1800 })
    return () => window.cancelIdleCallback?.(id)
  }, [use3d])

  const go3d = useCallback((to, target) => {
    busy.current = true
    tx.kind = KIND[target] || 'frames'
    tx.p = 0; tx.last = 0
    setKind(tx.kind)
    setActive(true)
    if (label3d.current) label3d.current.textContent = LABEL[target] || ''
    requestAnimationFrame(() => {
      gsap.timeline({ onComplete: () => { setActive(false); tx.p = 0; busy.current = false; pageState.delay = 0.1; gsap.set('#main', { clearProps: 'all' }) } })
        .to('#main', { scale: 0.84, opacity: 0.15, rotateX: 8, z: -280, filter: 'blur(10px) brightness(0.7)', transformPerspective: 1400, transformOrigin: '50% 40%', duration: 1.1, ease: 'power3.in' }, 0)
        .to(tx, { p: 0.5, duration: 1.1, ease: 'power3.in' }, 0)
        .to('[data-tx-label]', { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, 0.55)
        .add(() => {
          pageState.delay = 0.55
          navigate(to)
          scrollToTop()
          requestAnimationFrame(() => {
            gsap.set('#main', { scale: 1.16, opacity: 0, rotateX: -7, z: 260, filter: 'blur(14px) brightness(1.5)', transformPerspective: 1400, transformOrigin: '50% 40%' })
            gsap.to('#main', { scale: 1, opacity: 1, rotateX: 0, z: 0, filter: 'blur(0px) brightness(1)', duration: 1.7, ease: 'expo.out', delay: 0.25 })
            ScrollTrigger.refresh()
          })
        })
        .to(tx, { p: 1, duration: 1.45, ease: 'power3.out' }, '+=0.18')
        .to('[data-tx-label]', { opacity: 0, y: -14, duration: 0.35, ease: 'power2.in' }, '-=0.85')
    })
  }, [navigate])

  const go = useCallback(
    (to) => {
      if (busy.current) return
      const [target] = to.split('#')
      if (target === path.current) {
        const l = getLenis()
        l ? l.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (reduced) {
        // Accessible: a short cross-fade, no motion.
        gsap.to('#main', { opacity: 0, duration: 0.18, onComplete: () => {
          navigate(to); scrollToTop()
          requestAnimationFrame(() => gsap.fromTo('#main', { opacity: 0 }, { opacity: 1, duration: 0.25, clearProps: 'opacity' }))
        } })
        return
      }
      if (use3d && mount3d) { go3d(to, target); return }
      busy.current = true
      gsap.set(root.current, { display: 'block' })
      gsap
        .timeline({ onComplete: () => { gsap.set(root.current, { display: 'none' }); busy.current = false; pageState.delay = 0.1 } })
        .fromTo(panels(), { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut', stagger: 0.06 })
        .fromTo('[data-curtain-logo]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.35')
        .add(() => {
          pageState.delay = 0.45
          navigate(to)
          scrollToTop()
          ScrollTrigger.refresh()
        })
        .to({}, { duration: 0.25 })
        .to('[data-curtain-logo]', { opacity: 0, y: -16, duration: 0.3, ease: 'power2.in' })
        .to(panels(), { yPercent: -100, duration: 0.8, ease: 'expo.inOut', stagger: 0.06 }, '-=0.15')
    },
    [navigate, reduced, use3d, mount3d, go3d],
  )

  useEffect(() => { if (!busy.current) ScrollTrigger.refresh() }, [pathname])

  return (
    <Ctx.Provider value={{ go }}>
      {children}
      {mount3d && (
        <Suspense fallback={null}>
          <TxScene active={active} kind={kind} mobile={tier === 'mobile'} />
        </Suspense>
      )}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center">
        <div data-tx-label className="flex translate-y-4 scale-90 flex-col items-center gap-2 opacity-0 drop-shadow-[0_0_40px_rgba(0,122,255,.8)]">
          <span ref={label3d} className="serif-accent mt-[34vh] text-[clamp(2rem,6vw,4rem)] text-white" />
        </div>
      </div>
      <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]" style={{ display: 'none' }}>
        <div className="absolute inset-0 flex">
          {Array.from({ length: PANELS }).map((_, i) => (
            <div
              key={i}
              data-panel
              className="h-full flex-1"
              style={{ background: i % 2 ? 'linear-gradient(180deg,#05070d,#000000)' : 'linear-gradient(180deg,#0a0e1a,#000000)', marginRight: -1 }}
            />
          ))}
        </div>
        <div data-curtain-logo className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0">
          <LogoMark className="h-28 md:h-36" />
        </div>
      </div>
    </Ctx.Provider>
  )
}

export function TLink({ to, children, onClick, ...props }) {
  const { go } = useTransition()
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        go(to)
      }}
      {...props}
    >
      {children}
    </a>
  )
}
