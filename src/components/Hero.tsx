import { Suspense, lazy, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_PIN_VH } from "@/lib/beats";
import { useHeroStore } from "@/lib/store";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { HeroKicker } from "./HeroKicker";
import { WashOverlay } from "./WashOverlay";
import { BrandReveal } from "./BrandReveal";
import { HeroFallback } from "./HeroFallback";
import { Loader } from "./Loader";

gsap.registerPlugin(ScrollTrigger);

// Code-split the heavy Three.js bundle so the rest of the site is interactive fast.
const HeroScene = lazy(() => import("@/scene/HeroScene").then((m) => ({ default: m.HeroScene })));

/**
 * The full, scroll-driven hero. A tall spacer scrolls past a `sticky` stage
 * (CSS handles the pin — no GSAP pin pitfalls); a single ScrollTrigger maps the
 * spacer's scroll into the shared 0..1 progress that drives the WebGL scene and
 * all DOM layers in lockstep.
 */
function HeroFull() {
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

    // Pause the render loop when the pinned stage leaves the viewport.
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.01 }
    );
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

export function Hero() {
  const cap = useDeviceCapability();
  // Both the small-screen/low-power fallback and reduced-motion users get the
  // graceful static hero. Only capable desktops run the live WebGL film.
  if (cap === "full") return <HeroFull />;
  return <HeroFallback />;
}
