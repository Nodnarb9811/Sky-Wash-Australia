"use client";

import { useRef } from "react";
import { useExperienceProgress } from "@/hooks/useExperienceHooks";
import { ACTS } from "@/lib/acts";
import { remap, clamp, smoothstep } from "@/lib/easing";

/**
 * THE WASH (Act IV) — the moment. A full sheet of high-pressure water sweeps the
 * viewport: a travelling water band + clinging droplets/lens spatter. As it
 * passes, the world is left clean (the scene's mood grade flips murk→clarity in
 * its wake). Driven imperatively by scroll — no re-renders.
 */
export function WashOverlay() {
  const sheet = useRef<HTMLDivElement>(null);
  const spatter = useRef<HTMLDivElement>(null);

  useExperienceProgress((p) => {
    const w = clamp(remap(p, ACTS.wash.start, ACTS.wash.end));
    const edge = smoothstep(w);
    if (sheet.current) {
      sheet.current.style.transform = `translate3d(0, ${edge * 130 - 30}vh, 0)`;
      sheet.current.style.opacity = `${Math.sin(w * Math.PI)}`;
    }
    if (spatter.current) spatter.current.style.opacity = `${Math.sin(w * Math.PI) * 0.6}`;
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      <div
        ref={sheet}
        className="absolute inset-x-0 top-0 h-[65vh] opacity-0 will-change-transform"
        style={{
          background:
            "linear-gradient(to bottom, rgba(127,220,239,0) 0%, rgba(127,220,239,0.2) 38%, rgba(255,255,255,0.6) 70%, rgba(31,182,214,0.4) 88%, rgba(255,255,255,0) 100%)",
          filter: "blur(2px)",
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        ref={spatter}
        className="absolute inset-0 opacity-0 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.55) 0 2px, transparent 3px), radial-gradient(circle at 70% 20%, rgba(191,238,251,0.55) 0 3px, transparent 4px), radial-gradient(circle at 45% 62%, rgba(255,255,255,0.45) 0 2px, transparent 3px), radial-gradient(circle at 85% 72%, rgba(191,238,251,0.45) 0 4px, transparent 5px), radial-gradient(circle at 12% 78%, rgba(255,255,255,0.45) 0 2px, transparent 3px), radial-gradient(circle at 60% 44%, rgba(255,255,255,0.4) 0 3px, transparent 4px)",
        }}
      />
    </div>
  );
}
