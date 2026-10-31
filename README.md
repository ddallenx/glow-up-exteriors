# Glow Up Exteriors

Premium marketing site for Glow Up Exteriors — residential window washing & pressure washing.

**Stack:** React 19 · Vite · Tailwind CSS 4 · Three.js · React Three Fiber · Drei · GSAP (ScrollTrigger) · Lenis smooth scroll

## Edit your details (no code knowledge needed)

Open **`src/config/site.js`**. Change the phone, email, hours, service area, social links,
services text, FAQs and team bios there. Commit and push — Vercel redeploys automatically.

- **Quote form:** requests are emailed to `leadEmail` through [FormSubmit](https://formsubmit.co) (free, no account). The first submission sends that inbox an "Activate form" email; click the link once and every lead after that arrives instantly, with name, phone, service, window estimate and how they heard about you. To use [Formspree](https://formspree.io) instead, paste its endpoint into `formEndpoint`.
- **Reviews:** only real reviews should go in `reviews`. The section stays hidden while it is empty.
- **Before/after Live Photos:** list your own photo pairs or short clips in `beforeAfter` in `site.js` (instructions are in the file). Visitors hover or press and hold to watch it wash clean.
- **Commercial services:** edit `commercialService` in `site.js`.
- **Pricing / estimator:** per-window prices live in `pricing` in `site.js` (currently $10–$12 outside, 2× for inside & outside).
- **Before/after photos:** add pairs to `beforeAfter` (see the comments). Photos of the same window from the same angle work best.
- **Hero video (optional):** drop an `.mp4` you own or have licensed into `public/video/` and set `heroVideo.src` in `site.js`. The homepage then plays it behind the headline instead of the 3D house.
- **Team photos:** drop images in `public/team/` and set `photo: '/team/divine.jpg'`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project →** import the repo. The Vite preset is auto-detected (`vercel.json` is included, with SPA rewrites).
3. Deploy. Every push to the main branch redeploys.

## Notes

- The cinematic opening (fogged window, squeegee wipe, windows swing open, fly-through) plays on the first visit of each browser session. Add `?nointro` to a URL to skip it, or press the Skip button. It is skipped automatically for reduced-motion and weak devices.

- Pages use lightweight interactive Three.js scenes (glass wall, glass droplet, 3D co-founder cards, 3D logo, per-page backdrops). Page changes use a fast transform-only curtain transition.
- Weak devices and `prefers-reduced-motion` get lightweight fallbacks (flat cards, curtain transition, no postprocessing).
- 3D scenes pause when off-screen or during page transitions, and lower resolution on slow devices.
- Respects `prefers-reduced-motion` (no smooth scroll, curtain transitions or 3D motion) and falls back to a static illustration without WebGL.
- Before/after images and the pressure-wash surfaces are illustrated; swap in real job photos when you have them.
