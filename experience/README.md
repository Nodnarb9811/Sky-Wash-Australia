# Sky Wash Australia — "From Grime, Flight"

An award-tier, cinematic, scroll-driven 3D experience for **Sky Wash Australia**.
The whole page is one vertical journey **earth → sky**: the visitor begins
trapped in grime and climbs into clarity. The drone is **forged from the grime
it destroys**, ignites, launches up through the murk, fires a jet that **washes
the whole world clean** (the colour grade flips MURK → CLARITY in its wake), and
settles to a hero hover as the brand resolves.

> Separate, parallel build. The original Vite site at the repo root is untouched.
> All body copy is direction — search `TODO` for everything to finalise.

---

## Run locally

```bash
cd experience
npm install
npm run fetch:hero   # downloads the photoreal fallback assets into public/hero
npm run dev          # http://localhost:3000  (desktop browser for the full film)
```

Node 18+ (developed on Node 22). On a phone, or with OS "reduce motion" on, you
get the lightweight fallback hero by design.

---

## Deploy (so you can see it on any device)

It's a standard **Next.js 14** app. **Vercel** is the smoothest:

1. [vercel.com](https://vercel.com) → **Add New → Project** → import this repo.
2. **⚠️ Set "Root Directory" to `experience`.** This is the one essential step —
   the repo root is the older Vite site, so without this Vercel builds the wrong
   project.
3. Framework preset auto-detects **Next.js**. Build `npm run build`, output
   handled automatically. Deploy → public `*.vercel.app` URL.

- No env vars or secrets required.
- The fallback drone assets are fetched at build by the `prebuild` step
  (`npm run fetch:hero`, non-blocking — if a CDN link has expired the build
  still succeeds and the live desktop hero is unaffected).

> **Netlify** also works but needs `@netlify/plugin-nextjs`; Vercel is the
> recommended host for Next.js.

---

## The hero film — where everything lives

One pinned scroll (`HERO_PIN_VH`), master progress `0→1` sliced into 5 acts.

| Progress | Act | What |
| --- | --- | --- |
| 0.00–0.15 | **Ground** | macro grime surface, cold open, kicker |
| 0.15–0.45 | **Forging** | grime particles condense into the drone |
| 0.45–0.65 | **Ascent** | ignition, rotors, camera launches up the spline |
| 0.65–0.80 | **Wash** | jet at the lens; world re-grades murk→clarity |
| 0.80–1.00 | **Altitude** | clarity, hover, kinetic brand reveal |

**Tune the film by editing these files:**

- `src/lib/acts.ts` — act ranges, pin length, the murk→clarity `mood` curve.
- `src/scene/CameraRig.tsx` — the ascent spline waypoints.
- `src/scene/Drone.tsx` — drone look, dissolve-in, rotor/ignition timing.
- `src/lib/droneParts.ts` — **data-driven** part transforms + forge target cloud.
  Swap in a real `.glb` here without touching choreography.
- `src/scene/ForgeField.tsx` — the grime→machine particle condensation.
- `src/scene/Effects.tsx` — postprocessing + the animated colour grade.
- `src/scene/Atmosphere.tsx` / `Lighting.tsx` — two-world fog + light.

## Other systems

- **Scroll/state** — `hooks/useExperienceHooks.ts` (Lenis + GSAP) writes a shared
  zustand `progress` (`lib/store.ts`); R3F reads it in `useFrame` (no re-renders),
  DOM layers via `useExperienceProgress`.
- **Sound** — `lib/audio.ts` (Howler). Starts muted; mute toggle invites it in.
  Layers no-op until you add files to `public/audio/`
  (`hum.mp3`, `whoosh.mp3`, `wash-hit.mp3`, `clarity-pad.mp3`, `tick.mp3`).
- **Cursor / Preloader / Skip intro** — `components/Cursor.tsx`,
  `Preloader.tsx`, `SkipIntro.tsx`.
- **Copy** — all text in `src/lib/content.ts`.
- **Brand tokens & fonts** — `app/globals.css` `:root` (single source of truth);
  fonts are linked in `app/layout.tsx`.
- **Fallback assets** — `scripts/hero-assets.json` + `npm run fetch:hero`.

## Render paths

`hooks/useExperienceHooks.ts → useDeviceCapability`:

- `full` (capable desktop) — the live WebGL film.
- `fallback` (small screen / low-power) — `HeroFallback` with the pre-rendered
  assembly clip looping.
- `reduced` (`prefers-reduced-motion`) — `HeroFallback`, static, fades only.

The heavy Three.js bundle is `dynamic(ssr:false)` in `components/Hero.tsx`, so it
loads only on the full path and never on the server.

## Still TODO (next milestones)

Real audio assets · a true screen-space water-refraction shader (currently a
strong DOM wipe + particle jet) · an authored `.cube` LUT (currently an animated
grade) · the drone visiting each section via scripted camera waypoints · final
copy, contact details, ABN, OG image.
