"use client";

import { useDeviceCapability } from "@/hooks/useExperienceHooks";
import { HeroVideo } from "./HeroVideo";
import { HeroFallback } from "./HeroFallback";

/**
 * Hero entry point.
 *
 *  - `full`     : scroll-scrubbed PHOTOREAL assembly video (<HeroVideo>) with
 *                 the full cinematic chrome (kicker → wash → brand reveal).
 *  - `fallback` : small screen / low-power → poster + looping clip.
 *  - `reduced`  : prefers-reduced-motion → static poster, gentle fades.
 *
 * NOTE: the live WebGL "grime→flight" film still lives in src/scene/* and
 * src/components/HeroCanvas — render the canvas instead of <HeroVideo> here if a
 * real .glb drone model is supplied. The brand chose the photoreal video over a
 * primitive procedural model, so the video is the default.
 */
export function Hero() {
  const cap = useDeviceCapability();
  if (cap === "full") return <HeroVideo />;
  return <HeroFallback withVideo={cap === "fallback"} />;
}
