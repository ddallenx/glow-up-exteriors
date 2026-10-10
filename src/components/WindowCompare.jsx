import { beforeAfter } from '../config/site'
import BeforeAfter from './BeforeAfter'
import WindowScene from './WindowScene'

/** Uses the owner's real photos (site.js → beforeAfter) when provided, otherwise an illustrated example. */
export default function WindowCompare({ index = 0, seed = 5, initial = 50 }) {
  const item = beforeAfter[index]
  const img = (src, alt) => <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" draggable="false" />
  return (
    <BeforeAfter
      initial={initial}
      before={item ? img(item.before, `${item.label || 'Window'} before cleaning`) : <WindowScene dirty seed={seed} />}
      after={item ? img(item.after, `${item.label || 'Window'} after cleaning`) : <WindowScene seed={seed} />}
    />
  )
}
