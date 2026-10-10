import { useEffect, useState } from 'react'
import { useIsDesktop, useReducedMotion } from './useMedia'

export function webglOk() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch { return false }
}

export const weak = () => {
  const n = navigator
  return (n.deviceMemory && n.deviceMemory <= 2) || (n.hardwareConcurrency && n.hardwareConcurrency <= 2) || n.connection?.saveData === true
}

/**
 * off    – reduced motion or no WebGL: no 3D motion, static fallbacks
 * lite   – weak device: 3D allowed in hero only, no postprocessing / transmission
 * mobile – phones & tablets: lighter 3D
 * full   – desktop: everything
 */
export function getTier(desktop, reduced) {
  if (typeof window === 'undefined') return 'off'
  if (reduced || !webglOk()) return 'off'
  if (weak()) return 'lite'
  return desktop ? 'full' : 'mobile'
}

export function useTier() {
  const desktop = useIsDesktop()
  const reduced = useReducedMotion()
  const [tier, setTier] = useState('mobile')
  useEffect(() => setTier(getTier(desktop, reduced)), [desktop, reduced])
  return { tier, desktop, reduced, rich: tier === 'full' || tier === 'mobile', full: tier === 'full' }
}
