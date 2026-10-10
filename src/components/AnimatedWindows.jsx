/** Grid of panes that continuously get squeegeed clean (pure CSS, GPU-friendly). */
const panes = [
  { d: 0, dur: 7 }, { d: 0.8, dur: 7 }, { d: 1.6, dur: 7 },
  { d: 2.4, dur: 7 }, { d: 3.2, dur: 7 }, { d: 4, dur: 7 },
]

export default function AnimatedWindows({ className = '' }) {
  return (
    <div className={`relative ${className}`} role="img" aria-label="Animated window panes being squeegeed clean">
      <div className="grid grid-cols-3 gap-3 rounded-[28px] border border-silver/25 bg-gradient-to-b from-[#24407f] to-[#0f2150] p-3 shadow-[0_50px_100px_-30px_rgba(63,114,255,.45)] md:gap-4 md:p-5">
        {panes.map((p, i) => (
          <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/20" style={{ '--delay': `${p.d}s`, '--dur': `${p.dur}s` }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,#a9c4ff 0%,#8eaaff 38%,#3f72ff 70%,#0f1f66 100%)' }} />
            <div className="absolute inset-0 opacity-70" style={{ background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,.55) 32%, transparent 44%, transparent 60%, rgba(255,255,255,.25) 66%, transparent 74%)' }} />
            <div className="pane-grime absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(120,124,110,.65), transparent 40%), radial-gradient(circle at 75% 70%, rgba(90,92,80,.7), transparent 45%), linear-gradient(180deg, rgba(110,112,100,.55), rgba(80,82,72,.6))', backdropFilter: 'blur(1.5px)' }} />
            <div className="pane-squeegee absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_18px_6px_rgba(255,255,255,.7)]" />
            <span className="drip absolute left-[20%] top-4 h-2 w-1 rounded-full bg-white/70" style={{ animationDelay: `${i * 0.4}s` }} />
            <span className="drip absolute left-[70%] top-2 h-2 w-1 rounded-full bg-white/70" style={{ animationDelay: `${i * 0.4 + 1.1}s` }} />
          </div>
        ))}
      </div>
    </div>
  )
}
