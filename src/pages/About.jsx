import { team } from '../config/site'
import { useDocumentTitle, useIsDesktop } from '../hooks/useMedia'
import { useTier } from '../hooks/useTier'
import { Headline, Reveal, RevealGroup, ScrubText } from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import Scene from '../components/Scene'
import Tilt from '../components/Tilt'
import FounderCard from '../components/FounderCard'
import Avatar from '../components/Avatar'
import TeamCards from '../three/TeamCards'
import Cta from '../components/Cta'
import Marquee from '../components/Marquee'

export default function About() {
  useDocumentTitle('About Us')
  const desktop = useIsDesktop()
  const { reduced, tier } = useTier()
  const rich3d = desktop && (tier === 'full' || tier === 'lite') && !reduced
  const flat = (
    <RevealGroup className="mt-16 grid gap-6 lg:grid-cols-3" stagger={0.15}>
      {team.map((p) => <FounderCard key={p.name} p={p} />)}
    </RevealGroup>
  )
  return (
    <>
      <section className="relative isolate overflow-hidden bg-midnight pb-20 pt-36 md:pb-28 md:pt-48">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <Reveal><p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">About Glow Up Exteriors</p></Reveal>
          <Headline text="Three co-founders.|One *standard*." className="font-display mt-6 text-[clamp(3.2rem,10vw,10rem)] font-extrabold" />
          <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">
            {team.map((p) => (
              <span key={p.name} className="glass inline-flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-5 text-sm font-bold">
                <Avatar person={p} className="h-11 w-11" />
                {p.name}<span className="font-medium text-silver">· {p.age} · {p.role}</span>
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-midnight pb-20 md:pb-28">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <Reveal y={50}>
            <Tilt max={3} glare={false} className="relative overflow-hidden rounded-[28px] border border-silver/15 shadow-[0_50px_100px_-40px_rgba(0,122,255,.45)] md:rounded-[40px]">
              <img src="/team/group-1280.webp" srcSet="/team/group-1280.webp 1280w, /team/group.webp 2560w" sizes="(min-width: 1500px) 1400px, 100vw" alt="Co-founders Divine, Jeremy and Colin in Glow Up Exteriors uniforms beside the company van" loading="lazy" decoding="async" draggable="false" className="aspect-[4/3] w-full object-cover object-[28%_40%] sm:aspect-[3/2] lg:aspect-[16/8]" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-5 right-5 text-[11px] font-bold uppercase tracking-[0.3em] text-silver md:bottom-7 md:left-9">Divine · Jeremy · Colin — the three co-founders</p>
            </Tilt>
          </Reveal>
        </div>
      </section>

      <Marquee className="bg-transparent" words={['Community', 'Quality', 'Integrity', 'Prestige', 'Residential', 'Commercial', 'Co-Founders', 'Glow Up']} />

      <section className="bg-midnight py-24 md:py-36">
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
                <Scene className="h-[680px] w-full" camera={[0, 0, 7.5]} fov={36} label="Three interactive 3D profile cards for co-founders Divine, Jeremy and Colin. Hover to tilt, click to flip." fallback={flat}>
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

      <section className="bg-midnight py-28 md:py-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="What we stand for" title="Three promises,|*every* job." />
          <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.12}>
            {[
              ['Community first', 'We live where we work. Every clean home makes the neighborhood a little brighter and friendlier.'],
              ['Care for your home', 'We protect your landscaping, respect your property and choose methods that are safe for each surface.'],
              ['Prestige service', 'Clear communication, on-time arrivals and a final walkthrough, because details are what people remember.'],
            ].map(([t, d]) => (
              <Tilt key={t} className="rounded-3xl border border-silver/15 bg-gradient-to-b from-ink/70 to-navy/70 p-8" glare={false}>
                <h3 className="text-2xl font-extrabold tracking-[-0.04em]">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-silver-dim">{d}</p>
              </Tilt>
            ))}
          </RevealGroup>
        </div>
      </section>
      <Cta title="Let us give your|home a *glow up*." />
    </>
  )
}
