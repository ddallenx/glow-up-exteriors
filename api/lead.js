/**
 * New-lead alerts. The quote form POSTs each request here, and this function
 * notifies the team on every channel that is switched on:
 *
 * 1. PUSH NOTIFICATIONS (ntfy, free, works now, no carrier registration)
 *    Each lead pops up on your phone's lock screen with Call / Text buttons.
 *    Vercel → Settings → Environment Variables:
 *      NTFY_TOPIC    a long secret topic name (anyone who knows it can read your leads,
 *                    so never put it in this public code; keep it in Vercel only)
 *    On each phone: install the free "ntfy" app → + → subscribe to that topic.
 *
 * 2. TEXT MESSAGES through Quo (quo.com), once US carrier registration is approved:
 *      QUO_API_KEY      Quo → Settings → API → Generate API key (Owner/Admin only)
 *      QUO_FROM         Your Quo number, e.g. +12142392420
 *      QUO_ALERT_TO     Team cell numbers to text, comma-separated
 *      QUO_AUTO_REPLY   "true" to text the customer back instantly (default off)
 *    Quo also needs prepaid API credits (about $0.01 per text).
 *
 * Channels that are not configured are skipped. The email lead (FormSubmit) is sent
 * separately by the form, so nothing is lost if this function does nothing.
 */

const QUO_URL = 'https://api.quo.com/v1/messages'

const toE164 = (s = '') => {
  const d = String(s).replace(/\D/g, '')
  if (d.length === 10) return `+1${d}`
  if (d.length === 11 && d.startsWith('1')) return `+${d}`
  return null
}

const clip = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n)

async function quoText(apiKey, from, to, content) {
  const res = await fetch(QUO_URL, {
    method: 'POST',
    headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], content }),
  })
  if (!res.ok) throw new Error(`Quo ${res.status}: ${clip(await res.text().catch(() => ''), 200)}`)
}

async function ntfyPush(server, topic, { title, message, phone }) {
  const res = await fetch(server, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic,
      title,
      message,
      priority: 5,
      tags: ['house', 'sparkles'],
      click: `tel:${phone}`,
      actions: [
        { action: 'view', label: 'Call', url: `tel:${phone}`, clear: true },
        { action: 'view', label: 'Text', url: `sms:${phone}`, clear: true },
      ],
    }),
  })
  if (!res.ok) throw new Error(`ntfy ${res.status}: ${clip(await res.text().catch(() => ''), 200)}`)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false })

  const env = process.env
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  if (body.company) return res.status(200).json({ ok: true }) // honeypot: pretend success for bots

  const name = clip(body.name, 60)
  const phone = toE164(body.phone)
  if (!name || !phone) return res.status(400).json({ ok: false, error: 'Missing name or phone' })

  const kind = clip(body.property, 20).toLowerCase() || 'website'
  const details = [
    `Phone: ${clip(body.phone, 30)}`,
    `Service: ${clip(body.service, 40)}`,
    body.windows && `Windows: ${clip(body.windows, 80)}`,
    `Area: ${clip(body.address, 80)}`,
    `When: ${clip(body.timing, 40)}`,
    body.source && `Heard via: ${clip(body.source, 40)}`,
    body.message && `Notes: ${clip(body.message, 160)}`,
  ].filter(Boolean).join('\n')

  const jobs = []

  // 1. Push notification
  if (env.NTFY_TOPIC) {
    jobs.push(ntfyPush(env.NTFY_SERVER || 'https://ntfy.sh', env.NTFY_TOPIC, {
      title: `New ${kind} lead: ${name}`,
      message: details,
      phone,
    }))
  }

  // 2. Quo texts
  const from = toE164(env.QUO_FROM)
  if (env.QUO_API_KEY && from) {
    const alert = `New ${kind} lead: ${name}\n${details}`
    const team = (env.QUO_ALERT_TO || '').split(',').map(toE164).filter(Boolean).slice(0, 5)
    team.forEach((to) => jobs.push(quoText(env.QUO_API_KEY, from, to, alert)))
    if (env.QUO_AUTO_REPLY === 'true') {
      const first = name.split(' ')[0]
      jobs.push(quoText(env.QUO_API_KEY, from, phone,
        `Hi ${first}, this is Glow Up Exteriors! We got your quote request and will text you shortly with your price. Questions? Just reply here. Reply STOP to opt out.`))
    }
  }

  if (!jobs.length) return res.status(200).json({ ok: false, skipped: 'No alert channels configured' })

  const results = await Promise.allSettled(jobs)
  const failed = results.filter((r) => r.status === 'rejected').map((r) => r.reason.message)
  if (failed.length) console.error('Lead alert failures:', failed)
  return res.status(200).json({ ok: failed.length < results.length, sent: results.length - failed.length, failed: failed.length })
}
