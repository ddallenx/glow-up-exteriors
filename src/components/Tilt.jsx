import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useFinePointer, useReducedMotion } from '../hooks/useMedia'

/** Pointer-reactive 3D tilt with a travelling light glare. Falls back to a plain wrapper on touch / reduced motion. */
export default function Tilt({ as: Tag = 'div', max = 9, glare = true, scale = 1.015, className = '', children, ...rest }) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const on = fine && !reduced
  const move = (e) => {
    if (!on) return
    const el = ref.current, r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    gsap.to(el, { rotateY: (px - 0.5) * max * 2, rotateX: -(py - 0.5) * max * 2, scale, duration: 0.6, ease: 'power3.out', transformPerspective: 1000, overwrite: 'auto' })
    el.style.setProperty('--mx', `${px * 100}%`); el.style.setProperty('--my', `${py * 100}%`)
  }
  const leave = () => on && gsap.to(ref.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 1, ease: 'elastic.out(1,0.5)', overwrite: 'auto' })
  return (
    <Tag ref={ref} onPointerMove={move} onPointerLeave={leave} className={`relative will-change-transform [transform-style:preserve-3d] ${className}`} {...rest}>
      {children}
      {glare && on && <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 [.group:hover_&]:opacity-100 hover:opacity-100" style={{ background: 'radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(0,122,255,.28), transparent 60%)' }} />}
    </Tag>
  )
}
