import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { site, team } from '../config/site'
import FounderCard from '../components/FounderCard'
import { gsap } from '../lib/gsap'
import OrbSection from '../components/OrbSection'
import Estimator from '../components/Estimator'
import Tilt from '../components/Tilt'
import { useDocumentTitle, useIsDesktop, useReducedMotion } from '../hooks/useMedia'
import { Headline, Reveal, RevealGroup, ScrubText } from '../components/Reveal'
import Button from '../components/Button'
import Marquee from '../components/Marquee'
import SectionTitle from '../components/SectionTitle'
import AnimatedWindows from '../components/AnimatedWindows'
import WindowCompare from '../components/WindowCompare'
import Steps from '../components/Steps'
import Cta from '../components/Cta'
import { TLink } from '../components/Transition'
import { SceneBoundary, SceneFallback, webglAvailable } from '../components/SceneBoundary'

const HouseScene = lazy(() => import('../three/HouseScene'))

/** First screen: the three co-founders and the truck, full-bleed, with the offer beside them. */
function Hero() {
  const desktop = useIsDesktop()
  const reduced = useReducedMotion()
  const hero = useRef(null), content = useRef(null), photo = useRef(null)

  useEffect(() => {
    if (reduced || !desktop) return
    const ctx = gsap.context(() => {
      const st = { trigger: hero.current, start: 'top top', end: 'bottom 15%', scrub: true }
      gsap.to(content.current, { yPercent: -12, opacity: 0, ease: 'none', scrollTrigger: st })
      gsap.to(photo.current, { yPercent: 8, scale: 1.08, ease: 'none', scrollTrigger: st })
    }, hero)
    return () => ctx.revert()
  }, [reduced, desktop])

  return (
    <section ref={hero} className="relative isolate overflow-hidden bg-black lg:min-h-[100svh]">
      <div ref={photo} className="relative aspect-[4/3.1] w-full sm:aspect-[3/2] lg:absolute lg:inset-0 lg:aspect-auto">
        <img
          src="/team/group-1280.webp"
          srcSet="/team/group-1280.webp 1280w, /team/group.webp 2560w"
          sizes="100vw"
          alt="Co-founders Divine, Jeremy and Colin in Glow Up Exteriors uniforms beside the company van"
          fetchpriority="high"
          decoding="async"
          draggable="false"
          className="kenburns h-full w-full object-cover object-[26%_42%] lg:object-[30%_45%]"
        />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-black via-black/90 to-transparent lg:hidden" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(270deg,#000_0%,rgba(0,0,0,.92)_26%,rgba(0,0,0,.55)_46%,rgba(0,0,0,0)_66%)] lg:block" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-black to-transparent lg:block" />

      <div className="relative z-10 mx-auto -mt-10 max-w-[1500px] px-5 pb-16 sm:-mt-16 md:px-10 lg:mt-0 lg:flex lg:min-h-[100svh] lg:items-center lg:justify-end lg:pb-12 lg:pt-24">
        <div ref={content} className="lg:w-[40%] lg:max-w-[540px]">
          <Reveal y={20} delay={0.1}>
            <p className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.35em] text-silver">
              <span className="h-px w-10 bg-royal-light" /> Residential &amp; commercial
            </p>
          </Reveal>
          <Headline text="Exterior care,|*elevated*." className="font-display mt-5 text-[clamp(2.9rem,12.5vw,5rem)] font-extrabold text-white lg:text-[clamp(3.2rem,4.9vw,5.6rem)]" />
          <Reveal delay={0.25} className="mt-6">
            <p className="max-w-md text-[17px] leading-relaxed text-silver md:text-lg">
              Streak-free windows and spotless exteriors for homes and businesses, delivered by three young co-founders who show up, do it right and stand behind it.
            </p>
          </Reveal>
          <Reveal delay={0.35} className="mt-8 flex flex-wrap gap-3">
            <Button to="/contact" className="max-sm:!px-5">Get a free quote</Button>
            <Button href="#estimate" variant="ghost" arrow={false} className="max-sm:!px-5">Instant estimate</Button>
          </Reveal>
          <Reveal delay={0.45} className="mt-9">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-bold uppercase tracking-[0.18em] text-silver-dim">
              {['Free quotes', 'Residential', 'Commercial', 'Streak-free finish'].map((t) => (
                <li key={t} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-royal-light" />{t}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <div aria-hidden="true" className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex">
        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-silver-dim">Scroll</span>
        <span className="scroll-cue relative block h-12 w-px overflow-hidden bg-white/20" />
      </div>
    </section>
  )
}

/** Interactive 3D house — hover or tap to spray; camera orbits as you scroll through it. */
function HouseStage() {
  const desktop = useIsDesktop()
  const reduced = useReducedMotion()
  const [gl, setGl] = useState(true)
  useEffect(() => setGl(webglAvailable()), [])
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <div className="relative h-[92svh] min-h-[560px] w-full">
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]">
          {gl ? (
            <SceneBoundary>
              <Suspense fallback={<SceneFallback />}>
                <HouseScene desktop={desktop} reduced={reduced} />
              </Suspense>
            </SceneBoundary>
          ) : <SceneFallback />}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.55)_0%,rgba(0,0,0,0)_30%)] lg:bg-[linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.45)_32%,rgba(0,0,0,0)_58%)]" />
        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-start px-5 pt-16 md:px-10 lg:justify-center lg:pt-0">
          <Reveal><p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">The result</p></Reveal>
          <Headline as="h2" text="Your home,|*glowing* again." className="font-display mt-5 text-[clamp(2.6rem,6.4vw,6rem)] font-extrabold" />
          <Reveal delay={0.2}><p className="mt-5 max-w-sm text-[16px] leading-relaxed text-silver">Explore the house. Move your cursor, or tap and drag, to wash the glass.</p></Reveal>
          <Reveal delay={0.3} className="pointer-events-auto mt-7"><Button to="/window-washing" variant="ghost">See window washing</Button></Reveal>
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ to, index, title, blurb, items, visual }) {
  return (
    <TLink to={to} className="group block [perspective:1200px]"><Tilt max={6} className="relative flex min-h-[560px] flex-col justify-between overflow-hidden rounded-[32px] border border-silver/15 bg-gradient-to-b from-ink to-navy p-7 md:p-10" glare>
      <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-royal/25 blur-[90px] transition-all duration-700 group-hover:bg-royal/45" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="serif-accent text-5xl text-silver-grad">0{index}</span>
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-silver/25 transition-all duration-500 group-hover:rotate-45 group-hover:border-royal-light group-hover:bg-royal">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12L12 4M5 4h7v7" /></svg>
          </span>
        </div>
        <div className="mt-8 h-44 overflow-hidden rounded-2xl">{visual}</div>
      </div>
      <div className="relative mt-10 [transform:translateZ(40px)]">
        <h3 className="font-display text-4xl font-extrabold md:text-5xl">{title}</h3>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-silver-dim">{blurb}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {items.map((i) => <li key={i} className="rounded-full border border-silver/20 px-3.5 py-1.5 text-xs font-semibold text-silver">{i}</li>)}
        </ul>
      </div>
    </Tilt></TLink>
  )
}

const SprayVisual = () => (
  <div className="relative h-full w-full bg-gradient-to-b from-[#10306e] to-[#0a1d4a]">
    <div className="absolute inset-0 opacity-90" style={{ background: 'repeating-linear-gradient(90deg, #7d879c 0 58px, #4d5348 58px 62px)' }} />
    <div className="pane-grime absolute inset-0" style={{ '--dur': '6s', background: 'radial-gradient(circle at 30% 40%, rgba(40,48,34,.9), rgba(40,46,32,.85))' }} />
    <div className="pane-squeegee absolute inset-y-0 w-10 -translate-x-1/2" style={{ '--dur': '6s', background: 'linear-gradient(90deg, transparent, rgba(190,210,255,.9), transparent)', filter: 'blur(6px)' }} />
  </div>
)

function Home() {
  useDocumentTitle('')
  const reviews = site.reviews || []
  return (
    <>
      <Hero />
      <Marquee className="bg-black" />

      <section className="relative bg-midnight py-24 md:py-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <Reveal><p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">Who we are</p></Reveal>
          <ScrubText
            className="font-display mt-8 max-w-6xl text-[clamp(2rem,5.2vw,4.8rem)] font-bold leading-[1.05] tracking-[-0.04em] text-white"
            text="Three co-founders. One standard. We care for homes and businesses the way we would want ours cared for: *thorough*, on time and spotless."
          />
        </div>
      </section>

      <HouseStage />

      <section className="relative bg-midnight py-24 md:py-36">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="Who we serve" title="Homes and *businesses*,|one standard." />
          <RevealGroup className="mt-14 grid gap-6 md:grid-cols-2" stagger={0.15}>
            {[
              ['Residential', 'Homeowners who want sparkling windows and a spotless driveway, patio and siding, without lifting a finger.', ['Single-family homes', 'Townhomes', 'Condos'], '/contact?type=residential', 'Get a home quote'],
              ['Commercial', 'Offices, storefronts, property managers and HOAs who need a clean, professional first impression, on a schedule that suits.', ['Offices', 'Retail', 'Property management', 'HOAs'], '/commercial', 'Explore commercial'],
            ].map(([t, d, tags, to, cta]) => (
              <Tilt key={t} max={5} className="flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[32px] border border-silver/15 bg-gradient-to-br from-ink to-navy p-8 md:p-10">
                <div>
                  <h3 className="font-display text-4xl font-extrabold md:text-5xl">{t}</h3>
                  <p className="mt-4 max-w-md text-[16px] leading-relaxed text-silver-dim">{d}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">{tags.map((x) => <li key={x} className="rounded-full border border-silver/20 px-3.5 py-1.5 text-xs font-semibold text-silver">{x}</li>)}</ul>
                </div>
                <div className="mt-8"><Button to={to} variant={t === 'Commercial' ? 'primary' : 'ghost'}>{cta}</Button></div>
              </Tilt>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Estimator />

      <section className="relative bg-midnight pb-24 md:pb-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="Services" title="Two ways we|make exteriors *shine*." />
          <RevealGroup className="mt-16 grid gap-6 lg:grid-cols-2" stagger={0.15}>
            <ServiceCard to="/window-washing" index={1} title="Window Washing" blurb="Crystal-clear, streak-free glass with frames, sills and tracks detailed. See the difference the moment the light hits." items={['Exterior glass', 'Frames & sills', 'Hard-water spots']}
              visual={<AnimatedWindows className="-mt-4 scale-[1.15]" />} />
            <ServiceCard to="/pressure-washing" index={2} title="Pressure Washing" blurb="Driveways, patios, siding and decks restored with the right pressure for each surface — powerful where it counts, gentle where it matters." items={['Driveways', 'Patios', 'Siding', 'Decks']}
              visual={<SprayVisual />} />
          </RevealGroup>
        </div>
      </section>

      <section className="relative overflow-hidden bg-midnight py-24 md:py-36">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-royal/40 to-transparent" />
        <div className="mx-auto grid max-w-[1500px] items-center gap-14 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionTitle eyebrow="Real results" title="Same window.|The *difference*.">
              A real window we cleaned, shot from the same spot. Hover over the photo, or press and hold on your phone, to watch it clear.
            </SectionTitle>
            <Reveal delay={0.15} className="mt-10"><Button to="/window-washing" variant="ghost">See window washing</Button></Reveal>
          </div>
          <Reveal className="lg:col-span-6"><WindowCompare index={0} seed={5} /></Reveal>
        </div>
      </section>

      <section className="relative bg-midnight pb-24 md:pb-36">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="The co-founders" title="Three founders,|one *promise*." />
          <RevealGroup className="mt-6 grid gap-6 md:grid-cols-3" stagger={0.15}>
            {team.map((p) => <FounderCard key={p.name} p={p} compact />)}
          </RevealGroup>
          <Reveal className="mt-12"><Button to="/about" variant="ghost">Meet the team</Button></Reveal>
        </div>
      </section>

      <OrbSection eyebrow="Crystal clear" title="Every angle,|every *reflection*." body="Streak-free glass should look like there is nothing there at all. Move your cursor and scroll. The glass reacts, just like your windows will in the light." cta={{ to: '/window-washing', label: 'See window washing' }} />

      <section className="relative bg-midnight py-24 md:py-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="How it works" title="Simple,|careful, *spotless*." />
          <div className="mt-16">
            <Steps steps={[
              ['Free quote', 'Tell us about your property. We reply with a clear, no-pressure price.'],
              ['Prep & protect', 'We shield landscaping, sills and entries before we start.'],
              ['The glow up', 'Pro-grade tools and the right technique for every surface.'],
              ['Final walkthrough', 'We check every detail with you, and make it right if it is not perfect.'],
            ]} />
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="bg-navy py-28 md:py-40">
          <div className="mx-auto max-w-[1500px] px-5 md:px-10">
            <SectionTitle eyebrow="Kind words" title="Neighbors *notice*." />
            <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3">
              {reviews.map((r) => (
                <figure key={r.name} className="glass rounded-3xl p-8">
                  <div className="text-royal-light" aria-label={`${r.rating} out of 5 stars`}>{'★'.repeat(r.rating || 5)}</div>
                  <blockquote className="mt-4 text-lg leading-relaxed text-silver">“{r.text}”</blockquote>
                  <figcaption className="mt-6 text-sm font-bold">{r.name}</figcaption>
                </figure>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      <Cta />
    </>
  )
}

export default Home
