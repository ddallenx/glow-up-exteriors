/**
 * New-lead text alerts through Quo (quo.com, formerly OpenPhone).
 *
 * The quote form POSTs each request here. This function sends texts FROM your
 * Quo business number:
 *   1. An alert to each team phone in QUO_ALERT_TO ("New lead: name, phone, service…").
 *   2. (optional) An instant "got your request" text to the customer, so the
 *      conversation starts in your Quo inbox and replies notify the whole team.
 *
 * Set these in Vercel → Project → Settings → Environment Variables, then redeploy:
 *   QUO_API_KEY      Quo → Settings → API → Generate API key (Owner/Admin only)
 *   QUO_FROM         Your Quo number, e.g. +12142392420
 *   QUO_ALERT_TO     Team cell numbers to alert, comma-separated, e.g. +12145550101,+14695550102
 *   QUO_AUTO_REPLY   "true" to text the customer back instantly (default off)
 *
 * Quo requires US carrier registration and prepaid API credits (about $0.01 per text).
 * If the variables are missing, this function does nothing and the email lead still arrives.
 */

const QUO_URL = 'https://api.quo.com/v1/messages'

const toE164 = (s = '') => {
  const d = String(s).replace(/\D/g, '')
  if (d.length === 10) return `+1${d}`
  if (d.length === 11 && d.startsWith('1')) return `+${d}`
  return null
}

const clip = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n)

async function sendText(apiKey, from, to, content) {
  const res = await fetch(QUO_URL, {
    method: 'POST',
    headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], content }),
  })
  if (!res.ok) throw new Error(`Quo ${res.status}: ${clip(await res.text().catch(() => ''), 200)}`)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false })

  const { QUO_API_KEY, QUO_FROM, QUO_ALERT_TO = '', QUO_AUTO_REPLY } = process.env
  const from = toE164(QUO_FROM)
  if (!QUO_API_KEY || !from) return res.status(200).json({ ok: false, skipped: 'Quo not configured' })

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  if (body.company) return res.status(200).json({ ok: true }) // honeypot: pretend success for bots

  const name = clip(body.name, 60)
  const phone = toE164(body.phone)
  if (!name || !phone) return res.status(400).json({ ok: false, error: 'Missing name or phone' })

  const alert = [
    `New ${clip(body.property, 20).toLowerCase() || 'website'} lead: ${name}`,
    `Phone: ${clip(body.phone, 30)}`,
    `Service: ${clip(body.service, 40)}`,
    body.windows && `Windows: ${clip(body.windows, 80)}`,
    `Area: ${clip(body.address, 80)}`,
    `When: ${clip(body.timing, 40)}`,
    body.source && `Heard via: ${clip(body.source, 40)}`,
    body.message && `Notes: ${clip(body.message, 160)}`,
  ].filter(Boolean).join('\n')

  const team = QUO_ALERT_TO.split(',').map(toE164).filter(Boolean).slice(0, 5)
  const jobs = team.map((to) => sendText(QUO_API_KEY, from, to, alert))

  if (QUO_AUTO_REPLY === 'true') {
    const first = name.split(' ')[0]
    jobs.push(sendText(QUO_API_KEY, from, phone,
      `Hi ${first}, this is Glow Up Exteriors! We got your quote request and will text you shortly with your price. Questions? Just reply here. Reply STOP to opt out.`))
  }

  const results = await Promise.allSettled(jobs)
  const failed = results.filter((r) => r.status === 'rejected').map((r) => r.reason.message)
  if (failed.length) console.error('Quo send failures:', failed)
  return res.status(200).json({ ok: failed.length < results.length && results.length > 0, sent: results.length - failed.length, failed: failed.length })
}
