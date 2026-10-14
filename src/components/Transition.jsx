import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { getLenis, pageState, scrollToTop } from '../lib/scroll'
import { useReducedMotion } from '../hooks/useMedia'
import { introWanted } from '../lib/intro'
import { LogoMark } from './Logo'

const Ctx = createContext({ go: () => {} })
export const useTransition = () => useContext(Ctx)

const PANELS = 5

/** Tell heavy canvases to rest while the curtain moves, so the transition never competes for the GPU. */
const announce = (busy) => window.dispatchEvent(new CustomEvent('gu:tx', { detail: busy }))

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  const root = useRef(null)
  const busy = useRef(false)
  const path = useRef(pathname)
  path.current = pathname

  const panels = () => root.current.querySelectorAll('[data-panel]')

  // Opening curtain on first load (the cinematic intro replaces it when it plays)
  useLayoutEffect(() => {
    if (!root.current) return
    if (introWanted || reduced) {
      gsap.set(root.current, { display: 'none' })
      if (reduced) pageState.delay = 0
      return
    }
    pageState.delay = 0.9
    const ctx = gsap.context(() => {
      gsap.set(root.current, { display: 'block' })
      gsap.set(panels(), { yPercent: 0 })
      gsap.set('[data-curtain-logo]', { opacity: 1, scale: 1 })
      gsap
        .timeline({ delay: 0.45, onComplete: () => { gsap.set(root.current, { display: 'none' }); pageState.delay = 0.1 } })
        .to('[data-curtain-logo]', { opacity: 0, scale: 1.06, duration: 0.4, ease: 'power2.in' })
        .to(panels(), { yPercent: -100, duration: 0.8, ease: 'power4.inOut', stagger: 0.05 }, '-=0.1')
    }, root)
    return () => ctx.revert()
  }, [reduced])

  const go = useCallback(
    (to) => {
      if (busy.current) return
      const [target] = to.split('#')
      if (target === path.current) {
        const l = getLenis()
        l ? l.scrollTo(0, { duration: 1.2 }) : window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (reduced) {
        gsap.to('#main', { opacity: 0, duration: 0.15, onComplete: () => {
          navigate(to); scrollToTop()
          requestAnimationFrame(() => gsap.fromTo('#main', { opacity: 0 }, { opacity: 1, duration: 0.2, clearProps: 'opacity' }))
        } })
        return
      }
      busy.current = true
      announce(true)
      gsap.set(root.current, { display: 'block' })
      gsap
        .timeline({ onComplete: () => { gsap.set(root.current, { display: 'none' }); gsap.set('#main', { clearProps: 'transform,opacity' }); busy.current = false; announce(false); pageState.delay = 0.1; requestAnimationFrame(() => ScrollTrigger.refresh()) } })
        // Cover: panels rise while the old page eases back (transform + opacity only, both GPU-composited)
        .fromTo(panels(), { yPercent: 100 }, { yPercent: 0, duration: 0.55, ease: 'power4.inOut', stagger: 0.045 })
        .to('#main', { scale: 0.97, opacity: 0.6, duration: 0.55, ease: 'power2.in', transformOrigin: '50% 30%' }, 0)
        .fromTo('[data-curtain-logo]', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' }, '-=0.3')
        .add(() => {
          pageState.delay = 0.35
          navigate(to)
          scrollToTop()
          gsap.set('#main', { scale: 1.03, opacity: 0.4, transformOrigin: '50% 30%' })
        })
        .to({}, { duration: 0.12 })
        // Reveal: panels lift away to show the new page settling in
        .to('[data-curtain-logo]', { opacity: 0, scale: 1.06, duration: 0.25, ease: 'power2.in' })
        .to(panels(), { yPercent: -100, duration: 0.6, ease: 'power4.inOut', stagger: 0.045 }, '-=0.1')
        .to('#main', { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' }, '<0.05')
    },
    [navigate, reduced],
  )

  useEffect(() => { if (!busy.current) ScrollTrigger.refresh() }, [pathname])

  return (
    <Ctx.Provider value={{ go }}>
      {children}
      <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]" style={{ display: 'none' }}>
        <div className="absolute inset-0 flex">
          {Array.from({ length: PANELS }).map((_, i) => (
            <div
              key={i}
              data-panel
              className="h-full flex-1 will-change-transform [backface-visibility:hidden]"
              style={{ background: i % 2 ? 'linear-gradient(180deg,#05070d,#000000)' : 'linear-gradient(180deg,#0a0e1a,#000000)', marginRight: -1 }}
            />
          ))}
        </div>
        <div data-curtain-logo className="absolute inset-0 flex items-center justify-center opacity-0 will-change-transform">
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
