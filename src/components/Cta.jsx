import { site } from '../config/site'
import Button from './Button'
import { Headline, Reveal } from './Reveal'

export default function Cta({ title = 'Ready to|*glow up* your home?' }) {
  return (
    <section className="relative isolate overflow-hidden bg-midnight py-28 md:py-44">
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(60% 80% at 50% 120%, rgba(42,82,255,.55), transparent 70%), radial-gradient(40% 50% at 15% 0%, rgba(111,140,255,.18), transparent 70%)' }} />
      <div className="mx-auto max-w-[1500px] px-5 text-center md:px-10">
        <Reveal><p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">Free quote · No pressure</p></Reveal>
        <Headline as="h2" text={title} className="font-display mt-6 text-[clamp(3rem,9vw,9rem)] font-extrabold text-white" />
        <Reveal delay={0.1} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button to="/contact" variant="primary">Request your free quote</Button>
          <Button href={`tel:${site.phone.replace(/[^\d+]/g, '')}`} variant="ghost" arrow={false}>Call {site.phone}</Button>
        </Reveal>
      </div>
    </section>
  )
}
