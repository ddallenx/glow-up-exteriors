import { useRef, useState } from 'react'
import { site } from '../config/site'
import { gsap } from '../lib/gsap'
import Button from './Button'

const SERVICES = ['Window washing', 'Pressure washing', 'Both']
const field = 'w-full rounded-2xl border border-silver/20 bg-white/[0.04] px-5 py-4 text-[16px] text-white placeholder:text-silver-dim/70 transition-colors focus:border-royal-light focus:bg-white/[0.07] focus:outline-none'
const label = 'mb-2 block text-[12px] font-bold uppercase tracking-[0.2em] text-silver'

export default function QuoteForm() {
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | mailto | error
  const [service, setService] = useState('Both')
  const form = useRef(null)

  const validate = (d) => {
    const e = {}
    if (!d.name.trim()) e.name = 'Please tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(d.email)) e.email = 'Enter a valid email address.'
    if (d.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a phone number we can reach you on.'
    if (!d.address.trim()) e.address = 'Add your neighborhood or address so we can check coverage.'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const data = Object.fromEntries(new FormData(form.current))
    data.service = service
    if (data.company) return // honeypot
    const e = validate(data)
    setErrors(e)
    if (Object.keys(e).length) {
      form.current.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    const summary = `New quote request — ${site.name}\n\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nAddress/area: ${data.address}\nService: ${data.service}\nHome type: ${data.home}\nTiming: ${data.timing}\n\nDetails:\n${data.message || '(none)'}`
    if (site.formEndpoint) {
      setStatus('sending')
      try {
        const res = await fetch(site.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        if (!res.ok) throw new Error('bad')
        setStatus('sent')
      } catch {
        setStatus('error')
      }
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
            ? 'Thank you! We will review your details and get back to you with a free quote shortly.'
            : 'Your email app should have opened with your request filled in. Just press send and we will get back to you with a free quote. If nothing opened, email or call us directly.'}
        </p>
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
        <div><label className={label} htmlFor="name">Full name</label><input id="name" name="name" autoComplete="name" className={field} placeholder="Jordan Smith" {...a11y('name')} />{err('name')}</div>
        <div><label className={label} htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className={field} placeholder="(555) 123-4567" {...a11y('phone')} />{err('phone')}</div>
        <div><label className={label} htmlFor="email">Email</label><input id="email" name="email" type="email" inputMode="email" autoComplete="email" className={field} placeholder="you@example.com" {...a11y('email')} />{err('email')}</div>
        <div><label className={label} htmlFor="address">Address or neighborhood</label><input id="address" name="address" autoComplete="street-address" className={field} placeholder="123 Maple Street" {...a11y('address')} />{err('address')}</div>
        <div>
          <label className={label} htmlFor="home">Home type</label>
          <select id="home" name="home" className={`${field} appearance-none`} defaultValue="Single-story">
            {['Single-story', 'Two-story', 'Three-story or larger', 'Townhome / condo', 'Not sure'].map((o) => <option key={o} className="bg-navy">{o}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="timing">When would you like us?</label>
          <select id="timing" name="timing" className={`${field} appearance-none`} defaultValue="As soon as possible">
            {['As soon as possible', 'Within 2 weeks', 'This month', 'Just getting a price'].map((o) => <option key={o} className="bg-navy">{o}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={label} htmlFor="message">Anything we should know? <span className="font-medium normal-case tracking-normal text-silver-dim">(optional)</span></label>
          <textarea id="message" name="message" rows={4} className={`${field} resize-none`} placeholder="Number of windows, problem areas, gate codes, pets…" />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-sm text-silver-dim">Free, no-obligation quote. We only use your details to reply to you.</p>
        <Button type="submit" disabled={status === 'sending'} arrow={status !== 'sending'}>{status === 'sending' ? 'Sending…' : 'Request free quote'}</Button>
      </div>
      {status === 'error' && <p role="alert" className="mt-5 rounded-2xl bg-[#ff9aa8]/10 p-4 text-sm font-semibold text-[#ff9aa8]">Something went wrong sending your request. Please try again, or call {site.phone}.</p>}
    </form>
  )
}
