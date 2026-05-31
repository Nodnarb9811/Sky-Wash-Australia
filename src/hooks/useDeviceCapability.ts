import { useEffect, useState } from "react";

export type Capability = "full" | "fallback" | "reduced";

/**
 * Decides which hero experience to render:
 *   - "reduced"  : user prefers reduced motion -> static, gentle fades only.
 *   - "fallback" : small screen / low-power / no-WebGL -> pre-rendered hero
 *                  (image/video) instead of live 3D.
 *   - "full"     : the live, scroll-driven WebGL film.
 *
 * Heuristic uses viewport width, devicePixelRatio, hardwareConcurrency and a
 * WebGL capability probe — mirroring the perf guidance in the 3d-web-experience
 * skill (don't ship heavy WebGL to phones).
 */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function detect(): Capability {
  if (typeof window === "undefined") return "full";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return "reduced";

  if (!hasWebGL()) return "fallback";

  const smallScreen = window.matchMedia("(max-width: 820px)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const lowPower = cores <= 4;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  // Phones / tablets and clearly low-power devices get the lightweight hero.
  if (smallScreen || (isCoarse && lowPower)) return "fallback";

  return "full";
}

export function useDeviceCapability(): Capability {
  // Default to "fallback" on first paint so we never flash heavy 3D before
  // we've measured; upgrade to "full" after mount if the device qualifies.
  const [cap, setCap] = useState<Capability>("fallback");

  useEffect(() => {
    setCap(detect());

    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqSize = window.matchMedia("(max-width: 820px)");
    const onChange = () => setCap(detect());

    mqReduced.addEventListener("change", onChange);
    mqSize.addEventListener("change", onChange);
    return () => {
      mqReduced.removeEventListener("change", onChange);
      mqSize.removeEventListener("change", onChange);
    };
  }, []);

  return cap;
}
