import { RevealGroup } from './Reveal'
import Tilt from './Tilt'

export default function Steps({ steps, light = false }) {
  return (
    <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
      {steps.map(([t, d], i) => (
        <Tilt key={t} max={7} className={`group relative overflow-hidden rounded-3xl p-7 ${light ? 'border border-navy/10 bg-white shadow-[0_30px_60px_-30px_rgba(10,22,51,.25)]' : 'glass'}`}>
          <span className="serif-accent text-6xl text-royal-grad">0{i + 1}</span>
          <h3 className={`mt-6 text-2xl font-extrabold tracking-[-0.04em] ${light ? 'text-navy' : ''}`}>{t}</h3>
          <p className={`mt-3 text-[15px] leading-relaxed ${light ? 'text-navy/65' : 'text-silver-dim'}`}>{d}</p>
          <div aria-hidden="true" className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-royal/20 blur-3xl transition-opacity duration-700 group-hover:opacity-100 md:opacity-0" />
        </Tilt>
      ))}
    </RevealGroup>
  )
}
