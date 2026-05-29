import { motion } from "framer-motion";
import { HERO, BRAND } from "@/lib/content";
import { EASE_CINE } from "@/lib/easing";
import { MagneticButton } from "./MagneticButton";
import { Logo } from "./Logo";

/**
 * Lightweight, on-brand hero for phones / low-power devices AND reduced-motion
 * users. No live WebGL — gentle fades only, brand reveal identical to the full
 * experience.
 *
 * TODO: drop in a pre-rendered assembly→wash hero here for mobile — either a
 *   <video> poster loop or a scroll-scrubbed image sequence exported from the
 *   3D scene. Keep the wordmark/CTA below unchanged.
 */
export function HeroFallback() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 18%, #12303a 0%, #0e1318 45%, var(--c-void) 100%)",
      }}
    >
      {/* Photoreal drone backdrop (pulled by `npm run fetch:hero`). If absent,
          the gradient + glow below still read as an intentional brand hero. */}
      <img
        src="/hero/drone-assembled.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(10,13,17,0.35) 0%, rgba(10,13,17,0.85) 70%, var(--c-void) 100%)" }}
      />
      {/* Ambient aqua glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(31,182,214,0.35), transparent 70%)" }}
      />

      <div className="shell relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE_CINE }}
        >
          <Logo className="mb-8 h-16 w-16" />
        </motion.div>

        <motion.span
          className="font-display text-kicker uppercase text-cyan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE_CINE }}
        >
          {HERO.kicker}
        </motion.span>

        <motion.h1
          className="mt-5 font-display font-bold leading-[0.95] text-paper"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: EASE_CINE }}
        >
          <span className="block text-display-md">{HERO.wordmarkTop}</span>
          <span className="block text-display-md text-cyan">{HERO.wordmarkBottom}</span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-prose text-lead font-sans text-mist"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE_CINE }}
        >
          {HERO.tagline}
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65, ease: EASE_CINE }}
        >
          <MagneticButton href="#contact" aria-label="Get a quote">
            {HERO.cta}
          </MagneticButton>
        </motion.div>

        <p className="mt-8 font-sans text-xs uppercase tracking-[0.2em] text-mist/70">
          CASA-certified · {BRAND.region}
        </p>
      </div>
    </section>
  );
}
