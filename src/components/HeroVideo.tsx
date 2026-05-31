import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_PIN_VH, BEATS } from "@/lib/beats";
import { useHeroStore } from "@/lib/store";
import { useHeroProgress } from "@/hooks/useHeroProgress";
import { clamp, remap } from "@/lib/easing";
import { HeroKicker } from "./HeroKicker";
import { WashOverlay } from "./WashOverlay";
import { BrandReveal } from "./BrandReveal";
import { Loader } from "./Loader";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/hero/drone-assembly.mp4"; // pulled by `npm run fetch:hero`
const POSTER_SRC = "/hero/drone-assembled.png";

/**
 * Photoreal hero (full-capability path). A tall spacer scrolls past a sticky
 * stage; scroll progress (0..1) is both pushed to the shared store (driving the
 * kicker / wash / brand-reveal overlays) AND mapped onto the assembly video's
 * playhead — so scrolling scrubs the drone from exploded → fully assembled,
 * then hands off to the water-wash wipe and brand reveal.
 *
 * The clip is generated (exploded→assembled) and lives in /public/hero. If the
 * asset is missing the poster image (or the gradient base) shows gracefully and
 * the beats still play, so the page never looks broken pre-fetch.
 */
export function HeroVideo() {
  const spacer = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(6);
  const seekingRef = useRef(false);

  const setProgress = useHeroStore((s) => s.setProgress);
  const setInView = useHeroStore((s) => s.setInView);
  const setReady = useHeroStore((s) => s.setReady);

  // Pin + progress wiring (mirrors the WebGL hero).
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: spacer.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setProgress(self.progress),
    });
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.01 });
    if (stage.current) io.observe(stage.current);
    return () => {
      st.kill();
      io.disconnect();
    };
  }, [setProgress, setInView]);

  // The clip is scrubbed, never played — pause and mark ready when metadata lands.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const onMeta = () => {
      durationRef.current = v.duration || 6;
      v.pause();
      setReady(true);
    };
    const onReady = () => setReady(true);
    const onError = () => setReady(true); // don't trap the loader if the asset is absent
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("canplay", onReady);
    v.addEventListener("error", onError);
    // Safety: if there's no video at all, release the loader shortly.
    const t = setTimeout(() => setReady(true), 2500);
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("canplay", onReady);
      v.removeEventListener("error", onError);
      clearTimeout(t);
    };
  }, [setReady]);

  // Map scroll → video playhead. The assembly completes by the end of the
  // ignition beat; after that the playhead holds on the assembled frame while
  // the wash + reveal take over.
  useHeroProgress((p) => {
    const v = video.current;
    if (!v || v.readyState < 1 || seekingRef.current) return;
    const assemble = clamp(remap(p, 0, BEATS.ignition.end)); // 0..1 over 0..0.62
    const target = Math.min(assemble * durationRef.current, durationRef.current - 0.04);
    if (Math.abs(v.currentTime - target) < 0.016) return; // ~1 frame: skip churn
    seekingRef.current = true;
    const clear = () => {
      seekingRef.current = false;
      v.removeEventListener("seeked", clear);
    };
    v.addEventListener("seeked", clear);
    try {
      v.currentTime = target;
    } catch {
      seekingRef.current = false;
    }
  });

  return (
    <section id="top" ref={spacer} className="relative" style={{ height: `${HERO_PIN_VH}vh` }}>
      <div ref={stage} className="sticky top-0 h-screen w-full overflow-hidden bg-void">
        {/* Gradient base so the stage is never empty (e.g. assets not yet fetched) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 35%, #12303a 0%, #0e1318 45%, var(--c-void) 100%)",
          }}
        />
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          playsInline
          preload="auto"
          // Decorative: the assembling drone. Meaning conveyed by surrounding copy.
          aria-hidden="true"
        />

        <HeroKicker />
        <WashOverlay />
        <BrandReveal />
        <Loader />
      </div>
    </section>
  );
}
