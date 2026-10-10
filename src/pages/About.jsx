import { team } from '../config/site'
import { useDocumentTitle } from '../hooks/useMedia'
import { Headline, Reveal, RevealGroup, ScrubText } from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import Cta from '../components/Cta'

function Portrait({ person }) {
  if (person.photo) return <img src={person.photo} alt={`Portrait of ${person.name}`} className="h-full w-full object-cover" loading="lazy" />
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-ink via-navy to-midnight" role="img" aria-label={`${person.name}, ${person.role}`}>
      <div aria-hidden="true" className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-royal/40 blur-[70px] transition-transform duration-700 group-hover:scale-125" />
      <span aria-hidden="true" className="serif-accent relative select-none text-[clamp(8rem,16vw,12rem)] leading-none text-silver-grad">{person.name[0]}</span>
    </div>
  )
}

export default function About() {
  useDocumentTitle('About Us')
  return (
    <>
      <section className="relative isolate overflow-hidden bg-midnight pb-20 pt-36 md:pb-32 md:pt-48">
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(60% 60% at 80% 0%, rgba(42,82,255,.35), transparent 70%)' }} />
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <Reveal><p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">About Glow Up Exteriors</p></Reveal>
          <Headline text="Young hands.|Serious *standards*." className="font-display mt-6 text-[clamp(3.2rem,10vw,10rem)] font-extrabold" />
        </div>
      </section>

      <section className="bg-midnight pb-28 md:pb-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <ScrubText
            className="font-display max-w-6xl text-[clamp(1.8rem,4.4vw,4rem)] font-bold leading-[1.08] tracking-[-0.04em]"
            text="Glow Up Exteriors began with a simple idea: a clean home lifts a whole street. Three young people, a love for the community and a refusal to settle for *good enough*."
          />
        </div>
      </section>

      <section className="bg-navy py-28 md:py-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="The team" title="The people behind the *glow*." />
          <RevealGroup className="mt-16 grid gap-6 lg:grid-cols-3" stagger={0.15}>
            {team.map((p) => (
              <article key={p.name} className="group overflow-hidden rounded-[32px] border border-silver/15 bg-midnight/60 transition-transform duration-700 hover:-translate-y-2">
                <div className="aspect-[4/4.2] overflow-hidden"><Portrait person={p} /></div>
                <div className="p-7 md:p-9">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-4xl font-extrabold">{p.name}</h3>
                    {p.age && <span className="serif-accent text-2xl text-silver-dim">{p.age}</span>}
                  </div>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-royal-light">{p.role}</p>
                  <p className="serif-accent mt-5 text-2xl leading-snug text-silver-grad">{p.focus}</p>
                  <p className="mt-5 text-[15px] leading-relaxed text-silver-dim">{p.bio}</p>
                </div>
              </article>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-mist py-28 text-navy md:py-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle light eyebrow="What we stand for" title="Three promises,|*every* job." />
          <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.12}>
            {[
              ['Community first', 'We live where we work. Every clean home makes the neighborhood a little brighter and friendlier.'],
              ['Care for your home', 'We protect your landscaping, respect your property and choose methods that are safe for each surface.'],
              ['Prestige service', 'Clear communication, on-time arrivals and a final walkthrough, because details are what people remember.'],
            ].map(([t, d]) => (
              <div key={t} className="rounded-3xl border border-navy/10 bg-white p-8 shadow-[0_30px_60px_-30px_rgba(10,22,51,.25)]">
                <h3 className="text-2xl font-extrabold tracking-[-0.04em]">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-navy/65">{d}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>
      <Cta title="Let us give your|home a *glow up*." />
    </>
  )
}
