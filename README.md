# Sky Wash Australia — Cinematic Website

A flagship, scroll-driven marketing site for **Sky Wash Australia** — premium
drone-powered exterior cleaning on the Mornington Peninsula, Victoria.

The hero is a single pinned scroll sequence: a pressure-washing drone
**deconstructs → assembles → powers up → washes the screen clean → reveals the
brand**, driven entirely by scroll. From there the page becomes the brand
journey (what it is, why drone, the story, services, credibility, process,
contact).

> All body copy is placeholder-quality direction. Search the codebase for
> `TODO` to find everything that must be finalised before launch.

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Build / framework | **Vite + React 18 + TypeScript** |
| Styling | **Tailwind CSS v3** + CSS variables for brand tokens |
| Smooth scroll & choreography | **Lenis** + **GSAP ScrollTrigger** |
| 3D | **React Three Fiber + drei + @react-three/postprocessing** |
| 2D motion / UI | **Framer Motion** |
| State | **zustand** (shared hero scroll progress) |

**Why Vite over Next.js?** The site is essentially one long, client-heavy
cinematic page. Next's SSR adds real friction with R3F/GSAP/Lenis for little
payoff here. SEO requirements (meta, OpenGraph, **LocalBusiness JSON-LD**,
`sitemap.xml`, `robots.txt`) are handled statically in `index.html` + `public/`.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to /dist
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
```

Requires Node 18+ (developed on Node 22). Then open **http://localhost:5173**
in a desktop browser for the full 3D hero (phones / reduced-motion get the
lightweight fallback by design).

---

## Deploying (shareable public URL)

It's a static Vite build (`dist/`), so any static host works. Configs are
included for the two easiest:

**Vercel** (`vercel.json`)
1. Push this branch to GitHub (done).
2. At [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Vercel auto-detects Vite (build `npm run build`, output `dist`). Deploy.
4. You get a public `*.vercel.app` URL you can open on any device.

**Netlify** (`netlify.toml`)
1. At [netlify.com](https://app.netlify.com) → **Add new site → Import an
   existing project** → pick the repo.
2. Settings are read from `netlify.toml` (build `npm run build`, publish
   `dist`, Node 22). Deploy → public `*.netlify.app` URL.

Either way: **no env vars or secrets required.** Push to the connected branch
and the host rebuilds automatically.

---

## How the hero works

The hero is **one shared scroll-progress value (0 → 1)** sliced into 5 beats.

```
0.00–0.08  Cold open       near-black void, haze, droplet, kicker line
0.08–0.45  Assembly        ~25 exploded parts fly home, staggered & weighted
0.45–0.62  Ignition        rotors spin up, LEDs ignite cyan, craft lifts to hover
0.62–0.80  The Wash        nozzle fires; a water sheet wipes the screen clean
0.80–1.00  Brand reveal    bright wordmark + tagline + CTA resolve
```

- **`src/lib/beats.ts`** — the beat ranges and total pin length (`HERO_PIN_VH`).
  Retiming the whole film = editing this one file.
- **`src/components/Hero.tsx`** — a tall spacer scrolls past a CSS `sticky`
  stage (no GSAP pin pitfalls). One `ScrollTrigger` maps scroll → the shared
  `progress` in the zustand store (`src/lib/store.ts`).
- **`src/scene/*`** — the WebGL scene reads `progress` inside `useFrame`
  (no React re-renders). DOM layers (`WashOverlay`, `BrandReveal`, `HeroKicker`)
  read it via the `useHeroProgress` rAF hook, so everything scrubs in lockstep.

### Three render paths (accessibility & performance)

`src/hooks/useDeviceCapability.ts` chooses one:

| Capability | When | What renders |
| --- | --- | --- |
| `full` | capable desktop, WebGL, motion OK | live WebGL film (`HeroScene`, lazy-loaded) |
| `fallback` | small screen / low-power / no WebGL | `HeroFallback` (no 3D) |
| `reduced` | `prefers-reduced-motion` | `HeroFallback`, gentle fades only |

The Three.js / R3F bundle is **dynamically imported** in `Hero.tsx`, so it is
code-split into an async chunk that is **never downloaded** on the fallback or
reduced-motion paths. Framer Motion honours reduced motion globally via
`<MotionConfig reducedMotion="user">` in `src/App.tsx`.

Performance hygiene: pixel ratio capped at 2, render loop paused via
`IntersectionObserver` when the hero scrolls off screen, shared materials
disposed on unmount, ACES tone mapping, tasteful bloom/DOF/grain.

> **TODO (mobile hero):** `HeroFallback` is currently a static, on-brand hero.
> Drop in a pre-rendered assembly→wash `<video>` or scroll-scrubbed image
> sequence (exported from the 3D scene) where marked in
> `src/components/HeroFallback.tsx`.

---

## Swapping in a real drone model (`.glb`)

The drone is **procedural and fully data-driven** today, but the rig was built
so a real model drops in without rewriting any choreography.

**All part transforms live in `src/lib/droneParts.ts`.** Each part is described
as data:

```ts
{
  id: "motor-fr",
  kind: "motor",
  assembled: { position: [x, y, z], rotation?, scale? }, // final resting pose
  exploded:  { position, rotation },                      // scattered start pose
  assembleAt: [0.22, 0.46],   // when (within the assembly beat) it flies home
}
```

To use a real `.glb`:

1. Load it (`useGLTF`) and traverse named meshes.
2. Map each mesh name → a `PartSpec` in `droneParts.ts` (reuse the mesh's
   authored transform as `assembled`; derive `exploded` via the `explode()`
   helper along its outward vector).
3. In **`src/scene/DronePart.tsx`**, render the loaded GLTF mesh (keyed by
   `spec.id`) instead of the primitive in the `kind` switch.

**Nothing in the scroll logic changes** — `DronePart` animates between
`exploded` and `assembled` purely from `assembleAt` + the master progress.
The jet origin/direction (`NOZZLE_TIP`, `NOZZLE_DIR`) also live in
`droneParts.ts`.

---

## Editing copy & brand tokens

- **Copy:** all marketing text is in **`src/lib/content.ts`** (one file).
  `// TODO` markers flag founder copy, contact details, ABN, socials, tagline.
- **Brand palette & fonts:** the single source of truth is the `:root` block in
  **`src/styles/globals.css`** (CSS variables). Tailwind utilities
  (`text-cyan`, `bg-void`, `font-display`, …) map to them in
  `tailwind.config.ts`. The type scale also lives in `tailwind.config.ts`.
- **Fonts:** loaded in `index.html` (Space Grotesk + Inter). Swap to a licensed
  Clash Display / Neue Montreal pairing there + update `--font-display`.
- **SEO:** meta, OpenGraph and `LocalBusiness` JSON-LD are in `index.html`;
  `public/sitemap.xml` and `public/robots.txt` round it out. Replace the
  `og-image.jpg` (1200×630) — currently a `TODO`.

---

## Project structure

```
src/
  components/   Nav, Hero, HeroFallback, BrandReveal, WashOverlay, Loader,
                MagneticButton, Reveal, Kicker, Logo, Footer, GrainOverlay
  scene/        HeroScene (Canvas), Drone, DronePart, CameraRig, WaterJet,
                Lighting, Effects, Atmosphere   (the WebGL film)
  sections/     WhatItIs, WhyDrone, Story, Services, WhyUs, Process, Contact
  hooks/        useSmoothScroll, useDeviceCapability, usePrefersReducedMotion,
                useHeroProgress
  lib/          beats, droneParts, content, store, easing
  styles/       globals.css  (brand tokens)
```

---

## Accessibility

Semantic landmarks, skip-link, keyboard-navigable nav + CTAs, visible focus
rings, labelled form fields, AA-contrast text on the dark and bright surfaces,
and full `prefers-reduced-motion` support (static hero, fades only, no smooth
scroll, grain disabled).
