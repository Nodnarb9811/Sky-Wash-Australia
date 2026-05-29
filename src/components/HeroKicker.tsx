import { useRef } from "react";
import { useHeroProgress } from "@/hooks/useHeroProgress";
import { clamp, remap } from "@/lib/easing";
import { HERO } from "@/lib/content";

/**
 * Beat 1 cold-open line. Fades in over the near-black void, then dissolves as
 * the deconstructed parts begin their assembly.
 */
export function HeroKicker() {
  const el = useRef<HTMLDivElement>(null);

  useHeroProgress((p) => {
    if (!el.current) return;
    const inFade = clamp(remap(p, 0.0, 0.025));
    const outFade = 1 - clamp(remap(p, 0.06, 0.11));
    el.current.style.opacity = `${Math.min(inFade, outFade)}`;
    el.current.style.transform = `translateY(${(1 - inFade) * 12}px)`;
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div ref={el} className="flex flex-col items-center gap-3 text-center" style={{ opacity: 0 }}>
        <span className="font-display text-kicker uppercase text-cyan/90">{HERO.kicker}</span>
        <span className="hairline w-24" aria-hidden />
      </div>
    </div>
  );
}
