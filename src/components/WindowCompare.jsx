import { useState } from 'react'
import { beforeAfter } from '../config/site'
import LivePhoto from './LivePhoto'

/** Uses the real photos (site.js → beforeAfter) when provided, otherwise an illustrated example. */
export default function WindowCompare({ index = 0, seed = 5 }) {
  return <LivePhoto item={beforeAfter[index]} seed={seed} />
}

/** Every real before/after in site.js (or two illustrated placeholders when there are none). */
export function WindowCompareGrid() {
  const items = beforeAfter.length ? beforeAfter : [undefined, undefined]
  const single = items.length === 1
  const cols = items.length >= 3 ? 'md:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-2'
  return (
    <div className={`mt-14 grid gap-8 ${single ? 'mx-auto max-w-[920px]' : cols}`}>
      {items.map((it, i) => <LivePhoto key={it?.before || i} item={it} seed={[2, 9][i] || i} />)}
    </div>
  )
}

/** One big interactive before/after with job switcher chips (falls back to one photo if only one exists). */
export function WindowCompareShowcase({ seed = 5 }) {
  const [i, setI] = useState(0)
  const items = beforeAfter
  if (items.length < 2) return <LivePhoto item={items[0]} seed={seed} />
  return (
    <div>
      <LivePhoto key={items[i].before} item={items[i]} seed={seed} />
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5" role="tablist" aria-label="Choose a job">
        {items.map((it, k) => (
          <button
            key={it.before}
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={`rounded-full border px-4 py-2 text-[12px] font-bold uppercase tracking-[0.16em] transition ${k === i ? 'border-royal bg-royal text-white shadow-[0_0_24px_rgba(0,122,255,0.55)]' : 'border-white/15 bg-white/5 text-white/70 hover:border-royal-light hover:text-white'}`}
          >
            {String(k + 1).padStart(2, '0')} · {it.label}
          </button>
        ))}
      </div>
    </div>
  )
}
