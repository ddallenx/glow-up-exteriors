import { windowService } from '../config/site'
import { useDocumentTitle } from '../hooks/useMedia'
import { Headline, Reveal, RevealGroup } from '../components/Reveal'
import Button from '../components/Button'
import SectionTitle from '../components/SectionTitle'
import AnimatedWindows from '../components/AnimatedWindows'
import BeforeAfter from '../components/BeforeAfter'
import WindowScene from '../components/WindowScene'
import Steps from '../components/Steps'
import Faq from '../components/Faq'
import Cta from '../components/Cta'

export default function WindowWashing() {
  useDocumentTitle('Window Washing')
  return (
    <>
      <section className="relative isolate overflow-hidden bg-midnight pb-24 pt-36 md:pb-36 md:pt-44">
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(50% 60% at 85% 20%, rgba(42,82,255,.35), transparent 70%)' }} />
        <div className="mx-auto grid max-w-[1500px] items-center gap-14 px-5 md:px-10 lg:grid-cols-2">
          <div>
            <Reveal><p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">Service 01</p></Reveal>
            <Headline text="Windows|so clear,|they *disappear*." className="font-display mt-6 text-[clamp(3rem,8.5vw,8rem)] font-extrabold" />
            <Reveal delay={0.2}><p className="mt-8 max-w-lg text-lg leading-relaxed text-silver">Professional residential window washing that removes dirt, pollen, hard-water spots and haze, so your home lets in more light and looks sharper from the curb.</p></Reveal>
            <Reveal delay={0.3} className="mt-9 flex flex-col gap-3 sm:flex-row"><Button to="/contact">Free window quote</Button><Button href="#compare" variant="ghost" arrow={false}>See the difference</Button></Reveal>
          </div>
          <Reveal y={60}><AnimatedWindows /></Reveal>
        </div>
      </section>

      <section id="compare" className="bg-mist py-28 text-navy md:py-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle light eyebrow="Before & after" title="Slide the *haze* away.">Drag the handle (or use your arrow keys) to compare. Two very different panes, one thorough clean.</SectionTitle>
          <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-2" stagger={0.15}>
            <BeforeAfter before={<WindowScene dirty seed={2} />} after={<WindowScene seed={2} />} initial={35} />
            <BeforeAfter before={<WindowScene dirty seed={9} />} after={<WindowScene seed={9} />} initial={65} />
          </RevealGroup>
        </div>
      </section>

      <section className="bg-midnight py-28 md:py-40">
        <div className="mx-auto grid max-w-[1500px] gap-14 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-5"><SectionTitle eyebrow="What is included" title="Every pane,|every *detail*." /></div>
          <RevealGroup as="ul" className="space-y-4 lg:col-span-7" stagger={0.1}>
            {windowService.includes.map((t) => (
              <li key={t} className="glass flex items-start gap-5 rounded-2xl p-5 md:p-6">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-royal text-white"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
                <span className="text-[17px] font-semibold leading-snug">{t}</span>
              </li>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-navy py-28 md:py-40">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <SectionTitle eyebrow="Our process" title="Four steps to *streak-free*." />
          <div className="mt-14"><Steps steps={windowService.steps} /></div>
        </div>
      </section>

      <section className="bg-midnight py-28 md:py-40">
        <div className="mx-auto grid max-w-[1500px] gap-14 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4"><SectionTitle eyebrow="FAQ" title="Good *questions*." /></div>
          <Reveal className="lg:col-span-8"><Faq items={windowService.faqs} /></Reveal>
        </div>
      </section>
      <Cta />
    </>
  )
}
