"use client";

import { useEffect, useState } from "react";
import { useExperience } from "@/lib/store";
import { HERO } from "@/lib/content";

/**
 * Never trap the scroll. A visible "Skip intro" jumps past the pinned hero to
 * the brand reveal / content. Hides once the intro is done.
 */
export function SkipIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const unsub = useExperience.subscribe((s) => {
      // hide near the end of the pinned hero
      setVisible(s.progress < 0.8 && !s.introDone);
    });
    return unsub;
  }, []);

  const skip = () => {
    const spacer = document.getElementById("hero-spacer");
    if (!spacer) return;
    // Jump to ~84% of the hero pin — the brand reveal — then content follows.
    const top = spacer.offsetTop + spacer.offsetHeight * 0.84;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={skip}
      className="fixed bottom-6 left-6 z-[65] rounded-full border border-paper/20 bg-void/50 px-4 py-2.5 font-display text-kicker uppercase text-paper/70 backdrop-blur-md transition-colors duration-300 hover:border-cyan hover:text-cyan"
    >
      {HERO.skip}
    </button>
  );
}
