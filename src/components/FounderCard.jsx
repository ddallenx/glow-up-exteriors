import Tilt from './Tilt'

/** Equal-size co-founder poster card. The cut-out pops above the frame for depth. */
export default function FounderCard({ p, compact = false, className = '' }) {
  const h = compact ? 'h-[330px]' : 'h-[430px]'
  return (
    <Tilt as="article" max={7} className={`group relative mt-14 rounded-[32px] ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[32px] border border-silver/15 bg-gradient-to-b from-ink via-navy to-black">
        <div className="absolute -top-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-royal/45 blur-[80px] transition-transform duration-700 group-hover:scale-125" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(160,200,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(160,200,255,1) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      </div>
      <div className="relative z-10">
        <div className={`relative -mt-14 ${h} [transform:translateZ(60px)]`}>
          {p.photo ? (
            <img src={p.photo} alt={`${p.name}, ${p.role}, age ${p.age}`} loading="lazy" draggable="false"
              className={`absolute bottom-0 left-1/2 ${p.crop === 'full' ? 'h-[118%]' : 'h-full'} max-w-full -translate-x-1/2 object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,.6)] ${p.crop === 'bust' ? '[mask-image:linear-gradient(to_bottom,#000_84%,transparent)]' : ''}`} />
          ) : (
            <span aria-hidden="true" className="serif-accent absolute inset-0 flex items-center justify-center text-[10rem] text-silver-grad">{p.name[0]}</span>
          )}
          {p.age && <span className="absolute right-4 top-14 flex h-16 w-16 flex-col items-center justify-center rounded-full border border-royal-light/70 bg-black/60 backdrop-blur"><span className="text-xl font-extrabold leading-none">{p.age}</span><span className="mt-0.5 text-[8px] font-bold tracking-[0.2em] text-royal-light">YEARS</span></span>}
        </div>
        <div className="px-7 pb-8 pt-2 [transform:translateZ(30px)]">
          <h3 className="font-display text-4xl font-extrabold">{p.name}</h3>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-royal-light">{p.role}{p.age ? ` · Age ${p.age}` : ''}</p>
          {!compact && <><p className="serif-accent mt-4 text-2xl leading-snug text-silver-grad">{p.focus}</p><p className="mt-4 text-[15px] leading-relaxed text-silver-dim">{p.bio}</p></>}
        </div>
      </div>
    </Tilt>
  )
}
