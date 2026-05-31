"use client";

import { useRef } from "react";
import { useExperienceProgress } from "@/hooks/useExperienceHooks";
import { clamp, remap } from "@/lib/easing";
import { HERO } from "@/lib/content";

/** Act I cold-open line, rising over the grime then dissolving into the forging. */
export function Kicker() {
  const el = useRef<HTMLDivElement>(null);
  useExperienceProgress((p) => {
    if (!el.current) return;
    const inFade = clamp(remap(p, 0.01, 0.04));
    const outFade = 1 - clamp(remap(p, 0.1, 0.15));
    el.current.style.opacity = `${Math.min(inFade, outFade)}`;
    el.current.style.transform = `translateY(${(1 - inFade) * 16}px)`;
  });
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center pb-[18vh]">
      <div ref={el} className="flex flex-col items-center gap-4 px-6 text-center" style={{ opacity: 0 }}>
        {/* TODO: final copy */}
        <span className="font-display text-display-sm font-medium text-paper/90 [text-shadow:0_2px_24px_rgba(0,0,0,0.7)]">
          {HERO.kicker}
        </span>
        <span className="hairline w-28" aria-hidden />
      </div>
    </div>
  );
}
