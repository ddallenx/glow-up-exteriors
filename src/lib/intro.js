import { webglOk, weak } from '../hooks/useTier'

// Shared animation state between the GSAP timeline and the R3F intro scene.
export const introState = { appear: 0, wipe: 0, open: 0 }

const KEY = 'gu-intro-seen'
const safe = (fn, d) => { try { return fn() } catch { return d } }

/** Decided once, before first render: play the cinematic opening on the first visit of a session. */
export const introWanted =
  typeof window !== 'undefined' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  webglOk() &&
  !weak() &&
  !safe(() => sessionStorage.getItem(KEY), false) &&
  !window.location.search.includes('nointro')

// Debug hook: add ?introdebug to the URL to hold the intro and drive it from the console.
export const introDebug = typeof window !== 'undefined' && window.location.search.includes('introdebug')
if (introDebug) window.__intro = introState

export const markIntroSeen = () => safe(() => sessionStorage.setItem(KEY, '1'))
