import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { pageState, scrollToTop } from '../lib/scroll'
import { useReducedMotion } from '../hooks/useMedia'
import { LogoMark } from './Logo'

const Ctx = createContext({ go: () => {} })
export const useTransition = () => useContext(Ctx)

const PANELS = 4

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
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

  const go = useCallback(
    (to) => {
      if (busy.current) return
      const [target] = to.split('#')
      if (target === path.current) {
        scrollToTop()
        return
      }
      if (reduced) {
        navigate(to)
        scrollToTop()
        return
      }
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
              className="h-full flex-1"
              style={{ background: i % 2 ? 'linear-gradient(180deg,#0a1633,#06102a)' : 'linear-gradient(180deg,#0d1b3d,#081230)', marginRight: -1 }}
            />
          ))}
        </div>
        <div data-curtain-logo className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0">
          <LogoMark className="h-14 w-14" />
          <span className="serif-accent text-3xl text-white">Glow Up Exteriors</span>
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
