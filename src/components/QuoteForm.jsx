import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { site } from '../config/site'
import { estimate, money } from '../lib/pricing'
import { gsap } from '../lib/gsap'
import Button from './Button'

const SERVICES = ['Window washing', 'Pressure washing', 'Both']
const SOURCES = ['Instagram', 'TikTok', 'Facebook', 'Google search / Maps', 'Friend or neighbor', 'Saw us working nearby', 'Flyer or door hanger', 'Other']
const endpoint = site.formEndpoint || (site.leadEmail ? `https://formsubmit.co/ajax/${site.leadEmail}` : '')
const digitsOnly = (s) => s.replace(/[^\d+]/g, '')
const field = 'w-full rounded-2xl border border-silver/20 bg-white/[0.04] px-5 py-4 text-[16px] text-white placeholder:text-silver-dim/70 transition-colors focus:border-royal-light focus:bg-white/[0.07] focus:outline-none'
const label = 'mb-2 block text-[12px] font-bold uppercase tracking-[0.2em] text-silver'

export default function QuoteForm() {
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | mailto | error
  const [params] = useSearchParams()
  const [service, setService] = useState(params.get('service') === 'windows' ? 'Window washing' : 'Both')
  const [windows, setWindows] = useState(params.get('windows') || '')
  const [sides, setSides] = useState(params.get('sides') === 'both' ? 'Inside & outside' : 'Outside only')
  const [property, setProperty] = useState(params.get('type') === 'commercial' ? 'Commercial' : 'Residential')
  const commercial = property === 'Commercial'
  const form = useRef(null)
  const summaryRef = useRef('')

  const validate = (d) => {
    const e = {}
    if (!d.name.trim()) e.name = 'Please tell us your name.'
    if (d.email.trim() && !/^\S+@\S+\.\S+$/.test(d.email.trim())) e.email = 'Check your email address, or leave it blank.'
    if (d.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a phone number we can call or text.'
    if (!d.address.trim()) e.address = 'Add your neighborhood or address so we can check coverage.'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const data = Object.fromEntries(new FormData(form.current))
    data.service = service
    data.property = property
    data.windows = windows
    data.sides = sides
    const est = windows && service !== 'Pressure washing' ? estimate(windows, sides === 'Inside & outside') : null
    data.estimate = est ? `${money(est.low)} – ${money(est.high)}` : ''
    if (data.company) return // honeypot
    const e = validate(data)
    setErrors(e)
    if (Object.keys(e).length) {
      form.current.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    const windowsLine = data.windows && service !== 'Pressure washing' ? `${data.windows} (${data.sides}) — estimate ${data.estimate}` : ''
    const utm = ['utm_source', 'utm_medium', 'utm_campaign'].map((k) => params.get(k)).filter(Boolean).join(' / ')
    const summary = `New quote request — ${site.name}\n\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email || '(not given)'}\nAddress/area: ${data.address}\nProperty: ${data.property}${data.business ? ' — ' + data.business : ''}\nService: ${data.service}${windowsLine ? `\nWindows: ${windowsLine}` : ''}\nProperty type: ${data.home}\nTiming: ${data.timing}\nHeard about us: ${data.source || '(not given)'}\n\nDetails:\n${data.message || '(none)'}`
    summaryRef.current = summary
    if (endpoint) {
      setStatus('sending')
      // Readable labels so the lead email is easy to scan on a phone.
      const lead = {
        _subject: `New ${data.property.toLowerCase()} lead: ${data.name} — ${data.service}`,
        _template: 'table',
        _captcha: 'false',
        Name: data.name,
        Phone: data.phone,
        email: data.email || undefined, // used as the reply-to address
        'Address / area': data.address,
        Property: data.property + (data.business ? ` — ${data.business}` : ''),
        Service: data.service,
        Windows: windowsLine || undefined,
        [commercial ? 'Property type' : 'Home type']: data.home,
        Timing: data.timing,
        'Heard about us': data.source || undefined,
        Campaign: utm || undefined,
        Details: data.message || undefined,
        'Sent from': window.location.href,
      }
      const sendEmail = async () => {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(lead) })
        const body = await res.json().catch(() => ({}))
        if (!res.ok || body.success === false || body.success === 'false') throw new Error(body.message || 'bad')
      }
      // Text alert through Quo (api/lead.js). Does nothing until Quo is set up in Vercel.
      const sendText = async () => {
        const res = await fetch('/api/lead', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, windows: windowsLine, company: undefined }) })
        const body = await res.json().catch(() => ({}))
        if (!res.ok || !body.ok) throw new Error('not sent')
      }
      // The lead counts as delivered if either the email or the text went through.
      const [email, text] = await Promise.allSettled([sendEmail(), sendText()])
      setStatus(email.status === 'fulfilled' || text.status === 'fulfilled' ? 'sent' : 'error')
    } else {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Free quote request — ' + data.service)}&body=${encodeURIComponent(summary)}`
      setStatus('mailto')
    }
    requestAnimationFrame(() => gsap.fromTo('[data-done]', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out' }))
  }

  if (status === 'sent' || status === 'mailto') {
    return (
      <div data-done className="glass flex min-h-[520px] flex-col items-center justify-center rounded-[32px] p-10 text-center" role="status">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-royal-light to-royal-deep shadow-[0_0_60px_rgba(0,122,255,.6)]">
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </div>
        <h3 className="font-display text-4xl font-extrabold">{status === 'sent' ? 'Request received.' : 'Almost there.'}</h3>
        <p className="mt-4 max-w-md text-silver-dim">
          {status === 'sent'
            ? 'Thank you! We will call or text you shortly with your free quote. Need us sooner? Give us a call.'
            : 'Your email app should have opened with your request filled in. Just press send and we will get back to you with a free quote. If nothing opened, email or call us directly.'}
        </p>
        {status === 'sent' && <Button href={`tel:${digitsOnly(site.phone)}`} variant="ghost" className="mt-8" arrow={false}>Call {site.phone}</Button>}
        {status === 'mailto' && <Button href={`mailto:${site.email}`} variant="ghost" className="mt-8" arrow={false}>{site.email}</Button>}
      </div>
    )
  }

  const err = (k) => errors[k] && <p id={`${k}-err`} className="mt-2 text-sm font-semibold text-[#ff9aa8]">{errors[k]}</p>
  const a11y = (k) => ({ 'aria-invalid': errors[k] ? 'true' : undefined, 'aria-describedby': errors[k] ? `${k}-err` : undefined })

  return (
    <form ref={form} onSubmit={submit} noValidate className="glass relative rounded-[32px] p-6 md:p-10" aria-label="Free quote request">
      <div className="absolute left-[-9999px]" aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
      <fieldset className="mb-8">
        <legend className={label}>Property</legend>
        <div className="grid grid-cols-2 gap-3">
          {['Residential', 'Commercial'].map((s) => (
            <label key={s} className={`flex min-h-[56px] cursor-pointer items-center justify-center rounded-2xl border px-4 text-center text-[15px] font-bold transition-all has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-royal-light ${property === s ? 'border-royal bg-royal/25 text-white shadow-[0_0_30px_-6px_rgba(0,122,255,.8)]' : 'border-silver/20 text-silver hover:border-silver/50'}`}>
              <input type="radio" name="property" value={s} checked={property === s} onChange={() => setProperty(s)} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-8">
        <legend className={label}>What do you need?</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SERVICES.map((s) => (
            <label key={s} className={`flex min-h-[56px] cursor-pointer items-center justify-center rounded-2xl border px-4 text-center text-[15px] font-bold transition-all has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-royal-light ${service === s ? 'border-royal bg-royal/25 text-white shadow-[0_0_30px_-6px_rgba(0,122,255,.8)]' : 'border-silver/20 text-silver hover:border-silver/50'}`}>
              <input type="radio" name="service" value={s} checked={service === s} onChange={() => setService(s)} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 md:grid-cols-2">
        {commercial && <div className="md:col-span-2"><label className={label} htmlFor="business">Business or property name</label><input id="business" name="business" autoComplete="organization" className={field} placeholder="Acme Dental, Maple Plaza HOA…" /></div>}
        <div><label className={label} htmlFor="name">Full name</label><input id="name" name="name" autoComplete="name" className={field} placeholder="Jordan Smith" {...a11y('name')} />{err('name')}</div>
        <div><label className={label} htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className={field} placeholder="(555) 123-4567" {...a11y('phone')} />{err('phone')}</div>
        <div><label className={label} htmlFor="email">Email <span className="font-medium normal-case tracking-normal text-silver-dim">(optional)</span></label><input id="email" name="email" type="email" inputMode="email" autoComplete="email" className={field} placeholder="you@example.com" {...a11y('email')} />{err('email')}</div>
        <div><label className={label} htmlFor="address">{commercial ? 'Property address' : 'Address or neighborhood'}</label><input id="address" name="address" autoComplete="street-address" className={field} placeholder="123 Maple Street" {...a11y('address')} />{err('address')}</div>
        <div>
          <label className={label} htmlFor="home">{commercial ? 'Property type' : 'Home type'}</label>
          <select key={property} id="home" name="home" className={`${field} appearance-none`}>
            {(commercial ? ['Office', 'Retail / storefront', 'Restaurant / hospitality', 'Medical / professional', 'Multi-unit / HOA', 'Other'] : ['Single-story', 'Two-story', 'Three-story or larger', 'Townhome / condo', 'Not sure']).map((o) => <option key={o} className="bg-navy">{o}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="timing">When would you like us?</label>
          <select id="timing" name="timing" className={`${field} appearance-none`} defaultValue="As soon as possible">
            {['As soon as possible', 'Within 2 weeks', 'This month', 'Just getting a price'].map((o) => <option key={o} className="bg-navy">{o}</option>)}
          </select>
        </div>
        {service !== 'Pressure washing' && (
          <>
            <div>
              <label className={label} htmlFor="windows">Approx. number of windows <span className="font-medium normal-case tracking-normal text-silver-dim">(optional)</span></label>
              <input id="windows" name="windows" inputMode="numeric" value={windows} onChange={(e) => setWindows(e.target.value.replace(/\D/g, '').slice(0, 3))} className={field} placeholder="e.g. 24" />
            </div>
            <div>
              <label className={label} htmlFor="sides">Glass to clean</label>
              <select id="sides" name="sides" value={sides} onChange={(e) => setSides(e.target.value)} className={`${field} appearance-none`}>
                <option className="bg-navy">Outside only</option><option className="bg-navy">Inside &amp; outside</option>
              </select>
            </div>
            {windows && estimate(windows, sides === 'Inside & outside').n > 0 && (
              <p className="rounded-2xl border border-royal/40 bg-royal/10 px-5 py-4 text-sm font-semibold text-white md:col-span-2">Estimate: {money(estimate(windows, sides === 'Inside & outside').low)} – {money(estimate(windows, sides === 'Inside & outside').high)}. <span className="font-medium text-silver">We confirm the exact price in your free quote.</span></p>
            )}
          </>
        )}
        <div className="md:col-span-2">
          <label className={label} htmlFor="source">How did you hear about us? <span className="font-medium normal-case tracking-normal text-silver-dim">(optional)</span></label>
          <select id="source" name="source" className={`${field} appearance-none`} defaultValue="">
            <option value="" className="bg-navy">Choose one</option>
            {SOURCES.map((o) => <option key={o} className="bg-navy">{o}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={label} htmlFor="message">Anything we should know? <span className="font-medium normal-case tracking-normal text-silver-dim">(optional)</span></label>
          <textarea id="message" name="message" rows={4} className={`${field} resize-none`} placeholder="Number of windows, problem areas, access notes, hours…" />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-sm text-silver-dim">Free, no-obligation quote. By sending, you agree we may call or text you about your quote. Msg &amp; data rates may apply; reply STOP to opt out.</p>
        <Button type="submit" disabled={status === 'sending'} arrow={status !== 'sending'}>{status === 'sending' ? 'Sending…' : 'Request free quote'}</Button>
      </div>
      {status === 'error' && (
        <div role="alert" className="mt-5 rounded-2xl bg-[#ff9aa8]/10 p-4 text-sm font-semibold text-[#ff9aa8]">
          Something went wrong sending your request. Please try again, or reach us directly:{' '}
          <a className="underline underline-offset-4 hover:text-white" href={`tel:${digitsOnly(site.phone)}`}>call {site.phone}</a>
          {' '}or{' '}
          <a className="underline underline-offset-4 hover:text-white" href={`mailto:${site.email}?subject=${encodeURIComponent('Free quote request')}&body=${encodeURIComponent(summaryRef.current)}`}>email your request</a>.
        </div>
      )}
    </form>
  )
}
