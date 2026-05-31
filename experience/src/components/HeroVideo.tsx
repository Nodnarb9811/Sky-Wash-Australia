"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_PIN_VH, ACTS } from "@/lib/acts";
import { useExperience } from "@/lib/store";
import { useExperienceProgress } from "@/hooks/useExperienceHooks";
import { clamp, remap } from "@/lib/easing";
import { Kicker } from "./overlays/Kicker";
import { WashOverlay } from "./overlays/WashOverlay";
import { BrandReveal } from "./overlays/BrandReveal";
import { Preloader } from "./Preloader";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/hero/drone-assembly.mp4"; // pulled by `npm run fetch:hero`
const POSTER_SRC = "/hero/drone-assembled.png";

/**
 * Photoreal hero (full path). Scroll scrubs the generated drone clip's playhead
 * from 0 → fully assembled (by the start of the wash), then the water-wash wipe
 * and brand reveal take over. Same cinematic chrome as the WebGL film — kicker,
 * wash, reveal, preloader, cursor, sound — just photoreal pixels instead of a
 * primitive procedural model.
 *
 * The live WebGL "grime→flight" film still lives in src/scene/* + this folder;
 * swap <HeroVideo> back to the canvas in Hero.tsx if a real .glb is supplied.
 */
export function HeroVideo() {
  const spacer = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const duration = useRef(6);
  const seeking = useRef(false);

  const setProgress = useExperience((s) => s.setProgress);
  const setInView = useExperience((s) => s.setInView);
  const setLoaded = useExperience((s) => s.setLoaded);
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

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const onMeta = () => {
      duration.current = v.duration || 6;
      v.pause();
      setLoaded(true);
    };
    const onErr = () => setLoaded(true);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("canplay", () => setLoaded(true));
    v.addEventListener("error", onErr);
    const t = setTimeout(() => setLoaded(true), 2500);
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("error", onErr);
      clearTimeout(t);
    };
  }, [setLoaded]);

  // Scroll → playhead. Assembly completes by the start of the wash; then it
  // holds on the assembled frame while the wash + reveal play out.
  useExperienceProgress((p) => {
    const v = video.current;
    if (!v || v.readyState < 1 || seeking.current) return;
    const assemble = clamp(remap(p, 0, ACTS.wash.start));
    const target = Math.min(assemble * duration.current, duration.current - 0.04);
    if (Math.abs(v.currentTime - target) < 0.016) return;
    seeking.current = true;
    const clear = () => {
      seeking.current = false;
      v.removeEventListener("seeked", clear);
    };
    v.addEventListener("seeked", clear);
    try {
      v.currentTime = target;
    } catch {
      seeking.current = false;
    }
  });

  return (
    <section id="hero-spacer" ref={spacer} className="relative" style={{ height: `${HERO_PIN_VH}vh` }}>
      <div id="top" ref={stage} className="sticky top-0 h-[100svh] w-full overflow-hidden bg-void">
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 35%, #12303a 0%, #0e1318 45%, var(--c-void) 100%)" }} />
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <Kicker />
        <WashOverlay />
        <BrandReveal />
        <Preloader />
      </div>
    </section>
  );
}
