import { Fragment, useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { pageState } from '../lib/scroll'
import { useReducedMotion } from '../hooks/useMedia'

/** "a *b c*." -> [[{t:'a'}], [{t:'b',em:1}], [{t:'c',em:1},{t:'.'}]]  (words made of styled segments) */
const parse = (line) => {
  const words = [[]]
  let em = false
  for (const part of line.split(/(\*|\s+)/)) {
    if (part === '*') { em = !em; continue }
    if (!part) continue
    if (/^\s+$/.test(part)) { words.push([]); continue }
    words[words.length - 1].push({ t: part, em })
  }
  return words.filter((w) => w.length)
}

const inView = (el) => el.getBoundingClientRect().top < window.innerHeight * 0.95

export function Reveal({ as: Tag = 'div', y = 40, delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useLayoutEffect(() => {
    if (reduced) return
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y, opacity: 0, duration: 1.1, ease: 'expo.out',
        delay: delay + (inView(el) ? pageState.delay : 0),
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [reduced, y, delay])
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>
}

/** Stagger the direct children of a container as they scroll in. */
export function RevealGroup({ as: Tag = 'div', stagger = 0.1, y = 40, className = '', children, ...rest }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useLayoutEffect(() => {
    if (reduced) return
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.from(el.children, {
        y, opacity: 0, duration: 1.1, ease: 'expo.out', stagger,
        delay: inView(el) ? pageState.delay : 0,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [reduced, stagger, y])
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>
}

/**
 * Masked word-by-word headline. Use "|" for line breaks and *word* for the serif accent.
 * e.g. <Headline text="Your home,|*glowing*|again." />
 */
export function Headline({ text, as: Tag = 'h1', className = '', accent = 'text-royal-grad', delay = 0 }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useLayoutEffect(() => {
    if (reduced) return
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('[data-w]'), {
        yPercent: 115, rotate: 3, duration: 1.2, ease: 'expo.out', stagger: 0.06,
        delay: delay + (inView(el) ? pageState.delay : 0),
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [reduced, text, delay])

  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\|/g, ' ').replace(/\*/g, '').replace(/\s+/g, ' ').trim()}>
      {text.split('|').map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {parse(line).map((word, wi) => (
            <Fragment key={wi}>
              <span className="inline-block overflow-hidden py-[0.08em] align-bottom" style={{ margin: '-0.08em 0' }}>
                <span data-w className="inline-block origin-left will-change-transform">
                  {word.map((seg, si) => (
                    <span key={si} className={seg.em ? `serif-accent ${accent} pr-[0.02em]` : ''}>{seg.t}</span>
                  ))}
                </span>
              </span>{' '}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  )
}

/** Paragraph whose words light up as you scroll past. */
export function ScrubText({ text, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useLayoutEffect(() => {
    if (reduced) return
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll('[data-s]'), { opacity: 0.16 }, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [reduced, text])
  return (
    <p ref={ref} className={className} aria-label={text.replace(/\*/g, '')}>
      {parse(text).map((word, i) => (
        <span key={i} data-s aria-hidden="true">
          {word.map((seg, si) => <span key={si} className={seg.em ? 'serif-accent text-royal-grad' : ''}>{seg.t}</span>)}{' '}
        </span>
      ))}
    </p>
  )
}
