import { site } from '../config/site'
import Button from './Button'
import { Headline, Reveal } from './Reveal'
import Avatar from './Avatar'
import { team } from '../config/site'

export default function Cta({ title = 'Ready to|*glow up* your home?' }) {
  return (
    <section className="relative isolate overflow-hidden bg-midnight py-28 md:py-44">
      <div className="mx-auto max-w-[1500px] px-5 text-center md:px-10">
        <Reveal className="mb-8 flex items-center justify-center gap-4">
          <span className="flex -space-x-4">{team.map((p) => <Avatar key={p.name} person={p} className="h-14 w-14 ring-2 ring-black md:h-16 md:w-16" />)}</span>
          <span className="text-left text-sm font-semibold text-silver">Divine, Jeremy &amp; Colin<br /><span className="font-medium text-silver-dim">Your co-founders</span></span>
        </Reveal>
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
