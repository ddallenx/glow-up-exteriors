/**
 * ─────────────────────────────────────────────────────────────
 *  GLOW UP EXTERIORS — EDIT YOUR DETAILS HERE
 *  Everything on the site that you will want to change lives in
 *  this one file: contact info, services, team, FAQs and reviews.
 *  Save, commit, push — Vercel redeploys automatically.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: 'Glow Up Exteriors',
  shortName: 'Glow Up',
  tagline: 'Residential & commercial window washing and pressure washing',

  // ── CONTACT DETAILS (placeholders — replace with your real info) ──
  phone: '(518) 816-6878',
  email: 'divineallen6@gmail.com',
  serviceArea: 'Local residential service — ask us if we cover your street',
  hours: 'Mon–Sat · 8am – 6pm',

  // Leave a social handle as '' to hide its link.
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },

  /**
   * QUOTE FORM DELIVERY
   * Option A (recommended): create a free form at https://formspree.io,
   *   paste its endpoint here (e.g. 'https://formspree.io/f/abcdwxyz').
   *   Quote requests are then emailed to you.
   * Option B: leave '' — the form opens the visitor's email app with the
   *   request pre-filled, addressed to the email above.
   */
  formEndpoint: '',

  /**
   * REVIEWS
   * Only real customer reviews should go here. While this list is empty
   * the reviews section is hidden. Format:
   *   { name: 'Customer Name', text: 'What they said.', rating: 5 }
   */
  reviews: [],
}

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/window-washing', label: 'Window Washing' },
  { to: '/pressure-washing', label: 'Pressure Washing' },
  { to: '/commercial', label: 'Commercial' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export const windowService = {
  includes: [
    'Exterior glass washed, squeegeed and detailed edge-to-edge',
    'Frames, sills and tracks wiped and cleared of debris',
    'Hard-water spot and mineral treatment on stubborn glass',
    'Screens brushed and rinsed on request',
    'Final walkthrough so you see every pane at its best',
  ],
  steps: [
    ['Protect', 'We lay down towels and shield your landscaping and sills before a drop touches the glass.'],
    ['Loosen', 'Dirt, pollen and spots are lifted with a pro-grade solution and soft scrubbers that never scratch.'],
    ['Squeegee', 'Clean, overlapping passes pull the water off in one clear sweep.'],
    ['Detail', 'Edges, frames and sills are wiped dry so nothing drips back down.'],
  ],
  faqs: [
    ['How often should my windows be cleaned?', 'Most homes look their best with a visit once or twice a year. Homes near trees, roads or water can benefit from more. We will suggest a schedule that fits.'],
    ['Do I need to be home?', 'Not for exterior cleaning. As long as we can reach the windows, we can get to work. We will message you when we arrive and when we finish.'],
    ['Will you clean the inside too?', 'Ask us when you request a quote and we will include interior glass in your estimate.'],
    ['What if it rains after you leave?', 'Rain will not undo the work — clean glass sheds water well. If you are unhappy with any pane, tell us and we will make it right.'],
  ],
}

export const commercialService = {
  sectors: [
    ['Offices & Corporate', 'A clean entrance and spotless glass set the tone before anyone walks in.'],
    ['Retail & Storefronts', 'Bright windows and clean sidewalks that invite customers inside.'],
    ['Property Managers & HOAs', 'Reliable, scheduled exterior care across one property or many.'],
    ['Restaurants & Hospitality', 'Patios, entrances and glass that match the experience you serve.'],
    ['Medical & Professional Suites', 'A polished, professional first impression for every visitor.'],
    ['Multi-Unit & Apartments', 'Walkways, entries and windows kept fresh for residents.'],
  ],
  includes: [
    'Storefront, entrance and accessible exterior glass',
    'Sidewalks, entryways, parking areas and loading zones',
    'Building exteriors, siding and walls soft-washed or pressure washed',
    'Patios, dumpster pads and high-traffic concrete',
    'One-time deep cleans or recurring scheduled service',
    'Clear communication, tidy crews and a walkthrough after every visit',
  ],
  plans: [
    ['One-time clean', 'A deep reset for a grand opening, listing, inspection or event.'],
    ['Scheduled service', 'Weekly, monthly or quarterly visits so your property always looks its best.'],
    ['Seasonal refresh', 'Spring and fall cleans that clear pollen, grime and winter buildup.'],
  ],
  steps: [
    ['Site walkthrough', 'We review your property, access and priorities, in person or by photos.'],
    ['Custom quote', 'A clear written price for your scope and schedule, with no surprises.'],
    ['Scheduled service', 'We work around your hours and keep your staff and customers undisturbed.'],
    ['Walkthrough & report', 'We check the results with you and plan the next visit.'],
  ],
  faqs: [
    ['Do you work around our business hours?', 'Yes. Tell us when you are open and we will plan the visit to stay out of the way of staff and customers.'],
    ['Can you handle multiple locations?', 'Ask us. We are happy to quote a single property or several locations with one consistent schedule.'],
    ['Do you offer recurring service?', 'Yes. Many commercial properties choose weekly, monthly or quarterly visits so they never fall behind.'],
    ['How do I get a commercial quote?', 'Use the quote form and choose Commercial. A short description or a few photos of the property is all we need to start.'],
  ],
}

export const pressureService = {
  surfaces: [
    ['Driveways', 'Oil-free, algae-free concrete that looks freshly poured.'],
    ['Patios & Walkways', 'Moss, mildew and grime lifted from pavers and joints.'],
    ['Siding & Exterior Walls', 'Gentle soft-wash technique for vinyl, stucco and painted surfaces.'],
    ['Decks & Fences', 'Weathered grey wood brought back to life, without damage.'],
    ['Garage Floors & Entries', 'The first thing guests see, finished properly.'],
    ['Stairs & Stoops', 'High-traffic spots that collect the most dirt.'],
  ],
  steps: [
    ['Assess', 'We inspect each surface to choose the right pressure and technique.'],
    ['Pre-treat', 'Safe cleaners break down algae, mildew and stains before rinsing.'],
    ['Wash', 'Controlled pressure or soft washing, matched to the material.'],
    ['Finish', 'A final rinse and walkthrough, with your property left tidy.'],
  ],
  faqs: [
    ['Will pressure washing damage my home?', 'Not when it is done correctly. We tune pressure and nozzle to the surface and use soft washing on delicate materials like siding.'],
    ['How long do results last?', 'It depends on shade, moisture and the surface, but a proper clean keeps surfaces looking good for months. We can recommend a maintenance rhythm.'],
    ['Do you need access to my water?', 'Usually yes — an outdoor spigot is all we need. Tell us if you do not have one and we will plan around it.'],
    ['Can you bundle windows and pressure washing?', 'Absolutely. Combining both is the fastest way to a full exterior glow up. Mention it in your quote request.'],
  ],
}

// Divine, Jeremy and Colin are three equal co-founders — keep all entries in the same format.
// Photos are background-removed cut-outs in /public/team. `crop` is 'bust' (waist-up) or 'full' (full body).
export const team = [
  {
    name: 'Divine',
    crop: 'bust',
    age: 19,
    role: 'Co-Founder',
    focus: 'Community, service, meaning',
    photo: '/team/divine.webp',
    bio: 'Passionate about helping the community, providing exceptional service and building something meaningful. Divine co-founded Glow Up Exteriors so every neighbor could take pride in their home.',
  },
  {
    name: 'Jeremy',
    crop: 'bust',
    age: 20,
    role: 'Co-Founder',
    focus: 'Friendlier homes, fuller potential',
    photo: '/team/jeremy.webp',
    bio: 'Focused on creating a friendlier environment, improving homes and helping properties reach their full potential. Jeremy brings a hands-on eye for detail and a warm way with everyone he meets.',
  },
  {
    name: 'Colin',
    crop: 'bust',
    age: 21,
    role: 'Co-Founder',
    focus: 'Prestige, quality, respect',
    photo: '/team/colin.webp',
    bio: 'Dedicated to providing prestigious, high-quality services and building a respected, successful business. Colin holds every job to a high standard, from the first quote to the final walkthrough.',
  },
]

/**
 * HERO VIDEO (optional)
 * Have your own footage? Put an .mp4 (under ~6 MB, 1080p, no sound needed) in /public/video/
 * and set src: '/video/hero.mp4' (and an optional poster image). The homepage hero then plays
 * your video behind the headline. Leave src empty to keep the interactive 3D house.
 */
export const heroVideo = { src: '', poster: '' }

/**
 * BEFORE / AFTER "LIVE PHOTOS"
 * Add your own media to /public/ba/ and list it here. Two options per item:
 *   Photos:  { before: '/ba/win1-before.jpg', after: '/ba/win1-after.jpg', label: 'Front windows' }
 *   Video:   { before: '/ba/win1-poster.jpg', video: '/ba/win1.mp4', label: 'Front windows' }
 *            (a short muted clip, a few seconds, shot from one spot; the poster is the dirty first frame)
 * Visitors hover (or press & hold on a phone) to play it like a Live Photo, or switch to a drag slider.
 * While this list is empty, the site shows illustrated examples instead.
 */
export const beforeAfter = [
  { before: '/ba/window1-before.webp', beforeSm: '/ba/window1-before-sm.webp', after: '/ba/window1-after.webp', afterSm: '/ba/window1-after-sm.webp', label: 'Brick-front window', aspect: 0.8 },
]

/**
 * WINDOW PRICING (used by the instant estimator)
 * Price per window outside only is low–high. Inside & outside is `bothSidesMultiplier` times that.
 */
export const pricing = {
  perWindowLow: 10,
  perWindowHigh: 12,
  bothSidesMultiplier: 2,
  disclaimer: 'Estimate for standard windows. Large, hard-to-reach or commercial storefront glass can differ. Your exact price is confirmed in your free quote.',
}
