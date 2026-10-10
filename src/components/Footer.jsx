import { nav, site } from '../config/site'
import { Logo } from './Logo'
import { TLink } from './Transition'

const digits = (s) => s.replace(/[^\d+]/g, '')

export default function Footer() {
  const socials = Object.entries(site.social).filter(([, v]) => v)
  return (
    <footer className="relative overflow-hidden bg-midnight pt-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid gap-14 border-t border-silver/15 pt-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="!h-24 md:!h-28" />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-silver-dim">{site.tagline}. Young, local and obsessed with the details.</p>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-silver-dim">Explore</h3>
            <ul className="mt-5 space-y-3">
              {nav.map((n) => (
                <li key={n.to}><TLink to={n.to} className="text-[15px] font-semibold text-silver transition-colors hover:text-white">{n.label}</TLink></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-silver-dim">Get in touch</h3>
            <ul className="mt-5 space-y-3 text-[15px] text-silver">
              <li><a className="font-semibold transition-colors hover:text-white" href={`tel:${digits(site.phone)}`}>{site.phone}</a></li>
              <li><a className="font-semibold transition-colors hover:text-white" href={`mailto:${site.email}`}>{site.email}</a></li>
              <li className="text-silver-dim">{site.hours}</li>
              {socials.length > 0 && (
                <li className="flex gap-4 pt-2">
                  {socials.map(([k, v]) => (
                    <a key={k} href={v} target="_blank" rel="noreferrer" className="capitalize underline-offset-4 hover:text-white hover:underline">{k}</a>
                  ))}
                </li>
              )}
            </ul>
          </div>
        </div>
        <div aria-hidden="true" className="font-display pointer-events-none mt-16 select-none text-center text-[clamp(3rem,15vw,15rem)] font-extrabold leading-[0.8] text-transparent" style={{ WebkitTextStroke: '1px rgba(195,202,216,0.14)' }}>
          GLOW UP
        </div>
        <div className="flex flex-col items-center justify-between gap-2 border-t border-silver/10 py-7 text-[13px] text-silver-dim md:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Free quotes · Window washing · Pressure washing</p>
        </div>
      </div>
    </footer>
  )
}
