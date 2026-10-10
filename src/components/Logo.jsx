export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lm-g" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#a3b8ff" />
          <stop offset="1" stopColor="#3f72ff" />
        </linearGradient>
      </defs>
      <path d="M30 6c9 12 17 20 17 32a17 17 0 0 1-34 0C13 26 21 18 30 6z" fill="url(#lm-g)" />
      <path d="M22 40a8 8 0 0 0 8 8" stroke="#fff" strokeOpacity=".55" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M49 7l2 5.6L56.6 14.6 51 16.6 49 22.2l-2-5.6-5.6-2 5.6-2z" fill="#e6eaf3" />
    </svg>
  )
}

export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="leading-none">
        <span className="block text-[15px] font-extrabold tracking-[-0.03em]">Glow Up</span>
        <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.34em] text-silver">Exteriors</span>
      </span>
    </span>
  )
}
