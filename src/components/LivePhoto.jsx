import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useMedia'
import BeforeAfter from './BeforeAfter'
import WindowScene from './WindowScene'

const img = (src, alt) => <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" draggable="false" />

/**
 * "Live Photo" before/after: shows the dirty still; press & hold (touch) or hover (mouse) and it washes clean.
 * Supports an optional real video clip, real photo pairs, or the built-in illustration. Drag-slider mode as backup.
 */
export default function LivePhoto({ item, seed = 5, label }) {
  const reduced = useReducedMotion()
  const [mode, setMode] = useState('live')
  const [playing, setPlaying] = useState(false)
  const box = useRef(null), after = useRef(null), line = useRef(null), video = useRef(null)
  const st = useRef({ p: 0, tween: null })
  const alt = item?.label || label || 'Window'

  const paint = (p) => {
    if (after.current) after.current.style.clipPath = `inset(0 ${100 - p * 100}% 0 0)`
    if (line.current) { line.current.style.left = `${p * 100}%`; line.current.style.opacity = p > 0.01 && p < 0.99 ? 1 : 0 }
  }
  const go = (to, d) => {
    st.current.tween?.kill()
    if (reduced) { st.current.p = to; paint(to); return }
    st.current.tween = gsap.to(st.current, { p: to, duration: d, ease: to ? 'power2.inOut' : 'power2.out', onUpdate: () => paint(st.current.p) })
  }
  const start = () => {
    setPlaying(true)
    if (item?.video && video.current) { video.current.currentTime = 0; video.current.play().catch(() => {}); return }
    go(1, 1.9)
  }
  const stop = () => {
    setPlaying(false)
    if (item?.video && video.current) { video.current.pause(); video.current.currentTime = 0; return }
    go(0, 1.0)
  }
  useEffect(() => { paint(0); return () => st.current.tween?.kill() }, [mode])

  const beforeEl = item ? img(item.before, `${alt} before cleaning`) : <WindowScene dirty seed={seed} />
  const afterEl = item ? img(item.after, `${alt} after cleaning`) : <WindowScene seed={seed} />

  if (mode === 'slider') {
    return (
      <div key="slider" className="mode-in">
        <BeforeAfter before={beforeEl} after={afterEl} />
        <Toggle mode={mode} setMode={setMode} />
      </div>
    )
  }
  return (
    <div key="live" className="mode-in">
      <div
        ref={box}
        className="relative aspect-[8/5] w-full select-none overflow-hidden rounded-[28px] border border-silver/20 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] [-webkit-touch-callout:none] [touch-action:pan-y]"
        onPointerEnter={(e) => e.pointerType === 'mouse' && start()}
        onPointerLeave={(e) => e.pointerType === 'mouse' && stop()}
        onPointerDown={(e) => e.pointerType !== 'mouse' && start()}
        onPointerUp={(e) => e.pointerType !== 'mouse' && stop()}
        onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
      >
        {item?.video ? (
          <>
            <div className="absolute inset-0">{beforeEl}</div>
            <video ref={video} src={item.video} poster={item.before} muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
          </>
        ) : (
          <>
            <div className="absolute inset-0">{beforeEl}</div>
            <div ref={after} className="absolute inset-0 will-change-[clip-path]">{afterEl}</div>
            <div ref={line} aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white opacity-0 shadow-[0_0_28px_10px_rgba(120,190,255,.85)]">
              {[12, 38, 66, 84].map((t, i) => <span key={i} className="drip absolute left-1/2 h-2.5 w-1 -translate-x-1/2 rounded-full bg-white/80" style={{ top: `${t}%`, animationDelay: `${i * 0.35}s` }} />)}
            </div>
          </>
        )}
        <span className={`pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur transition-colors duration-500 ${playing ? 'bg-royal text-white shadow-[0_0_24px_rgba(0,122,255,.8)]' : 'bg-midnight/70 text-white'}`}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="2.4" fill="currentColor" /><circle cx="12" cy="12" r="6.2" strokeDasharray="2 2.4" /><circle cx="12" cy="12" r="10" /></svg>
          Live
        </span>
        <span className={`pointer-events-none absolute right-4 top-4 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur transition-all duration-700 ${playing ? 'bg-royal/90 text-white' : 'bg-midnight/70 text-silver'}`}>{playing ? 'After' : 'Before'}</span>
        <span className={`pointer-events-none absolute inset-x-0 bottom-4 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-white/90 transition-opacity duration-500 ${playing ? 'opacity-0' : 'opacity-100'}`}>
          <span className="rounded-full bg-midnight/60 px-4 py-2 backdrop-blur"><span className="hidden [@media(hover:hover)]:inline">Hover</span><span className="[@media(hover:hover)]:hidden">Press &amp; hold</span> to watch it wash clean</span>
        </span>
      </div>
      <Toggle mode={mode} setMode={setMode} onPlay={() => (playing ? stop() : start())} playing={playing} />
    </div>
  )
}

function Toggle({ mode, setMode, onPlay, playing }) {
  const b = 'min-h-[44px] rounded-full border px-5 text-sm font-bold transition-colors'
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <div role="group" aria-label="Comparison style" className="flex gap-2">
        <button onClick={() => setMode('live')} aria-pressed={mode === 'live'} className={`${b} ${mode === 'live' ? 'border-royal bg-royal text-white' : 'border-silver/30 text-silver hover:border-white hover:text-white'}`}>Live</button>
        <button onClick={() => setMode('slider')} aria-pressed={mode === 'slider'} className={`${b} ${mode === 'slider' ? 'border-royal bg-royal text-white' : 'border-silver/30 text-silver hover:border-white hover:text-white'}`}>Slider</button>
      </div>
      {onPlay && <button onClick={onPlay} aria-pressed={playing} className={`${b} border-silver/30 text-silver hover:border-white hover:text-white`}>{playing ? 'Back to before' : 'Play it'}</button>}
    </div>
  )
}
