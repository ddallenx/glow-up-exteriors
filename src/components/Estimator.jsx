import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { pricing } from '../config/site'
import { estimate, money } from '../lib/pricing'
import { useReducedMotion } from '../hooks/useMedia'
import Button from './Button'
import { Reveal } from './Reveal'

const MAX = 80
const clamp = (n) => Math.min(500, Math.max(1, Math.floor(Number(n) || 1)))

function Counter({ value, reduced }) {
  const ref = useRef(null)
  const cur = useRef({ v: value })
  useEffect(() => {
    if (reduced) { cur.current.v = value; if (ref.current) ref.current.textContent = money(value); return }
    const t = gsap.to(cur.current, { v: value, duration: 0.7, ease: 'power3.out', onUpdate: () => { if (ref.current) ref.current.textContent = money(cur.current.v) } })
    return () => t.kill()
  }, [value, reduced])
  return <span ref={ref}>{money(value)}</span>
}

/** Instant window-washing estimate: count windows, get a price range. Pre-fills the quote form. */
export default function Estimator({ id = 'estimate', className = '' }) {
  const reduced = useReducedMotion()
  const [count, setCount] = useState(20)
  const [both, setBoth] = useState(false)
  const est = useMemo(() => estimate(count, both), [count, both])
  const shown = Math.min(count, 48)
  const set = (n) => setCount(clamp(n))
  const btn = 'flex h-14 w-14 items-center justify-center rounded-full border border-silver/25 bg-white/[0.04] text-2xl font-bold text-white transition-all hover:border-royal-light hover:bg-royal active:scale-95 disabled:opacity-30'
  const seg = (on) => `min-h-[52px] flex-1 rounded-2xl border px-3 text-center text-[15px] font-bold transition-all ${on ? 'border-royal bg-royal/25 text-white shadow-[0_0_30px_-6px_rgba(0,122,255,.8)]' : 'border-silver/20 text-silver hover:border-silver/50'}`

  return (
    <section id={id} className={`relative py-24 md:py-36 ${className}`}>
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-royal-light">Instant estimate</p>
          <h2 className="font-display mt-5 max-w-3xl text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold">Count your windows.<br /><span className="serif-accent text-royal-grad">See your price.</span></h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-silver-dim">${pricing.perWindowLow}–${pricing.perWindowHigh} per window on the outside. Inside and outside is double. Slide to your number and get an instant range, with no sign-up and no obligation.</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="glass grid overflow-hidden rounded-[32px] lg:grid-cols-12">
            <div className="p-6 md:p-10 lg:col-span-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-silver">How many windows?</p>
              <div className="mt-5 flex items-center justify-between gap-4">
                <button type="button" className={btn} onClick={() => set(count - 1)} disabled={count <= 1} aria-label="One fewer window">−</button>
                <div className="text-center">
                  <label htmlFor="est-count" className="sr-only">Number of windows</label>
                  <input id="est-count" inputMode="numeric" value={count} onChange={(e) => set(e.target.value.replace(/\D/g, ''))} onFocus={(e) => e.target.select()} className="font-display w-28 bg-transparent text-center text-[clamp(3.5rem,9vw,5.5rem)] font-extrabold leading-none text-white outline-none focus-visible:underline" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-silver-dim">windows</p>
                </div>
                <button type="button" className={btn} onClick={() => set(count + 1)} aria-label="One more window">+</button>
              </div>
              <input type="range" min="1" max={MAX} value={Math.min(count, MAX)} onChange={(e) => set(e.target.value)} aria-label="Slide to set the number of windows" className="mt-8 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#007aff] [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(0,122,255,.9)]" />
              <div className="mt-4 flex flex-wrap gap-2">
                {[10, 20, 30, 40, 60].map((n) => <button key={n} type="button" onClick={() => set(n)} className={`min-h-[40px] rounded-full border px-4 text-sm font-bold transition-colors ${count === n ? 'border-royal bg-royal text-white' : 'border-silver/25 text-silver hover:border-white hover:text-white'}`}>{n}</button>)}
              </div>

              <p className="mt-9 text-[12px] font-bold uppercase tracking-[0.2em] text-silver">Which glass?</p>
              <div role="group" aria-label="Which sides of the windows" className="mt-4 flex gap-3">
                <button type="button" aria-pressed={!both} onClick={() => setBoth(false)} className={seg(!both)}>Outside only</button>
                <button type="button" aria-pressed={both} onClick={() => setBoth(true)} className={seg(both)}>Inside &amp; outside<span className="block text-[11px] font-semibold text-royal-light">2× price</span></button>
              </div>
            </div>

            <div className="relative overflow-hidden border-t border-silver/15 bg-black/30 p-6 md:p-10 lg:col-span-6 lg:border-l lg:border-t-0">
              <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-royal/30 blur-[90px]" />
              <p className="relative text-[12px] font-bold uppercase tracking-[0.2em] text-silver">Your estimate</p>
              <p className="font-display relative mt-3 text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-none tracking-[-0.05em]" aria-live="polite" aria-atomic="true">
                <span className="sr-only">{`${money(est.low)} to ${money(est.high)}`}</span>
                <span aria-hidden="true"><Counter value={est.low} reduced={reduced} /> <span className="text-silver-dim">–</span> <Counter value={est.high} reduced={reduced} /></span>
              </p>
              <p className="relative mt-3 text-sm text-silver-dim">{est.n} window{est.n === 1 ? '' : 's'} · {both ? 'inside & outside' : 'outside'} · ${pricing.perWindowLow * (both ? pricing.bothSidesMultiplier : 1)}–${pricing.perWindowHigh * (both ? pricing.bothSidesMultiplier : 1)} each</p>

              <div aria-hidden="true" className="relative mt-7 grid grid-cols-8 gap-1.5 sm:gap-2">
                {Array.from({ length: 48 }).map((_, i) => (
                  <span key={i} className="relative aspect-square rounded-[5px] border transition-all duration-500" style={{ transitionDelay: `${Math.min(i, 30) * 8}ms`, borderColor: i < shown ? 'rgba(108,178,255,.9)' : 'rgba(195,202,216,.12)', background: i < shown ? 'linear-gradient(135deg,rgba(0,122,255,.75),rgba(77,163,255,.25))' : 'transparent', boxShadow: i < shown ? '0 0 14px rgba(0,122,255,.45)' : 'none', transform: i < shown ? 'scale(1)' : 'scale(.82)' }}>
                    <span className="absolute inset-x-0 top-1/2 h-px bg-white/40" style={{ opacity: i < shown ? 1 : 0 }} />
                    <span className="absolute inset-y-0 left-1/2 w-px bg-white/40" style={{ opacity: i < shown ? 1 : 0 }} />
                  </span>
                ))}
              </div>
              {count > 48 && <p className="relative mt-2 text-xs font-semibold text-silver-dim">+{count - 48} more</p>}

              <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button to={`/contact?service=windows&windows=${est.n}&sides=${both ? 'both' : 'out'}`}>Request this quote</Button>
                <span className="text-xs text-silver-dim sm:max-w-[200px]">Free, no obligation. We confirm your exact count and price.</span>
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-silver-dim">{pricing.disclaimer} Pressure washing is quoted per job, so <a className="font-semibold text-silver underline underline-offset-4 hover:text-white" href="/contact">request a free quote</a>.</p>
        </Reveal>
      </div>
    </section>
  )
}
