import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })
if (typeof window !== 'undefined') window.__gsap = gsap
export { gsap, ScrollTrigger }
