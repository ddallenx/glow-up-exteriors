import { commercialService } from '../config/site'
import { useDocumentTitle } from '../hooks/useMedia'
import { Headline, Reveal, RevealGroup, ScrubText } from '../components/Reveal'
import Button from '../components/Button'
import SectionTitle from '../components/SectionTitle'
import Marquee from '../components/Marquee'
import OrbSection from '../components/OrbSection'
import Steps from '../components/Steps'
import Faq from '../components/Faq'
import Tilt from '../components/Tilt'
import Cta from '../components/Cta'

export default function Commercial() {
  useDocumentTitle('Commercial Services')
  return (
    <>
      <section className="relative isolate overflow-hidden pb-24 pt-36 md:pb-32 md:pt-48">
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(55% 60% at 85% 10%, rgba(0,122,255,.4), transparent 70%)' }} />
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <Reveal><p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">Commercial services</p></Reveal>
          <Headline text="A cleaner first|impression for your *business*." className="font-display mt-6 text-[clamp(3rem,8.5vw,8.5rem)] font-extrabold" />
          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <Reveal delay={0.2} className="lg:col-span-6"><p className="text-lg leading-relaxed text-silver">Window washing and pressure washing for offices, storefronts, property managers and HOAs. Reliable crews, clear communication and a polished finish, one time or on a recurring schedule.</p></Reveal>
            <Reveal delay={0.3} className="flex flex-col gap-3 sm:flex-row lg:col-span-6 lg:justify-end"><Button to="/contact?type=commercial">Request a commercial quote</Button><Button to="/window-washing" variant="ghost" arrow={false}>See our methods</Button></Reveal>
          </div>
        </div>
      </section>

      <Marquee className="bg-transparent" />

      <section className="py-24 md:py-36">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="Who we work with" title="Built for the way|businesses *operate*." />
          <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            {commercialService.sectors.map(([t, d], i) => (
              <Tilt key={t} max={6} className="group rounded-3xl border border-silver/15 bg-gradient-to-b from-ink/70 to-navy/70 p-8">
                <span className="serif-accent text-3xl text-royal-light">0{i + 1}</span>
                <h3 className="mt-8 text-2xl font-extrabold tracking-[-0.04em] [transform:translateZ(30px)]">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-silver-dim">{d}</p>
              </Tilt>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="pb-24 md:pb-36">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <ScrubText
            className="font-display max-w-6xl text-[clamp(1.8rem,4.4vw,4rem)] font-bold leading-[1.08] tracking-[-0.04em]"
            text="Your property is the first thing customers, clients and tenants see. We keep it *spotless*, on time and on schedule, so you can focus on running the business."
          />
        </div>
      </section>

      <OrbSection eyebrow="Crystal clear" title="Glass that reflects|your *standards*." body="Clean glass and clean concrete tell people you pay attention to the details. We make sure every entrance, storefront and walkway says exactly that." flip cta={{ to: '/contact?type=commercial', label: 'Get a commercial quote' }} />

      <section className="bg-navy py-24 md:py-36">
        <div className="mx-auto grid max-w-[1500px] gap-14 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-5"><SectionTitle eyebrow="Scope" title="Everything the|exterior *needs*." /></div>
          <RevealGroup as="ul" className="space-y-4 lg:col-span-7" stagger={0.08}>
            {commercialService.includes.map((t) => (
              <li key={t} className="glass flex items-start gap-5 rounded-2xl p-5 md:p-6">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-royal text-white"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
                <span className="text-[17px] font-semibold leading-snug">{t}</span>
              </li>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="py-24 md:py-36">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="Service plans" title="One visit or|every *season*." />
          <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3" stagger={0.12}>
            {commercialService.plans.map(([t, d]) => (
              <Tilt key={t} max={6} className="rounded-3xl border border-silver/15 bg-gradient-to-b from-ink/70 to-navy/70 p-8">
                <h3 className="text-2xl font-extrabold tracking-[-0.04em]">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-silver-dim">{d}</p>
              </Tilt>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-navy py-24 md:py-36">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="How it works" title="Simple for your *team*." />
          <div className="mt-14"><Steps steps={commercialService.steps} /></div>
        </div>
      </section>

      <section className="py-24 md:py-36">
        <div className="mx-auto grid max-w-[1500px] gap-14 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4"><SectionTitle eyebrow="FAQ" title="Good *questions*." /></div>
          <Reveal className="lg:col-span-8"><Faq items={commercialService.faqs} /></Reveal>
        </div>
      </section>
      <Cta title="Ready to impress|every *visitor*?" />
    </>
  )
}
