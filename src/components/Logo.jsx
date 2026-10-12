/** The Glow Up Exteriors logo (transparent, works on black). */
export function LogoMark({ className = 'h-14' }) {
  return <img src="/logo.webp" alt="" aria-hidden="true" draggable="false" className={`w-auto select-none ${className}`} />
}

export function Logo({ className = '' }) {
  return <img src="/logo.webp" alt="" draggable="false" className={`h-12 w-auto select-none drop-shadow-[0_0_18px_rgba(0,122,255,.35)] md:h-14 ${className}`} />
}
