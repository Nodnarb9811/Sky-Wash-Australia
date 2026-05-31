"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "@/lib/store";
import { PRELOADER, BRAND } from "@/lib/content";

/**
 * The preloader is part of the film — a "systems calibrating / altitude" readout
 * climbing to 100% with a reticle locking on. Fades once the scene reports
 * loaded. No spinner.
 */
export function Preloader() {
  const loaded = useExperience((s) => s.loaded);
  const [pct, setPct] = useState(6);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const id = setInterval(() => setPct((v) => (v < 92 ? v + Math.max(1, (92 - v) * 0.07) : v)), 110);
    return () => clearInterval(id);
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      setPct(100);
      const id = setTimeout(() => setDone(true), 700);
      return () => clearTimeout(id);
    }
  }, [loaded]);

  const n = Math.min(100, Math.round(pct));

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Loading the Sky Wash experience"
        >
          {/* reticle */}
          <div className="relative mb-10 h-24 w-24">
            <motion.div
              className="absolute inset-0 rounded-full border border-cyan/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            />
            <div className="absolute inset-3 rounded-full border border-cyan/50" style={{ clipPath: `inset(0 0 ${100 - n}% 0)` }} />
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan" />
            <div className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-cyan/60" />
            <div className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-cyan/60" />
            <div className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-cyan/60" />
            <div className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-cyan/60" />
          </div>

          <div className="font-display text-kicker uppercase text-cyan">{BRAND.name}</div>
          <div className="mt-4 font-sans text-sm tabular-nums text-mist">
            {n < 100 ? `${PRELOADER.label} · ${n}%` : PRELOADER.ready}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
