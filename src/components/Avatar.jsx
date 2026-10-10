/** Round headshot from the cut-out photo. */
export default function Avatar({ person, className = 'h-12 w-12' }) {
  return (
    <span className={`relative inline-block shrink-0 overflow-hidden rounded-full border border-royal-light/60 bg-gradient-to-b from-royal/50 to-black ${className}`}>
      {person.photo
        ? <img src={person.photo} alt="" loading="lazy" draggable="false" className="h-full w-full object-cover object-top" style={{ transform: person.crop === 'full' ? 'scale(1.5)' : 'scale(1.12)', transformOrigin: '50% 8%' }} />
        : <span className="flex h-full w-full items-center justify-center text-sm font-extrabold">{person.name[0]}</span>}
    </span>
  )
}
