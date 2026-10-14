import { pricing } from '../config/site'

export const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`

/** { low, high } estimate for `count` windows. `bothSides` = inside & outside. */
export function estimate(count, bothSides) {
  const n = Math.max(0, Math.floor(Number(count) || 0))
  const m = bothSides ? pricing.bothSidesMultiplier : 1
  return { n, low: n * pricing.perWindowLow * m, high: n * pricing.perWindowHigh * m }
}
