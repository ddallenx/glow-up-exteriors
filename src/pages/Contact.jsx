import { useState } from 'react'
import { site } from '../config/site'
import { useDocumentTitle } from '../hooks/useMedia'
import { Headline, Reveal } from '../components/Reveal'
import QuoteForm from '../components/QuoteForm'

const digits = (s) => s.replace(/[^\d+]/g, '')

function Row({ label, value, href, copy }) {
  const [copied, setCopied] = useState(false)
  const doCopy = async () => {
    try { await navigator.clipboard.writeText(copy); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* ignore */ }
  }
  return (
    <div className="flex items-end justify-between gap-4 border-b border-silver/15 py-6">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-silver-dim">{label}</p>
        {href ? <a href={href} className="mt-2 block break-words text-xl font-bold tracking-tight transition-colors hover:text-royal-light md:text-2xl">{value}</a> : <p className="mt-2 text-xl font-bold tracking-tight md:text-2xl">{value}</p>}
      </div>
      {copy && <button onClick={doCopy} className="min-h-[44px] shrink-0 rounded-full border border-silver/25 px-4 text-xs font-bold text-silver transition-colors hover:border-white hover:text-white" aria-live="polite">{copied ? 'Copied' : 'Copy'}</button>}
    </div>
  )
}

export default function Contact() {
  useDocumentTitle('Free Quote')
  return (
    <section className="relative isolate overflow-hidden bg-midnight pb-28 pt-36 md:pb-40 md:pt-44">
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(50% 50% at 90% 10%, rgba(63,114,255,.35), transparent 70%), radial-gradient(40% 40% at 0% 100%, rgba(142,170,255,.15), transparent 70%)' }} />
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <Reveal><p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">Contact</p></Reveal>
        <Headline text="Let us give you|a free *quote*." className="font-display mt-6 text-[clamp(3rem,9vw,9rem)] font-extrabold" />
        <div className="mt-16 grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7"><QuoteForm /></Reveal>
          <Reveal delay={0.15} className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="max-w-md text-lg leading-relaxed text-silver">Tell us a little about your home and we will get back to you with a clear, friendly quote. No pressure, no obligation.</p>
              <div className="mt-8 border-t border-silver/15">
                <Row label="Call or text" value={site.phone} href={`tel:${digits(site.phone)}`} copy={site.phone} />
                <Row label="Email" value={site.email} href={`mailto:${site.email}`} copy={site.email} />
                <Row label="Hours" value={site.hours} />
                <Row label="Service area" value={site.serviceArea} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
