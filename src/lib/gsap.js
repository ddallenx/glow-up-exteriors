import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
if (typeof window !== 'undefined') window.__gsap = gsap
export { gsap, ScrollTrigger }
