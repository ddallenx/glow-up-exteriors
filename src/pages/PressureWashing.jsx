import { pressureService } from '../config/site'
import { useDocumentTitle } from '../hooks/useMedia'
import { Headline, Reveal, RevealGroup, ScrubText } from '../components/Reveal'
import Marquee from '../components/Marquee'
import OrbSection from '../components/OrbSection'
import Button from '../components/Button'
import SectionTitle from '../components/SectionTitle'
import WashReveal from '../components/WashReveal'
import Steps from '../components/Steps'
import Faq from '../components/Faq'
import Cta from '../components/Cta'
import { useReducedMotion } from '../hooks/useMedia'

export default function PressureWashing() {
  useDocumentTitle('Pressure Washing')
  const reduced = useReducedMotion()
  return (
    <>
      <section className="relative isolate overflow-hidden bg-midnight pb-16 pt-36 md:pb-24 md:pt-44">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="max-w-3xl">
            <Reveal><p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">Service 02</p></Reveal>
            <Headline text="Wash away|the *years*." className="font-display mt-6 text-[clamp(3.2rem,9vw,9rem)] font-extrabold" />
            <Reveal delay={0.2}><p className="mt-8 max-w-lg text-lg leading-relaxed text-silver">Algae, mildew, oil and weather leave a dull film on everything outside. Our pressure washing brings concrete, pavers, siding and decks back to the way they looked when they were new.</p></Reveal>
            <Reveal delay={0.3} className="mt-9"><Button to="/contact">Free pressure washing quote</Button></Reveal>
          </div>
        </div>
      </section>

      <Marquee className="bg-transparent" words={['Driveways', 'Patios', 'Siding', 'Decks', 'Walkways', 'Parking Areas', 'Residential', 'Commercial']} />

      <section className="bg-midnight py-24 md:py-36">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <ScrubText
            className="font-display max-w-6xl text-[clamp(1.8rem,4.4vw,4rem)] font-bold leading-[1.08] tracking-[-0.04em]"
            text="Years of algae, oil and grime disappear in a single pass. The right pressure for every surface, so concrete, pavers and siding look *new* again."
          />
        </div>
      </section>

      <section className="bg-midnight pb-28 md:pb-40">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <Reveal><WashReveal /></Reveal>
        </div>
      </section>

      <section className="bg-midnight py-28 md:py-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="Surfaces we clean" title="If it is outside,|we can *restore* it." />
          <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-silver/15 bg-silver/10 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {pressureService.surfaces.map(([t, d], i) => (
              <div key={t} className="group relative bg-midnight p-8 transition-colors duration-500 hover:bg-ink md:p-10">
                <span className="serif-accent text-2xl text-royal transition-colors group-hover:text-royal-light">0{i + 1}</span>
                <h3 className="mt-8 text-2xl font-extrabold tracking-[-0.04em]">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed opacity-70">{d}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <OrbSection eyebrow="Spotless" title="Every surface,|every *detail*." body="From a family driveway to a commercial parking area, we match pressure and technique to the material so the finish is clean, even and safe." flip cta={{ to: '/contact', label: 'Get a free quote' }} />

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
