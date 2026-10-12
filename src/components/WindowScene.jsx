import { useId } from 'react'

/** Illustrated window with sky/tree reflections. `dirty` adds grime, water spots and streaks. */
export default function WindowScene({ dirty = false, seed = 3, label }) {
  const id = useId().replace(/:/g, '')
  const spots = Array.from({ length: 46 }, (_, i) => {
    const r = (n) => { const x = Math.sin((i + 1) * 12.9898 * n + seed) * 43758.5453; return x - Math.floor(x) }
    return { x: 120 + r(1) * 560, y: 70 + r(2) * 360, r: 1.5 + r(3) * 5.5, o: 0.25 + r(4) * 0.4 }
  })
  const streaks = Array.from({ length: 14 }, (_, i) => {
    const r = (n) => { const x = Math.sin((i + 3) * 78.233 * n + seed) * 12345.6789; return x - Math.floor(x) }
    return { x: 130 + r(1) * 540, y1: 80 + r(2) * 120, len: 80 + r(3) * 220, o: 0.1 + r(4) * 0.18 }
  })
  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" role="img" aria-label={label || (dirty ? 'Dirty window before cleaning' : 'Sparkling clean window after cleaning')} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ea2ff" /><stop offset=".55" stopColor="#bcd0ff" /><stop offset="1" stopColor="#e6eefc" />
        </linearGradient>
        <linearGradient id={`wall${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9dfec" /><stop offset="1" stopColor="#b9c2d6" /></linearGradient>
        <linearGradient id={`beam${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`glass${id}`}><rect x="120" y="70" width="560" height="360" /></clipPath>
        <filter id={`grime${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.05" numOctaves="3" seed={seed} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 .36  0 0 0 0 .37  0 0 0 0 .33  0 0 0 1.9 -.52" />
        </filter>
        <filter id={`haze${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.01" numOctaves="2" seed={seed + 4} />
          <feColorMatrix type="matrix" values="0 0 0 0 .78  0 0 0 0 .8  0 0 0 0 .76  0 0 0 1.3 -.25" />
        </filter>
      </defs>
      <rect width="800" height="500" fill={`url(#wall${id})`} />
      {/* siding lines */}
      {Array.from({ length: 11 }, (_, i) => <rect key={i} x="0" y={i * 46 + 18} width="800" height="2" fill="#a4aec4" opacity=".5" />)}
      {/* frame */}
      <rect x="96" y="46" width="608" height="408" rx="6" fill="#f4f7fc" />
      <rect x="96" y="46" width="608" height="408" rx="6" fill="none" stroke="#9aa5bd" strokeWidth="2" />
      <rect x="84" y="446" width="632" height="22" rx="4" fill="#e1e6f1" stroke="#9aa5bd" />
      <g clipPath={`url(#glass${id})`}>
        <rect x="120" y="70" width="560" height="360" fill={`url(#sky${id})`} />
        {/* reflected clouds + trees */}
        <ellipse cx="260" cy="150" rx="90" ry="26" fill="#fff" opacity=".8" /><ellipse cx="330" cy="135" rx="60" ry="22" fill="#fff" opacity=".8" />
        <ellipse cx="540" cy="190" rx="80" ry="22" fill="#fff" opacity=".7" />
        <path d="M120 430V330c40-30 70-10 110-40s60-10 100-50 70 10 110-20 70 20 110 0 90-30 130 10v200z" fill="#27475a" opacity=".78" />
        <path d="M120 430V370c60-20 100 0 160-20s90 10 150-10 110 10 250-10v100z" fill="#1c3447" opacity=".85" />
        <polygon points="120,70 330,70 200,430 120,430" fill={`url(#beam${id})`} opacity=".5" />
        <polygon points="420,70 470,70 340,430 290,430" fill={`url(#beam${id})`} opacity=".35" />
        {dirty && (
          <>
            <rect x="120" y="70" width="560" height="360" filter={`url(#haze${id})`} opacity=".9" />
            <rect x="120" y="70" width="560" height="360" filter={`url(#grime${id})`} />
            {streaks.map((s, i) => <rect key={i} x={s.x} y={s.y1} width="2.4" height={s.len} fill="#4c4a40" opacity={s.o} />)}
            {spots.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#6a6b64" opacity={s.o} />)}
            <rect x="120" y="396" width="560" height="34" fill="#4a4a3f" opacity=".18" />
          </>
        )}
      </g>
      {/* mullion */}
      <rect x="396" y="70" width="8" height="360" fill="#f4f7fc" stroke="#9aa5bd" />
      {dirty && <rect x="96" y="446" width="608" height="8" fill="#6a6a5c" opacity=".35" />}
    </svg>
  )
}
