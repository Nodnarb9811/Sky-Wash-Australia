import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHeroStore } from "@/lib/store";

/**
 * Tasteful branded loader shown while the lazy 3D bundle + scene initialise.
 * Shows a synthetic "assembling" progress that eases toward 90%, then snaps to
 * 100% once the scene reports `ready`, and fades out.
 *
 * NOTE: deliberately does NOT import from @react-three/drei — keeping this
 * component free of the Three.js graph is what allows the 3D bundle to remain
 * fully code-split / lazy-loaded (so phones never download it).
 */
export function Loader() {
  const ready = useHeroStore((s) => s.ready);
  const [fake, setFake] = useState(8);
  const [done, setDone] = useState(false);

  // Creep toward 90% while the bundle/scene load in.
  useEffect(() => {
    if (ready) return;
    const id = setInterval(() => {
      setFake((v) => (v < 90 ? v + Math.max(1, (90 - v) * 0.08) : v));
    }, 120);
    return () => clearInterval(id);
  }, [ready]);

  useEffect(() => {
    if (ready) {
      setFake(100);
      const id = setTimeout(() => setDone(true), 650);
      return () => clearTimeout(id);
    }
  }, [ready]);

  const pct = Math.min(100, Math.round(fake));

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="absolute inset-0 z-[80] flex flex-col items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Loading the Sky Wash experience"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="font-display text-kicker uppercase text-cyan">Sky Wash Australia</div>
            <div className="h-px w-48 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ ease: "linear", duration: 0.3 }}
              />
            </div>
            <div className="font-sans text-sm tabular-nums text-mist">{pct}% · assembling</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
