import * as THREE from 'three'

// ── tiny seeded PRNG + value noise ─────────────────────────────
const prng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

function noiseField(size, cells, seed) {
  const r = prng(seed)
  const g = Array.from({ length: (cells + 1) * (cells + 1) }, () => r())
  const at = (x, y) => g[(y % (cells)) * (cells + 1) + (x % cells)]
  return (u, v) => {
    const x = u * cells, y = v * cells, xi = Math.floor(x), yi = Math.floor(y)
    const fx = x - xi, fy = y - yi, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1)
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
  }
}

const LOW = typeof window !== 'undefined' && window.innerWidth < 1024
const Q = LOW ? 0.5 : 1

const make = (w, h, draw, { srgb = true, repeat = null, aniso = 8 } = {}) => {
  const c = document.createElement('canvas')
  c.width = Math.round(w * Q); c.height = Math.round(h * Q)
  const g = c.getContext('2d', { willReadFrequently: true })
  g.scale(Q, Q)
  draw(g, w, h)
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = LOW ? 2 : aniso
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]) }
  return t
}

/** multi-octave grayscale noise pass over an existing canvas context */
function overlayNoise(g, lw, lh, seed, { amount = 0.12, scale = 24, octaves = 3, tint = [255, 255, 255], dark = false } = {}) {
  const w = g.canvas.width, h = g.canvas.height
  const img = g.getImageData(0, 0, w, h)
  const fields = Array.from({ length: octaves }, (_, o) => noiseField(w, Math.max(2, Math.round(scale * 2 ** o)), seed + o * 17))
  const d = img.data
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let n = 0, amp = 1, tot = 0
    fields.forEach((f) => { n += f(x / w, y / h) * amp; tot += amp; amp *= 0.5 })
    n = n / tot - 0.5
    const k = n * amount * 2
    const i = (y * w + x) * 4
    d[i] = Math.max(0, Math.min(255, d[i] + (dark ? 0 : k * 255)))
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + k * 255))
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + k * 255))
  }
  g.putImageData(img, 0, 0)
}

const bumpFrom = (draw, size = 512, repeat = null) => make(size, size, draw, { srgb: false, repeat })

// ── Render / stucco ────────────────────────────────────────────
export function stuccoMaps(repeat = [1.2, 0.8]) {
  const map = make(512, 512, (g, w, h) => { g.fillStyle = '#e9e6df'; g.fillRect(0, 0, w, h); overlayNoise(g, w, h, 4, { amount: 0.05, scale: 6 }); overlayNoise(g, w, h, 9, { amount: 0.06, scale: 48, octaves: 2 }) }, { repeat })
  const bump = bumpFrom((g, w, h) => { g.fillStyle = '#808080'; g.fillRect(0, 0, w, h); overlayNoise(g, w, h, 12, { amount: 0.5, scale: 64, octaves: 2 }) }, 512, repeat)
  return { map, bump }
}

// ── Vertical board & batten cladding (charcoal-navy) ───────────
export function claddingMaps(repeat = [1, 1]) {
  const draw = (bump) => (g, w, h) => {
    const bw = w / 12
    for (let i = 0; i < 12; i++) {
      const l = bump ? 128 : 36 + ((i * 7) % 5) * 3
      g.fillStyle = bump ? `rgb(${l},${l},${l})` : `rgb(${l},${l + 6},${l + 24})`
      g.fillRect(i * bw, 0, bw, h)
      g.fillStyle = bump ? '#fff' : 'rgba(255,255,255,.06)'
      g.fillRect(i * bw + bw * 0.42, 0, bw * 0.16, h) // batten
      g.fillStyle = bump ? '#000' : 'rgba(0,0,0,.55)'
      g.fillRect(i * bw, 0, 2, h)
    }
    overlayNoise(g, w, h, 3, { amount: bump ? 0.15 : 0.05, scale: 30 })
  }
  return { map: make(512, 512, draw(false), { repeat }), bump: make(512, 512, draw(true), { srgb: false, repeat }) }
}

// ── Wood (warm cedar) ──────────────────────────────────────────
export function woodMap(repeat = [1, 1], vertical = true) {
  return make(256, 512, (g, w, h) => {
    const grad = g.createLinearGradient(0, 0, w, 0)
    grad.addColorStop(0, '#9a6f45'); grad.addColorStop(0.5, '#b0825a'); grad.addColorStop(1, '#8a6038')
    g.fillStyle = grad; g.fillRect(0, 0, w, h)
    const r = prng(5)
    for (let i = 0; i < 90; i++) {
      g.strokeStyle = `rgba(${60 + r() * 30},${30 + r() * 20},10,${0.08 + r() * 0.2})`
      g.lineWidth = 0.5 + r() * 1.6
      const x = r() * w
      g.beginPath(); g.moveTo(x, 0)
      g.bezierCurveTo(x + (r() - 0.5) * 20, h * 0.3, x + (r() - 0.5) * 20, h * 0.6, x + (r() - 0.5) * 12, h); g.stroke()
    }
    overlayNoise(g, w, h, 8, { amount: 0.06, scale: 12 })
  }, { repeat })
}

// ── Ledgestone feature wall ────────────────────────────────────
export function stoneMaps(repeat = [1, 1]) {
  const draw = (bump) => (g, w, h) => {
    const r = prng(77)
    g.fillStyle = bump ? '#000' : '#10162b'; g.fillRect(0, 0, w, h)
    let y = 0
    while (y < h) {
      const rh = 34 + r() * 26
      let x = -r() * 80
      while (x < w) {
        const rw = 70 + r() * 130
        const l = 92 + r() * 70
        g.fillStyle = bump ? `rgb(${150 + r() * 90},${150},${150})` : `rgb(${l * 0.9},${l * 0.95},${l * 1.1})`
        g.beginPath(); g.roundRect(x + 2, y + 2, rw - 4, rh - 4, 5); g.fill()
        if (!bump) { g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(x + 4, y + 3, rw - 8, 3) }
        x += rw
      }
      y += rh
    }
    overlayNoise(g, w, h, 21, { amount: bump ? 0.2 : 0.07, scale: 40 })
  }
  return { map: make(512, 512, draw(false), { repeat }), bump: make(512, 512, draw(true), { srgb: false, repeat }) }
}

// ── Lawn ───────────────────────────────────────────────────────
export function grassMaps(repeat = [26, 26]) {
  const map = make(512, 512, (g, w, h) => {
    g.fillStyle = '#4c7040'; g.fillRect(0, 0, w, h)
    overlayNoise(g, w, h, 31, { amount: 0.2, scale: 5 })
    overlayNoise(g, w, h, 33, { amount: 0.16, scale: 40, octaves: 3 })
    const r = prng(2)
    for (let i = 0; i < 9000; i++) {
      g.strokeStyle = `rgba(${40 + r() * 50},${80 + r() * 70},${30 + r() * 30},${0.25 + r() * 0.4})`
      g.lineWidth = 1
      const x = r() * w, y = r() * h
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 4, y - 3 - r() * 7); g.stroke()
    }
  }, { repeat })
  const bump = bumpFrom((g, w, h) => { g.fillStyle = '#808080'; g.fillRect(0, 0, w, h); overlayNoise(g, w, h, 41, { amount: 0.6, scale: 90, octaves: 2 }) }, 512, repeat)
  return { map, bump }
}

// ── Concrete (driveway) with expansion joints ──────────────────
export function concreteMap(repeat = [1, 4]) {
  return make(512, 512, (g, w, h) => {
    g.fillStyle = '#b9bcc4'; g.fillRect(0, 0, w, h)
    overlayNoise(g, w, h, 51, { amount: 0.08, scale: 5 })
    overlayNoise(g, w, h, 53, { amount: 0.07, scale: 60, octaves: 3 })
    g.fillStyle = 'rgba(40,44,60,.55)'
    g.fillRect(0, h - 3, w, 3); g.fillRect(w / 2 - 1, 0, 2, h)
    const r = prng(9)
    for (let i = 0; i < 24; i++) { g.fillStyle = `rgba(40,44,52,${0.04 + r() * 0.06})`; g.beginPath(); g.ellipse(r() * w, r() * h, 20 + r() * 50, 6 + r() * 14, r() * 3, 0, 7); g.fill() }
  }, { repeat })
}

// ── Pavers ─────────────────────────────────────────────────────
export function paverTexture(repeat = [2.2, 1.1]) {
  return make(512, 512, (g, w, h) => {
    g.fillStyle = '#5d6678'; g.fillRect(0, 0, w, h)
    const bw = 128, bh = 64, r = prng(14)
    for (let y = 0; y < h / bh; y++) for (let x = -1; x < w / bw + 1; x++) {
      const o = y % 2 ? bw / 2 : 0
      const l = 150 + Math.floor(r() * 26)
      g.fillStyle = `rgb(${l},${l + 4},${l + 14})`
      g.fillRect(x * bw + o + 3, y * bh + 3, bw - 6, bh - 6)
    }
    overlayNoise(g, w, h, 61, { amount: 0.07, scale: 50, octaves: 3 })
  }, { repeat })
}

export function mulchMap(repeat = [6, 1]) {
  return make(256, 256, (g, w, h) => {
    g.fillStyle = '#2b1d16'; g.fillRect(0, 0, w, h)
    const r = prng(3)
    for (let i = 0; i < 1500; i++) { g.strokeStyle = `rgba(${70 + r() * 60},${40 + r() * 30},${25},${0.4 + r() * 0.4})`; g.lineWidth = 1.5; const x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 16, y + (r() - 0.5) * 8); g.stroke() }
  }, { repeat })
}

/** Lit interior seen through the glass: ceiling lights, back wall, furniture in warm light, soft vignette for depth. */
export function interiorTexture(seed = 0, lit = true) {
  return make(512, 384, (g, w, h) => {
    const r = prng(seed + 11)
    if (!lit) {
      const d = g.createLinearGradient(0, 0, 0, h)
      d.addColorStop(0, '#1b2a4a'); d.addColorStop(1, '#0b1226'); g.fillStyle = d; g.fillRect(0, 0, w, h)
      return
    }
    // back wall + ceiling + floor in perspective
    g.fillStyle = '#d9c3a2'; g.fillRect(0, 0, w, h)
    const wall = g.createLinearGradient(0, 0, 0, h * 0.72)
    wall.addColorStop(0, '#f4dfba'); wall.addColorStop(1, '#cfa874'); g.fillStyle = wall; g.fillRect(w * 0.08, h * 0.1, w * 0.84, h * 0.62)
    g.fillStyle = '#fbeed2'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w * 0.92, h * 0.1); g.lineTo(w * 0.08, h * 0.1); g.fill() // ceiling
    g.fillStyle = '#b48a5a'; g.beginPath(); g.moveTo(w * 0.08, h * 0.72); g.lineTo(w * 0.92, h * 0.72); g.lineTo(w, h); g.lineTo(0, h); g.fill() // floor
    g.fillStyle = '#9a7650'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w * 0.08, h * 0.1); g.lineTo(w * 0.08, h * 0.72); g.lineTo(0, h); g.fill()
    g.fillStyle = '#a98258'; g.beginPath(); g.moveTo(w, 0); g.lineTo(w * 0.92, h * 0.1); g.lineTo(w * 0.92, h * 0.72); g.lineTo(w, h); g.fill()
    // pot lights
    for (let i = 0; i < 4; i++) {
      const x = w * (0.2 + i * 0.2), y = h * 0.05
      const gl = g.createRadialGradient(x, y, 0, x, y, w * 0.2)
      gl.addColorStop(0, 'rgba(255,248,225,.95)'); gl.addColorStop(1, 'rgba(255,220,160,0)')
      g.fillStyle = gl; g.fillRect(x - w * 0.2, 0, w * 0.4, h * 0.7)
    }
    // art + shelves
    g.fillStyle = 'rgba(70,52,40,.75)'; g.fillRect(w * (0.55 + r() * 0.1), h * 0.2, w * 0.14, h * 0.2)
    g.fillStyle = 'rgba(60,44,34,.55)'; g.fillRect(w * 0.14, h * 0.3, w * 0.08, h * 0.3)
    // sofa + table + lamp
    g.fillStyle = 'rgba(52,60,84,.95)'; g.fillRect(w * (0.2 + r() * 0.15), h * 0.55, w * 0.34, h * 0.17)
    g.fillRect(w * 0.18, h * 0.5, w * 0.06, h * 0.22)
    g.fillStyle = 'rgba(38,28,22,.9)'; g.fillRect(w * 0.62, h * 0.64, w * 0.2, h * 0.06)
    g.fillRect(w * 0.64, h * 0.7, w * 0.015, h * 0.07); g.fillRect(w * 0.8, h * 0.7, w * 0.015, h * 0.07)
    const lamp = g.createRadialGradient(w * 0.9, h * 0.42, 0, w * 0.9, h * 0.42, w * 0.1)
    lamp.addColorStop(0, 'rgba(255,240,200,1)'); lamp.addColorStop(1, 'rgba(255,200,120,0)')
    g.fillStyle = lamp; g.fillRect(w * 0.78, h * 0.3, w * 0.2, h * 0.3)
    // vignette for depth
    const v = g.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, w * 0.7)
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(20,10,0,.55)')
    g.fillStyle = v; g.fillRect(0, 0, w, h)
  })
}
