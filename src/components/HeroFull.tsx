import { Suspense, lazy, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_PIN_VH } from "@/lib/beats";
import { useHeroStore } from "@/lib/store";
import { HeroKicker } from "./HeroKicker";
import { WashOverlay } from "./WashOverlay";
import { BrandReveal } from "./BrandReveal";
import { Loader } from "./Loader";

gsap.registerPlugin(ScrollTrigger);

// Code-split the heavy Three.js bundle so it only loads if this hero is used.
const HeroScene = lazy(() => import("@/scene/HeroScene").then((m) => ({ default: m.HeroScene })));

/**
 * The ORIGINAL real-time WebGL hero (procedural, data-driven drone). No longer
 * the default — the brand moved to a photoreal generated drone (<HeroVideo>) —
 * but kept intact as a fully-working alternative. To use it, render <HeroFull>
 * instead of <HeroVideo> in Hero.tsx. The scene rig lives in src/scene/* and a
 * real .glb can still be dropped in (see README → "Swapping the drone model").
 */
export function HeroFull() {
  const spacer = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const setProgress = useHeroStore((s) => s.setProgress);
  const setInView = useHeroStore((s) => s.setInView);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: spacer.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setProgress(self.progress),
    });
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.01,
    });
    if (stage.current) io.observe(stage.current);
    return () => {
      st.kill();
      io.disconnect();
    };
  }, [setProgress, setInView]);

  return (
    <section id="top" ref={spacer} className="relative" style={{ height: `${HERO_PIN_VH}vh` }}>
      <div ref={stage} className="sticky top-0 h-screen w-full overflow-hidden bg-void">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
        <HeroKicker />
        <WashOverlay />
        <BrandReveal />
        <Loader />
      </div>
    </section>
  );
}
