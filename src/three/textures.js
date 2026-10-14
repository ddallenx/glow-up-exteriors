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

