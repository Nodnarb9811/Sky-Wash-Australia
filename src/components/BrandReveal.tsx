import { useRef } from "react";
import { useHeroProgress } from "@/hooks/useHeroProgress";
import { BEATS } from "@/lib/beats";
import { remap, clamp, smoothstep } from "@/lib/easing";
import { HERO } from "@/lib/content";
import { MagneticButton } from "./MagneticButton";

/**
 * Beat 5 — the bright, premium brand reveal that lives BEHIND the wash. Its
 * clip-path tracks the water sheet so it's uncovered top-down as the screen is
 * washed clean; the wordmark + tagline + CTA then resolve crisp.
 */
export function BrandReveal() {
  const layer = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);

  useHeroProgress((p) => {
    const wash = clamp(remap(p, BEATS.wash.start, BEATS.wash.end));
    const edge = smoothstep(wash); // matches WashOverlay sweep
    const reveal = clamp(remap(p, BEATS.reveal.start, 0.98));

    if (layer.current) {
      // Uncover from the top as the wash passes.
      const top = (1 - edge) * 100;
      layer.current.style.clipPath = `inset(${top}% 0 0 0)`;
      layer.current.style.opacity = edge > 0.001 ? "1" : "0";
    }
    if (content.current) {
      content.current.style.opacity = `${reveal}`;
      content.current.style.transform = `translateY(${(1 - reveal) * 28}px)`;
      content.current.style.filter = `blur(${(1 - reveal) * 6}px)`;
    }
    if (cue.current) {
      cue.current.style.opacity = `${clamp(remap(p, 0.92, 1.0))}`;
    }
  });

  return (
    <div
      ref={layer}
      className="absolute inset-0 z-30 flex items-center justify-center opacity-0"
      style={{
        clipPath: "inset(100% 0 0 0)",
        background:
          "radial-gradient(120% 120% at 50% 30%, #ffffff 0%, var(--c-paper) 55%, #dfeef3 100%)",
      }}
    >
      <div ref={content} className="shell flex flex-col items-center text-center text-void">
        <h1 className="font-display font-bold leading-[0.95] text-void">
          <span className="block text-display-lg">{HERO.wordmarkTop}</span>
          <span className="block text-display-lg text-teal">{HERO.wordmarkBottom}</span>
        </h1>
        {/* TODO: final tagline */}
        <p className="mt-6 max-w-prose text-lead font-sans text-void/70">{HERO.tagline}</p>
        <div className="mt-10">
          <MagneticButton href="#contact" aria-label="Get a quote">
            {HERO.cta}
          </MagneticButton>
        </div>
      </div>

      <div
        ref={cue}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-void/50 opacity-0"
      >
        <span className="font-display text-kicker uppercase">{HERO.scrollCue}</span>
        <span className="h-8 w-px animate-pulse bg-void/40" aria-hidden />
      </div>
    </div>
  );
}
