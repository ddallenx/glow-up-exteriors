/** Glow Up Exteriors logo set (transparent PNG/WebP cut from the brand artwork, white for dark backgrounds). */

/** Stacked logo — used in transitions, intro and hero moments. */
export function LogoMark({ className = 'h-24' }) {
  return <img src="/logo.webp" alt="" aria-hidden="true" draggable="false" className={`w-auto select-none ${className}`} />
}

/** House icon only. */
export function HouseMark({ className = 'h-10' }) {
  return <img src="/logo-mark.webp" alt="" aria-hidden="true" draggable="false" className={`w-auto select-none ${className}`} />
}

/** Roof, wordmark and EXTERIORS (no taglines) — nav and footer. */
export function Logo({ className = '' }) {
  return <img src="/logo-nav.webp" alt="Glow Up Exteriors" width="900" height="337" draggable="false" className={`h-11 w-auto select-none md:h-14 ${className}`} />
}
