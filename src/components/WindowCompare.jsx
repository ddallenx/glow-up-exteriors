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
  return (
    <div className={`mt-14 grid gap-8 ${single ? 'mx-auto max-w-[560px]' : 'lg:grid-cols-2'}`}>
      {items.map((it, i) => <LivePhoto key={it?.before || i} item={it} seed={[2, 9][i] || i} />)}
    </div>
  )
}
