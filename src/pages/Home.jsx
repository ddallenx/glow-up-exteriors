import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { heroVideo, site } from '../config/site'
import { gsap } from '../lib/gsap'
import OrbSection from '../components/OrbSection'
import Tilt from '../components/Tilt'
import { useTier } from '../hooks/useTier'
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

function Hero() {
  const desktop = useIsDesktop()
  const reduced = useReducedMotion()
  const [gl, setGl] = useState(true)
  const hero = useRef(null), content = useRef(null), stage = useRef(null)
  useEffect(() => setGl(webglAvailable()), [])

  // Scroll-driven depth: copy drifts up and fades, the 3D stage pushes in.
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const st = { trigger: hero.current, start: 'top top', end: 'bottom 20%', scrub: true }
      gsap.to(content.current, { yPercent: -14, opacity: 0, ease: 'none', scrollTrigger: st })
      gsap.to(stage.current, { scale: 1.12, ease: 'none', scrollTrigger: st })
    }, hero)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={hero} className="relative isolate min-h-[100svh] overflow-hidden bg-midnight">
      <div ref={stage} className="absolute inset-x-0 bottom-0 h-[54svh] [mask-image:linear-gradient(to_bottom,transparent,black_22%)] md:inset-0 md:h-auto md:[mask-image:none]">
        {heroVideo.src ? (
          <video className="absolute inset-0 h-full w-full object-cover" src={heroVideo.src} poster={heroVideo.poster || undefined} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
        ) : gl ? (
          <SceneBoundary>
            <Suspense fallback={<SceneFallback />}>
              <HouseScene desktop={desktop} reduced={reduced} />
            </Suspense>
          </SceneBoundary>
        ) : <SceneFallback />}
      </div>
      {/* readability gradients */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#050d24_0%,rgba(5,13,36,.85)_30%,rgba(5,13,36,0)_52%)] md:bg-[linear-gradient(90deg,rgba(5,13,36,.92)_0%,rgba(5,13,36,.55)_36%,rgba(5,13,36,0)_62%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: 'radial-gradient(45% 55% at 78% 62%, rgba(0,122,255,.22), transparent 70%)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-midnight/85 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-midnight via-midnight/70 to-transparent" />

      <div ref={content} className="pointer-events-none relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col justify-start px-5 pb-[calc(54svh-2rem)] pt-28 md:justify-center md:px-10 md:pb-16 md:pt-24">
        <Reveal y={20} delay={0.1}>
          <p className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.35em] text-silver">
            <span className="h-px w-10 bg-royal-light" /> Residential & commercial window and pressure washing
          </p>
        </Reveal>
        <Headline text="Your home,|*glowing*|again." className="font-display mt-6 text-[clamp(3.4rem,11vw,9rem)] font-extrabold text-white" />
        <Reveal delay={0.25} className="mt-7 max-w-md">
          <p className="text-[17px] leading-relaxed text-silver md:text-lg">
            Streak-free glass and spotless exteriors for homes and businesses. A young local crew that treats every property like our own.
          </p>
        </Reveal>
        <Reveal delay={0.35} className="pointer-events-auto mt-8 flex gap-3">
          <Button to="/contact" className="max-sm:!px-5">Get a free quote</Button>
          <Button to="/window-washing" variant="ghost" arrow={false} className="max-sm:!px-5">Services</Button>
        </Reveal>
        <p className="pointer-events-none mt-8 hidden text-xs uppercase tracking-[0.25em] text-silver-dim md:block">
          Move your cursor over the house to spray ↗
        </p>
      </div>

      <div aria-hidden="true" className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-silver-dim">Scroll</span>
        <span className="scroll-cue relative block h-12 w-px overflow-hidden bg-white/20" />
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
      <Marquee className="bg-midnight" />

      <section className="relative bg-midnight py-28 md:py-44">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <Reveal><p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">Who we are</p></Reveal>
          <ScrubText
            className="font-display mt-8 max-w-6xl text-[clamp(2rem,5.2vw,4.8rem)] font-bold leading-[1.05] tracking-[-0.04em] text-white"
            text="We are a young, local crew with one obsession: leaving every home and business brighter, cleaner and *glowing*. Crystal-clear windows. Spotless exteriors. Service you can feel proud of."
          />
          <Reveal className="mt-12"><Button to="/about" variant="ghost">Meet the team</Button></Reveal>
        </div>
      </section>

      <OrbSection eyebrow="Crystal clear" title="Every angle,|every *reflection*." body="Streak-free glass should look like there is nothing there at all. Move your cursor and scroll. The glass reacts, just like your windows will in the light." cta={{ to: '/window-washing', label: 'See window washing' }} />

      <section className="relative bg-midnight pb-24 md:pb-36">
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

      <section className="relative bg-midnight pb-28 md:pb-44">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="Services" title="Two ways we|make homes *shine*." />
          <RevealGroup className="mt-16 grid gap-6 lg:grid-cols-2" stagger={0.15}>
            <ServiceCard to="/window-washing" index={1} title="Window Washing" blurb="Crystal-clear, streak-free glass with frames, sills and tracks detailed. See the difference the moment the light hits." items={['Exterior glass', 'Frames & sills', 'Hard-water spots']}
              visual={<AnimatedWindows className="-mt-4 scale-[1.15]" />} />
            <ServiceCard to="/pressure-washing" index={2} title="Pressure Washing" blurb="Driveways, patios, siding and decks restored with the right pressure for each surface — powerful where it counts, gentle where it matters." items={['Driveways', 'Patios', 'Siding', 'Decks']}
              visual={<SprayVisual />} />
          </RevealGroup>
        </div>
      </section>

      <section className="relative overflow-hidden bg-mist py-28 text-navy md:py-40">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-royal/40 to-transparent" />
        <div className="mx-auto grid max-w-[1500px] items-center gap-14 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionTitle light eyebrow="The difference" title="Drag to see|the *glow up*.">
              Years of grime, water spots and haze — gone in one pass. Slide to compare a dirty window with the same pane after a Glow Up wash.
            </SectionTitle>
            <Reveal delay={0.15} className="mt-10"><Button to="/window-washing" variant="dark">See window washing</Button></Reveal>
          </div>
          <Reveal className="lg:col-span-7">
            <WindowCompare index={0} seed={5} />
          </Reveal>
        </div>
      </section>

      <section className="relative bg-midnight py-28 md:py-44">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="How it works" title="Simple,|careful, *spotless*." />
          <div className="mt-16">
            <Steps steps={[
              ['Free quote', 'Tell us about your home. We reply with a clear, no-pressure price.'],
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
