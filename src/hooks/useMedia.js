import { useEffect, useState } from 'react'

export function useMedia(query, initial = false) {
  const get = () => (typeof window === 'undefined' ? initial : window.matchMedia(query).matches)
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
export const useIsDesktop = () => useMedia('(min-width: 1024px)')
export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)')

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Glow Up Exteriors` : 'Glow Up Exteriors | Window Washing & Pressure Washing'
  }, [title])
}
