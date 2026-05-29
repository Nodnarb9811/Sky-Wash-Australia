import { useEffect, useRef } from "react";
import { useHeroStore } from "@/lib/store";

/**
 * Runs `cb(progress)` on every animation frame, reading the hero scroll
 * progress imperatively from the store (no React re-renders). Used by the DOM
 * layers — wash overlay, brand reveal, kicker — to scrub in lockstep with the
 * WebGL scene. Pauses when the hero is out of view.
 */
export function useHeroProgress(cb: (progress: number) => void) {
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const { progress, inView } = useHeroStore.getState();
      if (inView) cbRef.current(progress);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
}
