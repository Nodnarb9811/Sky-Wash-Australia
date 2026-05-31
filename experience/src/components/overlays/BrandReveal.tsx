"use client";

import { useRef } from "react";
import { useExperienceProgress } from "@/hooks/useExperienceHooks";
import { ACTS } from "@/lib/acts";
import { remap, clamp } from "@/lib/easing";
import { HERO } from "@/lib/content";
import { MagneticButton } from "../MagneticButton";

/**
 * Act V — ALTITUDE. Over the clarity grade, the wordmark resolves in clean
 * kinetic type with tagline + CTA and a soft scroll cue. Type settles from a
 * slight blur/rise as the master progress completes.
 */
export function BrandReveal() {
  const wrap = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);

  useExperienceProgress((p) => {
    const reveal = clamp(remap(p, ACTS.altitude.start, 0.96));
    if (wrap.current) wrap.current.style.opacity = `${clamp(remap(p, ACTS.wash.start + 0.05, ACTS.altitude.start))}`;
    if (content.current) {
      content.current.style.opacity = `${reveal}`;
      content.current.style.transform = `translateY(${(1 - reveal) * 30}px)`;
      content.current.style.filter = `blur(${(1 - reveal) * 7}px)`;
    }
    if (cue.current) cue.current.style.opacity = `${clamp(remap(p, 0.93, 1))}`;
  });

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center opacity-0">
      {/* scrim for AA contrast over the bright clarity sky */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
      <div ref={content} className="shell pointer-events-auto relative flex flex-col items-center text-center">
        <h1 className="font-display font-bold leading-[0.95] text-paper [text-shadow:0_4px_40px_rgba(0,0,0,0.45)]">
          <span className="block text-display-lg">{HERO.wordmarkTop}</span>
          <span className="block text-display-lg text-cyan-soft">{HERO.wordmarkBottom}</span>
        </h1>
        {/* TODO: final tagline */}
        <p className="mt-6 max-w-prose text-lead font-sans text-paper/85">{HERO.tagline}</p>
        <div className="mt-10">
          <MagneticButton href="#contact" aria-label="Get a quote">
            {HERO.cta}
          </MagneticButton>
        </div>
      </div>
      <div ref={cue} className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-paper/60 opacity-0">
        <span className="font-display text-kicker uppercase">{HERO.scrollCue}</span>
        <span className="h-8 w-px animate-pulse bg-paper/40" aria-hidden />
      </div>
    </div>
  );
}
