import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { HeroVideo } from "./HeroVideo";
import { HeroFallback } from "./HeroFallback";

/**
 * Hero entry point.
 *
 *  - `full`     : scroll-scrubbed photoreal assembly video (<HeroVideo>).
 *  - `fallback` : small screen / low-power -> static poster hero (scrubbing
 *                 video is janky on phones).
 *  - `reduced`  : prefers-reduced-motion -> static poster, gentle fades only.
 *
 * NOTE: the original real-time WebGL hero still lives in src/scene/* and
 * src/components/HeroFull (unused) — kept as a data-driven option. The brand
 * pivoted to a photoreal generated drone, so the video hero is the default.
 */
export function Hero() {
  const cap = useDeviceCapability();
  if (cap === "full") return <HeroVideo />;
  return <HeroFallback />;
}
