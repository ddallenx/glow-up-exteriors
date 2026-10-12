// Shared mutable state between the GSAP transition timeline and the R3F transition scene.
export const tx = { p: 0, kind: 'frames', last: 0, speed: 0 }

export const KIND = {
  '/': 'frames',
  '/window-washing': 'shatter',
  '/pressure-washing': 'ripple',
  '/commercial': 'sweep',
  '/about': 'cards',
  '/contact': 'rings',
}
export const LABEL = {
  '/': 'Home',
  '/window-washing': 'Window Washing',
  '/pressure-washing': 'Pressure Washing',
  '/commercial': 'Commercial',
  '/about': 'About Us',
  '/contact': 'Free Quote',
}
