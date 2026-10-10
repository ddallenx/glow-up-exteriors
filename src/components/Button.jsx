import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { TLink } from './Transition'
import { useFinePointer, useReducedMotion } from '../hooks/useMedia'

const variants = {
  primary: 'bg-gradient-to-br from-royal-light via-royal to-royal-deep text-white shadow-[0_12px_40px_-8px_rgba(63,114,255,0.7)] hover:shadow-[0_16px_50px_-6px_rgba(63,114,255,0.9)]',
  ghost: 'border border-silver/30 bg-white/[0.04] text-white backdrop-blur hover:border-silver/60 hover:bg-white/10',
  light: 'bg-white text-navy hover:bg-mist shadow-[0_12px_40px_-12px_rgba(255,255,255,0.4)]',
  dark: 'bg-navy text-white hover:bg-ink',
}

export default function Button({ to, href, variant = 'primary', children, className = '', arrow = true, magnetic = true, ...props }) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const canMove = magnetic && fine && !reduced

  const move = (e) => {
    if (!canMove) return
    const r = ref.current.getBoundingClientRect()
    gsap.to(ref.current, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.32, duration: 0.5, ease: 'power3.out' })
  }
  const leave = () => canMove && gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,0.4)' })

  const cls = `btn-shine group relative inline-flex min-h-[52px] items-center justify-center gap-3 overflow-hidden rounded-full px-7 text-[15px] font-bold tracking-tight transition-[box-shadow,background-color,border-color] duration-500 ${variants[variant]} ${className}`
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {arrow && (
        <svg className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  )
  const shared = { ref, className: cls, onMouseMove: move, onMouseLeave: leave }
  if (to) return <TLink to={to} {...shared} {...props}>{inner}</TLink>
  if (href) return <a href={href} {...shared} {...props}>{inner}</a>
  return <button type="button" {...shared} {...props}>{inner}</button>
}
