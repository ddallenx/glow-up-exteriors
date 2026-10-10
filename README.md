# Glow Up Exteriors

Premium marketing site for Glow Up Exteriors — residential window washing & pressure washing.

**Stack:** React 19 · Vite · Tailwind CSS 4 · Three.js · React Three Fiber · Drei · GSAP (ScrollTrigger) · Lenis smooth scroll

## Edit your details (no code knowledge needed)

Open **`src/config/site.js`**. Change the phone, email, hours, service area, social links,
services text, FAQs and team bios there. Commit and push — Vercel redeploys automatically.

- **Quote form:** paste a free [Formspree](https://formspree.io) endpoint into `formEndpoint` so requests arrive in your inbox. Left blank, the form opens the visitor's email app with the request pre-filled.
- **Reviews:** only real reviews should go in `reviews`. The section stays hidden while it is empty.
- **Before/after Live Photos:** list your own photo pairs or short clips in `beforeAfter` in `site.js` (instructions are in the file). Visitors hover or press and hold to watch it wash clean.
- **Commercial services:** edit `commercialService` in `site.js`.
- **Hero video (optional):** drop an `.mp4` you own or have licensed into `public/video/` and set `heroVideo.src` in `site.js`. The homepage then plays it behind the headline instead of the 3D house.
- **Team photos:** drop images in `public/team/` and set `photo: '/team/divine.jpg'`.
- **Contact placeholders:** the phone number and email currently in the file are placeholders — replace them before launch.

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

- Every page has its own interactive Three.js / React Three Fiber scene (house, glass wall, pressure-wash slab, 3D co-founder cards, glass droplet) plus a 3D fly-through page transition.
- Weak devices and `prefers-reduced-motion` get lightweight fallbacks (flat cards, curtain transition, no postprocessing).
- The 3D house is built from simple geometry (no model downloads), lazy-loaded, pauses when off-screen and lowers resolution on slow devices.
- Respects `prefers-reduced-motion` (no smooth scroll, curtain transitions or 3D motion) and falls back to a static illustration without WebGL.
- Before/after images and the pressure-wash surfaces are illustrated; swap in real job photos when you have them.
