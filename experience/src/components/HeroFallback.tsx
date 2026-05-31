"use client";

import { motion } from "framer-motion";
import { HERO, BRAND } from "@/lib/content";
import { EASE_CINE } from "@/lib/easing";
import { MagneticButton } from "./MagneticButton";
import { Logo } from "./Logo";

/**
 * Mobile / low-power / reduced-motion hero. No live WebGL. Uses the photoreal
 * drone still as a backdrop and (on capable-but-small devices) the pre-rendered
 * assembly clip as an autoplay loop — the same brand reveal, no jank.
 *
 * Assets are pulled by `npm run fetch:hero` into /public/hero. If absent, the
 * gradient + glow still read as an intentional brand hero.
 */
export function HeroFallback({ withVideo = false }: { withVideo?: boolean }) {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden" style={{ background: "radial-gradient(120% 90% at 50% 20%, #12303a 0%, #0e1318 45%, var(--c-void) 100%)" }}>
      {withVideo ? (
        <video className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55" src="/hero/drone-assembly.mp4" poster="/hero/drone-assembled.png" autoPlay muted loop playsInline aria-hidden="true" />
      ) : (
        <img src="/hero/drone-assembled.png" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")} />
      )}
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,13,17,0.4) 0%, rgba(10,13,17,0.85) 72%, var(--c-void) 100%)" }} />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, rgba(31,182,214,0.35), transparent 70%)" }} />

      <div className="shell relative z-10 flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: EASE_CINE }}>
          <Logo className="mb-8 h-16 w-16" />
        </motion.div>
        <motion.h1 className="font-display font-bold leading-[0.95] text-paper" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: EASE_CINE }}>
          <span className="block text-display-md">{HERO.wordmarkTop}</span>
          <span className="block text-display-md text-cyan">{HERO.wordmarkBottom}</span>
        </motion.h1>
        <motion.p className="mt-6 max-w-prose text-lead font-sans text-mist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4, ease: EASE_CINE }}>{HERO.tagline}</motion.p>
        <motion.div className="mt-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.55, ease: EASE_CINE }}>
          <MagneticButton href="#contact" aria-label="Get a quote">{HERO.cta}</MagneticButton>
        </motion.div>
        <p className="mt-8 font-sans text-xs uppercase tracking-[0.2em] text-mist/70">CASA-certified · {BRAND.region}</p>
      </div>
    </section>
  );
}
