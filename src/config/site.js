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
  tagline: 'Residential window washing & pressure washing',

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
// Swap `photo` for a path like '/team/divine.jpg' (put the file in /public/team)
export const team = [
  {
    name: 'Divine',
    age: 19,
    role: 'Co-Founder',
    focus: 'Community, service, meaning',
    photo: '',
    bio: 'Passionate about helping the community, providing exceptional service and building something meaningful. Divine co-founded Glow Up Exteriors so every neighbor could take pride in their home.',
  },
  {
    name: 'Jeremy',
    age: 20,
    role: 'Co-Founder',
    focus: 'Friendlier homes, fuller potential',
    photo: '',
    bio: 'Focused on creating a friendlier environment, improving homes and helping properties reach their full potential. Jeremy brings a hands-on eye for detail and a warm way with everyone he meets.',
  },
  {
    name: 'Colin',
    age: 21,
    role: 'Co-Founder',
    focus: 'Prestige, quality, respect',
    photo: '',
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
 * BEFORE / AFTER PHOTOS
 * Add your own job photos to /public/ba/ and list them here, e.g.
 *   { before: '/ba/window1-before.jpg', after: '/ba/window1-after.jpg', label: 'Front windows' }
 * Photos of the SAME window from the SAME angle work best. While this list is
 * empty, the site shows illustrated examples instead.
 */
export const beforeAfter = []
