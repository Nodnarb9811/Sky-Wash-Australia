"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_PIN_VH } from "@/lib/acts";
import { useExperience } from "@/lib/store";
import { useDeviceCapability } from "@/hooks/useExperienceHooks";
import { Kicker } from "./overlays/Kicker";
import { WashOverlay } from "./overlays/WashOverlay";
import { BrandReveal } from "./overlays/BrandReveal";
import { Preloader } from "./Preloader";
import { HeroFallback } from "./HeroFallback";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// The heavy WebGL bundle loads only on the full path, client-side only.
const HeroCanvas = dynamic(() => import("@/scene/HeroCanvas").then((m) => m.HeroCanvas), { ssr: false });

function HeroFull() {
  const spacer = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const setProgress = useExperience((s) => s.setProgress);
  const setInView = useExperience((s) => s.setInView);
  const setIntroDone = useExperience((s) => s.setIntroDone);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: spacer.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setProgress(self.progress);
        setIntroDone(self.progress > 0.999);
      },
    });
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.01 });
    if (stage.current) io.observe(stage.current);
    return () => {
      st.kill();
      io.disconnect();
    };
  }, [setProgress, setInView, setIntroDone]);

  return (
    <section id="hero-spacer" ref={spacer} className="relative" style={{ height: `${HERO_PIN_VH}vh` }}>
      <div id="top" ref={stage} className="sticky top-0 h-[100svh] w-full overflow-hidden bg-void">
        <HeroCanvas />
        <Kicker />
        <WashOverlay />
        <BrandReveal />
        <Preloader />
      </div>
    </section>
  );
}

export function Hero() {
  const cap = useDeviceCapability();
  if (cap === "full") return <HeroFull />;
  return <HeroFallback withVideo={cap === "fallback"} />;
}
