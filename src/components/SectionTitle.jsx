import { Headline, Reveal } from './Reveal'

export default function SectionTitle({ eyebrow, title, children, align = 'left', light = false, className = '' }) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-4xl ${className}`}>
      <Reveal><p className={`text-[11px] font-bold uppercase tracking-[0.35em] ${light ? 'text-royal' : 'text-royal-light'}`}>{eyebrow}</p></Reveal>
      <Headline as="h2" text={title} className={`font-display mt-5 text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold ${light ? 'text-navy' : 'text-white'}`} accent={light ? 'text-royal' : 'text-royal-grad'} />
      {children && <Reveal delay={0.1}><p className={`mt-6 max-w-2xl text-[17px] leading-relaxed ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-navy/65' : 'text-silver-dim'}`}>{children}</p></Reveal>}
    </div>
  )
}
