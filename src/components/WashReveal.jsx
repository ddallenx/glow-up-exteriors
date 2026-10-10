import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useMedia'

const prng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

const SURFACES = {
  driveway: {
    label: 'Driveway',
    clean(g, w, h) {
      g.fillStyle = '#8a93a8'; g.fillRect(0, 0, w, h)
      const bw = w / 7, bh = bw / 2
      const r = prng(4)
      for (let y = 0; y < h / bh + 1; y++) for (let x = -1; x < 8; x++) {
        const o = y % 2 ? bw / 2 : 0
        const l = 170 + Math.floor(r() * 26)
        g.fillStyle = `rgb(${l},${l + 6},${l + 20})`
        g.fillRect(x * bw + o + 3, y * bh + 3, bw - 6, bh - 6)
        const gl = g.createLinearGradient(0, y * bh, 0, y * bh + bh)
        gl.addColorStop(0, 'rgba(255,255,255,.16)'); gl.addColorStop(1, 'rgba(0,0,0,.06)')
        g.fillStyle = gl; g.fillRect(x * bw + o + 3, y * bh + 3, bw - 6, bh - 6)
      }
    },
  },
  deck: {
    label: 'Deck',
    clean(g, w, h) {
      const ph = h / 9, r = prng(9)
      for (let i = 0; i < 10; i++) {
        const l = 150 + Math.floor(r() * 30)
        g.fillStyle = `rgb(${l + 38},${l - 6},${l - 56})`; g.fillRect(0, i * ph, w, ph - 3)
        g.strokeStyle = 'rgba(70,40,20,.22)'; g.lineWidth = 1
        for (let k = 0; k < 14; k++) { const y = i * ph + r() * (ph - 4); g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + r() * 4, w * 0.6, y - r() * 4, w, y + r() * 3); g.stroke() }
        g.fillStyle = 'rgba(30,18,10,.55)'; g.fillRect(0, i * ph + ph - 3, w, 3)
      }
    },
  },
  siding: {
    label: 'Siding',
    clean(g, w, h) {
      const rh = h / 8
      for (let i = 0; i < 9; i++) {
        const gr = g.createLinearGradient(0, i * rh, 0, (i + 1) * rh)
        gr.addColorStop(0, '#f4f7fd'); gr.addColorStop(0.85, '#dfe5f2'); gr.addColorStop(1, '#a7b2cb')
        g.fillStyle = gr; g.fillRect(0, i * rh, w, rh)
        g.fillStyle = 'rgba(30,40,80,.25)'; g.fillRect(0, (i + 1) * rh - 2, w, 2)
      }
    },
  },
}

function drawDirty(g, w, h, kind) {
  const r = prng(kind === 'deck' ? 21 : kind === 'siding' ? 33 : 12)
  const base = kind === 'deck' ? '#5d5a4d' : kind === 'siding' ? '#8d9484' : '#4d5348'
  g.globalCompositeOperation = 'source-over'
  g.fillStyle = base; g.fillRect(0, 0, w, h)
  const blob = (x, y, rad, col, a) => {
    const gr = g.createRadialGradient(x, y, 0, x, y, rad)
    gr.addColorStop(0, col.replace('A', a)); gr.addColorStop(1, col.replace('A', 0))
    g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2)
  }
  for (let i = 0; i < 520; i++) blob(r() * w, r() * h, 20 + r() * 80, r() > 0.55 ? 'rgba(30,38,26,A)' : 'rgba(96,110,70,A)', 0.2 + r() * 0.3)
  for (let i = 0; i < 120; i++) blob(r() * w, r() * h, 10 + r() * 30, 'rgba(15,15,12,A)', 0.35)
  if (kind === 'siding') { for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(30,36,26,${0.06 + r() * 0.12})`; g.fillRect(r() * w, 0, 1 + r() * 3, h * (0.4 + r() * 0.6)) } }
  g.fillStyle = 'rgba(20,20,16,.35)'
  for (let i = 0; i < 3500; i++) g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2)
}

export default function WashReveal() {
  const [kind, setKind] = useState('driveway')
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)
  const wrap = useRef(null)
  const base = useRef(null)
  const dirt = useRef(null)
  const cursor = useRef(null)
  const state = useRef({ last: null, touched: false, w: 0, h: 0, auto: null })
  const reduced = useReducedMotion()

  const paint = useCallback(() => {
    const el = wrap.current
    if (!el) return
    const w = el.clientWidth, h = el.clientHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    ;[base.current, dirt.current].forEach((c) => { c.width = w * dpr; c.height = h * dpr })
    const bg = base.current.getContext('2d'), dg = dirt.current.getContext('2d')
    bg.setTransform(dpr, 0, 0, dpr, 0, 0); dg.setTransform(dpr, 0, 0, dpr, 0, 0)
    SURFACES[kind].clean(bg, w, h)
    drawDirty(dg, w, h, kind)
    state.current.w = w; state.current.h = h
    setPct(0); setDone(false)
  }, [kind])

  useEffect(() => {
    paint()
    let t
    const ro = new ResizeObserver(() => {
      if (Math.abs(wrap.current.clientWidth - state.current.w) > 40) { clearTimeout(t); t = setTimeout(paint, 200) }
    })
    ro.observe(wrap.current)
    return () => { ro.disconnect(); clearTimeout(t); state.current.auto?.kill() }
  }, [paint])

  const measure = useCallback(() => {
    const c = dirt.current
    if (!c) return
    const s = document.createElement('canvas'); s.width = 48; s.height = 28
    const g = s.getContext('2d', { willReadFrequently: true })
    g.drawImage(c, 0, 0, 48, 28)
    const d = g.getImageData(0, 0, 48, 28).data
    let n = 0
    for (let i = 3; i < d.length; i += 4) if (d[i] < 40) n++
    const p = Math.round((n / (48 * 28)) * 100)
    setPct(p)
    if (p >= 94) finish()
  }, [])

  const finish = () => {
    const g = dirt.current.getContext('2d')
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0)
    gsap.to(dirt.current, { opacity: 0, duration: 0.8, onComplete: () => { g.clearRect(0, 0, dirt.current.width, dirt.current.height); dirt.current.style.opacity = 1; g.restore() } })
    setPct(100); setDone(true)
  }

  const wash = (x, y) => {
    const g = dirt.current.getContext('2d')
    const dpr = dirt.current.width / state.current.w
    g.save(); g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.globalCompositeOperation = 'destination-out'
    const rad = Math.max(34, state.current.w * 0.055)
    const l = state.current.last
    const steps = l ? Math.ceil(Math.hypot(x - l.x, y - l.y) / (rad * 0.35)) : 1
    for (let i = 1; i <= steps; i++) {
      const px = l ? l.x + ((x - l.x) * i) / steps : x, py = l ? l.y + ((y - l.y) * i) / steps : y
      const gr = g.createRadialGradient(px, py, 0, px, py, rad)
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.6, 'rgba(0,0,0,.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = gr; g.beginPath(); g.arc(px, py, rad, 0, Math.PI * 2); g.fill()
    }
    g.restore()
    state.current.last = { x, y }
  }

  const pos = (e) => { const r = wrap.current.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }
  const throttle = useRef(0)
  const onMove = (e) => {
    const [x, y] = pos(e)
    if (cursor.current) gsap.to(cursor.current, { x, y, duration: 0.15, overwrite: true, opacity: 1 })
    if (!state.current.pressed && e.pointerType !== 'mouse') return
    if (e.pointerType === 'mouse' && !state.current.pressed && !state.current.hover) return
    state.current.auto?.kill()
    wash(x, y)
    const now = performance.now()
    if (now - throttle.current > 250) { throttle.current = now; measure() }
  }

  const autoWash = () => {
    state.current.auto?.kill()
    const { w, h } = state.current
    const rows = 6
    // sweep a serpentine path
    const o = { t: 0 }
    state.current.last = null
    const path = []
    for (let i = 0; i < rows; i++) { const y = ((i + 0.5) / rows) * h; const L = i % 2 ? [w, 0] : [0, w]; path.push({ x: L[0], y }, { x: L[1], y }) }
    state.current.auto = gsap.to(o, {
      t: path.length - 1, duration: reduced ? 0.01 : 4, ease: 'none',
      onUpdate() {
        const i = Math.min(Math.floor(o.t), path.length - 2), f = o.t - i
        const x = path[i].x + (path[i + 1].x - path[i].x) * f, y = path[i].y + (path[i + 1].y - path[i].y) * f
        if (cursor.current) gsap.set(cursor.current, { x, y, opacity: 1 })
        wash(x, y)
      },
      onComplete() { measure(); finish() },
    })
  }

  const reset = () => { state.current.auto?.kill(); state.current.last = null; gsap.set(dirt.current, { opacity: 1 }); paint() }

  // gentle hint on first view
  useEffect(() => {
    if (reduced) return
    const el = wrap.current
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || state.current.touched) return
      io.disconnect()
      const o = { t: 0 }
      state.current.last = null
      state.current.auto = gsap.to(o, { t: 1, duration: 1.6, ease: 'power2.inOut', onUpdate() {
        const w = state.current.w, h = state.current.h
        const x = w * 0.12 + o.t * w * 0.3, y = h * 0.5 + Math.sin(o.t * Math.PI * 2) * h * 0.08
        if (cursor.current) gsap.set(cursor.current, { x, y, opacity: 1 })
        wash(x, y)
      }, onComplete() { state.current.last = null; measure() } })
    }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return (
    <div>
      <div role="tablist" aria-label="Choose a surface" className="mb-5 flex flex-wrap gap-2">
        {Object.entries(SURFACES).map(([k, s]) => (
          <button key={k} role="tab" aria-selected={kind === k} onClick={() => { state.current.touched = false; setKind(k) }}
            className={`min-h-[44px] rounded-full border px-5 text-sm font-bold transition-colors ${kind === k ? 'border-royal bg-royal text-white' : 'border-silver/25 text-silver hover:border-silver/60 hover:text-white'}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div
        ref={wrap}
        className="relative aspect-[4/3] w-full cursor-none touch-none select-none overflow-hidden rounded-[28px] border border-silver/20 shadow-[0_50px_100px_-30px_rgba(0,122,255,.4)] md:aspect-[16/9]"
        onPointerDown={(e) => { state.current.pressed = true; state.current.touched = true; state.current.last = null; e.currentTarget.setPointerCapture(e.pointerId); onMove(e) }}
        onPointerUp={() => { state.current.pressed = false; state.current.last = null; measure() }}
        onPointerCancel={() => { state.current.pressed = false }}
        onPointerEnter={() => { state.current.hover = true }}
        onPointerLeave={() => { state.current.hover = false; state.current.last = null; if (cursor.current) gsap.to(cursor.current, { opacity: 0, duration: 0.2 }) }}
        onPointerMove={onMove}
      >
        <canvas ref={base} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <canvas ref={dirt} className="absolute inset-0 h-full w-full" role="img" aria-label="Dirty surface. Drag across it to pressure wash it clean." />
        <div ref={cursor} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 opacity-0">
          <div className="-ml-8 -mt-8 h-16 w-16 rounded-full border border-white/70 bg-white/10 shadow-[0_0_40px_10px_rgba(160,190,255,.6)] backdrop-blur-[2px]" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-midnight/80 to-transparent p-4 md:p-6">
          <p className="rounded-full bg-midnight/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur" aria-live="polite">
            {done ? 'Spotless ✦' : pct > 0 ? `${pct}% clean` : 'Drag to wash'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Cleaning progress">
          <div className="h-full rounded-full bg-gradient-to-r from-royal to-royal-light transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
        <button onClick={autoWash} className="min-h-[44px] rounded-full border border-silver/25 px-5 text-sm font-bold text-silver transition-colors hover:border-white hover:text-white">Wash it for me</button>
        <button onClick={reset} className="min-h-[44px] rounded-full border border-silver/25 px-5 text-sm font-bold text-silver transition-colors hover:border-white hover:text-white">Reset</button>
      </div>
    </div>
  )
}
