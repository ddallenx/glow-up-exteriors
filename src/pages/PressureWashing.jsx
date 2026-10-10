import { pressureService } from '../config/site'
import { useDocumentTitle } from '../hooks/useMedia'
import { Headline, Reveal, RevealGroup } from '../components/Reveal'
import Button from '../components/Button'
import SectionTitle from '../components/SectionTitle'
import WashReveal from '../components/WashReveal'
import Steps from '../components/Steps'
import Faq from '../components/Faq'
import Cta from '../components/Cta'

export default function PressureWashing() {
  useDocumentTitle('Pressure Washing')
  return (
    <>
      <section className="relative isolate overflow-hidden bg-midnight pb-16 pt-36 md:pb-24 md:pt-44">
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(50% 60% at 10% 30%, rgba(42,82,255,.3), transparent 70%)' }} />
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <Reveal><p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">Service 02</p></Reveal>
          <Headline text="Wash away|the *years*." className="font-display mt-6 text-[clamp(3.2rem,10vw,10rem)] font-extrabold" />
          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <Reveal delay={0.2} className="lg:col-span-6"><p className="text-lg leading-relaxed text-silver">Algae, mildew, oil and weather leave a dull film on everything outside. Our pressure washing brings concrete, pavers, siding and decks back to the way they looked when they were new.</p></Reveal>
            <Reveal delay={0.3} className="lg:col-span-6 lg:flex lg:justify-end"><Button to="/contact">Free pressure washing quote</Button></Reveal>
          </div>
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
