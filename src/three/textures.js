import * as THREE from 'three'

const make = (w, h, draw) => {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

/** Fake lit interior seen through the glass: warm gradient, lamp, furniture silhouettes. */
export function interiorTexture(seed = 0, lit = true) {
  return make(256, 256, (g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h)
    if (lit) { grad.addColorStop(0, '#ffe2b0'); grad.addColorStop(0.6, '#f0b774'); grad.addColorStop(1, '#8a5a35') }
    else { grad.addColorStop(0, '#16224a'); grad.addColorStop(1, '#070d24') }
    g.fillStyle = grad; g.fillRect(0, 0, w, h)
    if (!lit) return
    const glow = g.createRadialGradient(w * (0.3 + 0.4 * ((seed * 0.37) % 1)), h * 0.18, 4, w * 0.5, h * 0.3, w * 0.7)
    glow.addColorStop(0, 'rgba(255,250,235,.95)'); glow.addColorStop(1, 'rgba(255,200,130,0)')
    g.fillStyle = glow; g.fillRect(0, 0, w, h)
    g.fillStyle = 'rgba(40,24,18,.85)'
    g.fillRect(0, h * 0.78, w, h * 0.22)                       // floor
    g.fillRect(w * 0.1, h * 0.58, w * 0.42, h * 0.22)         // sofa
    g.fillRect(w * 0.08, h * 0.5, w * 0.08, h * 0.3)
    g.fillRect(w * 0.6, h * 0.66, w * 0.22, h * 0.14)          // table
    g.fillStyle = 'rgba(30,18,14,.55)'; g.fillRect(w * 0.7, h * 0.14, w * 0.2, h * 0.34) // art
    g.beginPath(); g.arc(w * 0.5, h * 0.2, 5, 0, 7); g.fillStyle = '#fff'; g.fill()       // pendant
  })
}

/** Paver patio */
export function paverTexture() {
  const t = make(512, 512, (g, w, h) => {
    g.fillStyle = '#7d879c'; g.fillRect(0, 0, w, h)
    const bw = 128, bh = 64
    for (let y = 0; y < h / bh; y++) {
      for (let x = -1; x < w / bw + 1; x++) {
        const o = y % 2 ? bw / 2 : 0
        const l = 148 + Math.floor(((x * 7 + y * 13) % 5) * 5)
        g.fillStyle = `rgb(${l},${l + 6},${l + 18})`
        g.fillRect(x * bw + o + 3, y * bh + 3, bw - 6, bh - 6)
      }
    }
  })
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2.2, 1.1)
  return t
}
