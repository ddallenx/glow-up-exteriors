export default function Faq({ items }) {
  return (
    <div className="divide-y divide-silver/15 border-y border-silver/15">
      {items.map(([q, a]) => (
        <details key={q} className="group py-1">
          <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-6 py-4 text-left text-[clamp(1.05rem,2vw,1.35rem)] font-bold tracking-tight">
            {q}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-silver/25 transition-transform duration-500 group-open:rotate-45" aria-hidden="true">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 2v12M2 8h12" /></svg>
            </span>
          </summary>
          <p className="max-w-3xl pb-6 text-[16px] leading-relaxed text-silver-dim">{a}</p>
        </details>
      ))}
    </div>
  )
}
