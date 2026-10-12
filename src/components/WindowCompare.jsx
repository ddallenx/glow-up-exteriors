import { beforeAfter } from '../config/site'
import LivePhoto from './LivePhoto'

/** Uses the owner's real media (site.js → beforeAfter) when provided, otherwise an illustrated example. */
export default function WindowCompare({ index = 0, seed = 5 }) {
  return <LivePhoto item={beforeAfter[index]} seed={seed} />
}
