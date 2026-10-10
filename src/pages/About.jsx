import { team } from '../config/site'
import { useDocumentTitle, useIsDesktop } from '../hooks/useMedia'
import { useTier } from '../hooks/useTier'
import { Headline, Reveal, RevealGroup, ScrubText } from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import Scene from '../components/Scene'
import Tilt from '../components/Tilt'
import TeamCards from '../three/TeamCards'
import Cta from '../components/Cta'

function Portrait({ person }) {
  if (person.photo) return <img src={person.photo} alt={`Portrait of ${person.name}`} className="h-full w-full object-cover" loading="lazy" />
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-ink via-navy to-midnight" role="img" aria-label={`${person.name}, ${person.role}`}>
      <div aria-hidden="true" className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-royal/50 blur-[70px] transition-transform duration-700 group-hover:scale-125" />
      <span aria-hidden="true" className="serif-accent relative select-none text-[clamp(8rem,16vw,12rem)] leading-none text-silver-grad">{person.name[0]}</span>
    </div>
  )
}

/** Flat card — identical for each co-founder. Used on phones, weak devices and reduced-motion. */
function TeamCard({ p }) {
  return (
    <Tilt as="article" className="group overflow-hidden rounded-[32px] border border-silver/15 bg-midnight/60">
      <div className="relative aspect-[4/4.2] overflow-hidden">
        <Portrait person={p} />
        <span className="absolute right-4 top-4 flex h-16 w-16 flex-col items-center justify-center rounded-full border border-royal-light/70 bg-midnight/60 backdrop-blur"><span className="text-xl font-extrabold leading-none">{p.age}</span><span className="mt-0.5 text-[8px] font-bold tracking-[0.2em] text-royal-light">YEARS</span></span>
      </div>
      <div className="p-7 md:p-9">
        <h3 className="font-display text-4xl font-extrabold">{p.name}</h3>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-royal-light">{p.role} · Age {p.age}</p>
        <p className="serif-accent mt-5 text-2xl leading-snug text-silver-grad">{p.focus}</p>
        <p className="mt-5 text-[15px] leading-relaxed text-silver-dim">{p.bio}</p>
      </div>
    </Tilt>
  )
}

export default function About() {
  useDocumentTitle('About Us')
  const desktop = useIsDesktop()
  const { reduced, tier } = useTier()
  const rich3d = desktop && (tier === 'full' || tier === 'lite') && !reduced
  const flat = (
    <RevealGroup className="mt-16 grid gap-6 lg:grid-cols-3" stagger={0.15}>
      {team.map((p) => <TeamCard key={p.name} p={p} />)}
    </RevealGroup>
  )
  return (
    <>
      <section className="relative isolate overflow-hidden bg-midnight pb-20 pt-36 md:pb-28 md:pt-48">
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(60% 60% at 80% 0%, rgba(0,122,255,.4), transparent 70%), radial-gradient(40% 50% at 0% 100%, rgba(47,184,255,.14), transparent 70%)' }} />
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <Reveal><p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">About Glow Up Exteriors</p></Reveal>
          <Headline text="Three co-founders.|One *standard*." className="font-display mt-6 text-[clamp(3.2rem,10vw,10rem)] font-extrabold" />
          <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">
            {team.map((p) => (
              <span key={p.name} className="glass inline-flex items-center gap-3 rounded-full py-2 pl-2 pr-5 text-sm font-bold">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-royal-light to-royal-deep text-sm font-extrabold">{p.name[0]}</span>
                {p.name}<span className="font-medium text-silver">· {p.age} · {p.role}</span>
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-midnight pb-28 md:pb-36">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <ScrubText
            className="font-display max-w-6xl text-[clamp(1.8rem,4.4vw,4rem)] font-bold leading-[1.08] tracking-[-0.04em]"
            text="We started Glow Up Exteriors together, three young co-founders with a love for the community and a refusal to settle for *good enough*. Equal partners. Equal pride in every home."
          />
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy py-28 md:py-40">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-royal-light/50 to-transparent" />
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="The co-founders" title="Meet the people|behind the *glow*." />
          {rich3d ? (
            <>
              <Reveal className="mt-10">
                <Scene className="h-[620px] w-full" camera={[0, 0, 7.4]} fov={36} label="Three interactive 3D profile cards for co-founders Divine, Jeremy and Colin. Hover to tilt, click to flip." fallback={flat}>
                  {({ full }) => <TeamCards team={team} reduced={reduced} full={full} />}
                </Scene>
                <p className="mt-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-silver-dim">Hover to tilt · Click a card to flip</p>
              </Reveal>
              <ul className="sr-only">
                {team.map((p) => <li key={p.name}>{p.name}, age {p.age}, {p.role}. {p.focus}. {p.bio}</li>)}
              </ul>
            </>
          ) : flat}
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
              <Tilt key={t} className="rounded-3xl border border-navy/10 bg-white p-8 shadow-[0_30px_60px_-30px_rgba(10,26,66,.3)]" glare={false}>
                <h3 className="text-2xl font-extrabold tracking-[-0.04em]">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-navy/65">{d}</p>
              </Tilt>
            ))}
          </RevealGroup>
        </div>
      </section>
      <Cta title="Let us give your|home a *glow up*." />
    </>
  )
}
