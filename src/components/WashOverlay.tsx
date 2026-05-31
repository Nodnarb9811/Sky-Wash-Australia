import { useRef } from "react";
import { useHeroProgress } from "@/hooks/useHeroProgress";
import { BEATS } from "@/lib/beats";
import { remap, clamp, smoothstep } from "@/lib/easing";

/**
 * The water-sheet wipe (beat 4). As the nozzle fires (0.62–0.80) a sheet of
 * water + droplet spatter sweeps down the viewport. Its leading edge is the
 * reveal boundary that <BrandReveal> clips to, so the dark scene is literally
 * "washed away". Driven imperatively by scroll progress — no re-renders.
 */
export function WashOverlay() {
  const sheet = useRef<HTMLDivElement>(null);
  const spatter = useRef<HTMLDivElement>(null);

  useHeroProgress((p) => {
    const w = clamp(remap(p, BEATS.wash.start, BEATS.wash.end));
    const edge = smoothstep(w); // 0 -> 1 sweep down the screen

    if (sheet.current) {
      // The translucent water band rides just ahead of the reveal edge.
      const y = edge * 130 - 30; // travels from top, off the bottom
      sheet.current.style.transform = `translate3d(0, ${y}vh, 0)`;
      // Visible only during the wash window.
      sheet.current.style.opacity = `${Math.sin(w * Math.PI)}`;
    }
    if (spatter.current) {
      // Lens spatter blooms mid-wash then clears.
      spatter.current.style.opacity = `${Math.sin(w * Math.PI) * 0.55}`;
    }
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      {/* Travelling water sheet */}
      <div
        ref={sheet}
        className="absolute inset-x-0 top-0 h-[60vh] opacity-0 will-change-transform"
        style={{
          background:
            "linear-gradient(to bottom, rgba(127,220,239,0) 0%, rgba(127,220,239,0.18) 40%, rgba(255,255,255,0.55) 72%, rgba(31,182,214,0.35) 88%, rgba(10,13,17,0) 100%)",
          filter: "blur(2px)",
          backdropFilter: "blur(3px)",
        }}
      />
      {/* Droplet / lens spatter */}
      <div
        ref={spatter}
        className="absolute inset-0 opacity-0 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.5) 0 2px, transparent 3px), radial-gradient(circle at 70% 20%, rgba(191,238,251,0.5) 0 3px, transparent 4px), radial-gradient(circle at 45% 65%, rgba(255,255,255,0.4) 0 2px, transparent 3px), radial-gradient(circle at 85% 75%, rgba(191,238,251,0.4) 0 4px, transparent 5px), radial-gradient(circle at 12% 80%, rgba(255,255,255,0.4) 0 2px, transparent 3px), radial-gradient(circle at 60% 45%, rgba(255,255,255,0.35) 0 3px, transparent 4px)",
          backgroundSize: "100% 100%",
        }}
      />
    </div>
  );
}
