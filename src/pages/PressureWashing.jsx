import { pressureService } from '../config/site'
import { useDocumentTitle } from '../hooks/useMedia'
import { Headline, Reveal, RevealGroup } from '../components/Reveal'
import Button from '../components/Button'
import SectionTitle from '../components/SectionTitle'
import WashReveal from '../components/WashReveal'
import Steps from '../components/Steps'
import Faq from '../components/Faq'
import Cta from '../components/Cta'
import Scene from '../components/Scene'
import WashSlab from '../three/WashSlab'
import { useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useMedia'

export default function PressureWashing() {
  useDocumentTitle('Pressure Washing')
  const reduced = useReducedMotion()
  const api = useRef(null)
  const [pct, setPct] = useState(0)
  return (
    <>
      <section className="relative isolate overflow-hidden bg-midnight pb-16 pt-36 md:pb-24 md:pt-44">
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(50% 60% at 90% 40%, rgba(0,122,255,.4), transparent 70%), radial-gradient(35% 40% at 0% 0%, rgba(47,184,255,.15), transparent 70%)' }} />
        <div className="mx-auto grid max-w-[1500px] items-center gap-10 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal><p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">Service 02</p></Reveal>
            <Headline text="Wash away|the *years*." className="font-display mt-6 text-[clamp(3.2rem,9vw,9rem)] font-extrabold" />
            <Reveal delay={0.2}><p className="mt-8 max-w-lg text-lg leading-relaxed text-silver">Algae, mildew, oil and weather leave a dull film on everything outside. Our pressure washing brings concrete, pavers, siding and decks back to the way they looked when they were new.</p></Reveal>
            <Reveal delay={0.3} className="mt-9"><Button to="/contact">Free pressure washing quote</Button></Reveal>
          </div>
          <Reveal y={60} className="lg:col-span-6">
            <Scene className="aspect-[5/4] w-full overflow-hidden rounded-[32px] border border-silver/15 bg-gradient-to-b from-ink/60 to-navy/30" camera={[0, 0.6, 7.6]} fov={38} label="Interactive 3D paver slab. Move your pointer over it to pressure wash it clean." fallback={null}>
              {({ full }) => <WashSlab api={api} onProgress={setPct} full={full} reduced={reduced} />}
            </Scene>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="h-1.5 min-w-[120px] flex-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="3D slab cleaning progress"><div className="h-full rounded-full bg-gradient-to-r from-royal to-royal-light transition-[width] duration-300" style={{ width: `${pct}%` }} /></div>
              <span className="w-24 text-xs font-bold uppercase tracking-[0.2em] text-silver" aria-live="polite">{pct >= 100 ? 'Spotless ✦' : `${pct}% clean`}</span>
              <button onClick={() => api.current?.auto()} className="min-h-[44px] rounded-full border border-silver/25 px-5 text-sm font-bold text-silver transition-colors hover:border-white hover:text-white">Wash it for me</button>
              <button onClick={() => api.current?.reset()} className="min-h-[44px] rounded-full border border-silver/25 px-5 text-sm font-bold text-silver transition-colors hover:border-white hover:text-white">Reset</button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-midnight pb-28 md:pb-40">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <Reveal><WashReveal /></Reveal>
        </div>
      </section>

      <section className="bg-mist py-28 text-navy md:py-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle light eyebrow="Surfaces we clean" title="If it is outside,|we can *restore* it." />
          <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-navy/10 bg-navy/10 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {pressureService.surfaces.map(([t, d], i) => (
              <div key={t} className="group relative bg-white p-8 transition-colors duration-500 hover:bg-navy hover:text-white md:p-10">
                <span className="serif-accent text-2xl text-royal transition-colors group-hover:text-royal-light">0{i + 1}</span>
                <h3 className="mt-8 text-2xl font-extrabold tracking-[-0.04em]">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed opacity-70">{d}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-navy py-28 md:py-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="The right pressure" title="Powerful where it counts,|*gentle* where it matters.">Not every surface can take the same force. We choose the nozzle, pressure and cleaner for each material, switching to soft washing for delicate siding.</SectionTitle>
          <div className="mt-14"><Steps steps={pressureService.steps} /></div>
        </div>
      </section>

      <section className="bg-midnight py-28 md:py-40">
        <div className="mx-auto grid max-w-[1500px] gap-14 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4"><SectionTitle eyebrow="FAQ" title="Good *questions*." /></div>
          <Reveal className="lg:col-span-8"><Faq items={pressureService.faqs} /></Reveal>
        </div>
      </section>
      <Cta />
    </>
  )
}
