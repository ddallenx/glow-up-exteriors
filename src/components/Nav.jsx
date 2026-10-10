import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from '../lib/gsap'
import { getLenis } from '../lib/scroll'
import { nav } from '../config/site'
import { Logo } from './Logo'
import { TLink } from './Transition'
import Button from './Button'
import { useReducedMotion } from '../hooks/useMedia'

export default function Nav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const menu = useRef(null)
  const toggle = useRef(null)
  const reduced = useReducedMotion()
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 24)
      setHidden(y > lastY.current && y > 400 && !open)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const lenis = getLenis()
    document.body.style.overflow = open ? 'hidden' : ''
    open ? lenis?.stop() : lenis?.start()
    if (!menu.current) return
    if (open && !reduced) {
      gsap.fromTo(menu.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.out' })
      gsap.fromTo('[data-mi]', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.15 })
    }
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus() } }
    if (open) window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, reduced])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[var(--ease-expo)] ${hidden ? '-translate-y-full' : 'translate-y-0'} ${solid ? 'py-3' : 'py-5 md:py-7'}`}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 md:px-10">
          <div className={`flex w-full items-center justify-between rounded-full transition-all duration-700 ${solid ? 'glass px-4 py-2.5 md:px-6' : 'px-0 py-0'}`}>
            <TLink to="/" aria-label="Glow Up Exteriors — home" className="rounded-full"><Logo /></TLink>
            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {nav.filter((n) => n.to !== '/contact').map((n) => (
                <TLink key={n.to} to={n.to} aria-current={pathname === n.to ? 'page' : undefined} className="group relative px-4 py-2 text-[14px] font-semibold text-silver transition-colors hover:text-white aria-[current=page]:text-white">
                  {n.label}
                  <span className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-gradient-to-r from-royal-light to-transparent transition-transform duration-500 ${pathname === n.to ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </TLink>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Button to="/contact" className="!min-h-[44px] !px-5 !text-[13px] max-sm:hidden" magnetic={false}>Free quote</Button>
              <button
                ref={toggle}
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-silver/25 bg-white/5 lg:hidden"
              >
                <span className={`absolute h-px w-5 bg-white transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
                <span className={`absolute h-px w-5 bg-white transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
                <span className={`absolute h-px w-5 bg-white transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menu}
        hidden={!open}
        className="fixed inset-0 z-[45] flex flex-col justify-between overflow-y-auto bg-midnight px-6 pb-10 pt-28 lg:hidden"
        style={{ background: 'radial-gradient(120% 80% at 80% 0%, #14297a 0%, #040a1c 60%)' }}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {nav.map((n, i) => (
              <li key={n.to} data-mi>
                <TLink to={n.to} aria-current={pathname === n.to ? 'page' : undefined} className="flex items-baseline gap-4 py-2 text-[clamp(2.2rem,10vw,3.4rem)] font-extrabold tracking-[-0.05em] text-white/90 aria-[current=page]:text-royal-light">
                  <span className="serif-accent text-lg text-silver-dim">0{i + 1}</span>
                  {n.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        <div data-mi className="mt-10">
          <Button to="/contact" className="w-full">Get a free quote</Button>
        </div>
      </div>
    </>
  )
}
