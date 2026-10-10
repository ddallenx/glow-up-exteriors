import { useCallback, useRef, useState } from 'react'

export default function BeforeAfter({ before, after, className = '', initial = 50, beforeLabel = 'Before', afterLabel = 'After' }) {
  const box = useRef(null)
  const [pos, setPos] = useState(initial)
  const drag = useRef(false)

  const set = useCallback((clientX) => {
    const r = box.current.getBoundingClientRect()
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }, [])

  const onKey = (e) => {
    const step = e.shiftKey ? 10 : 3
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setPos((p) => Math.max(0, p - step)) }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setPos((p) => Math.min(100, p + step)) }
    if (e.key === 'Home') setPos(0)
    if (e.key === 'End') setPos(100)
  }

  return (
    <div
      ref={box}
      className={`relative aspect-[8/5] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[28px] border border-silver/20 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] ${className}`}
      onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); set(e.clientX) }}
      onPointerMove={(e) => drag.current && set(e.clientX)}
      onPointerUp={() => (drag.current = false)}
      onPointerCancel={() => (drag.current = false)}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>{before}</div>
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-midnight/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">{beforeLabel}</span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-royal/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">{afterLabel}</span>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-white shadow-[0_0_20px_rgba(255,255,255,.8)]" style={{ left: `${pos}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Before and after comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={onKey}
          className="pointer-events-auto absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-midnight/60 text-white backdrop-blur-md"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5" /></svg>
        </div>
      </div>
    </div>
  )
}
