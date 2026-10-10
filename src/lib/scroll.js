let lenis = null
export const setLenis = (l) => { lenis = l }
export const getLenis = () => lenis
export const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}
// Delay (seconds) page intro animations wait while a transition curtain is open
export const pageState = { delay: 1.0 }
