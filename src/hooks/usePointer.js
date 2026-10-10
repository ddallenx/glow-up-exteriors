import { useEffect, useRef } from 'react'

/** Normalised pointer (-1..1) relative to an element, smoothed in the scene via lerp. Also tracks "inside". */
export function usePointer(elRef) {
  const p = useRef({ x: 0, y: 0, inside: false, down: false })
  useEffect(() => {
    const el = elRef?.current || document.body
    const move = (e) => {
      const r = el.getBoundingClientRect()
      p.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
      p.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1)
      p.current.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
    }
    const dn = () => { p.current.down = true }
    const up = () => { p.current.down = false }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', dn, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', dn); window.removeEventListener('pointerup', up) }
  }, [elRef])
  return p
}
