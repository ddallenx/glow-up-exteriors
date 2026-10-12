const DEFAULT = ['Window Washing', 'Pressure Washing', 'Residential', 'Commercial', 'Streak-Free Glass', 'Driveways', 'Storefronts', 'Free Quotes']

export default function Marquee({ className = '', words = DEFAULT }) {
  const row = (k) => (
    <ul key={k} className="flex shrink-0 items-center" aria-hidden={k > 0 ? 'true' : undefined}>
      {words.map((w) => (
        <li key={w} className="flex items-center">
          <span className="font-display px-8 text-[clamp(2rem,5vw,4.5rem)] font-extrabold uppercase text-transparent" style={{ WebkitTextStroke: '1px rgba(195,202,216,0.35)' }}>{w}</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-royal-light" aria-hidden="true"><path d="M12 1l2.4 8.6L23 12l-8.6 2.4L12 23l-2.4-8.6L1 12l8.6-2.4z" fill="currentColor" /></svg>
        </li>
      ))}
    </ul>
  )
  return (
    <div className={`overflow-hidden border-y border-silver/10 py-6 ${className}`}>
      <div className="marquee-track flex">{row(0)}{row(1)}</div>
    </div>
  )
}
