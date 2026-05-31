"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperience } from "@/lib/store";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* ----------------------------- reduced motion ---------------------------- */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/* --------------------------- device capability ---------------------------- */
export type Capability = "full" | "fallback" | "reduced";

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

function detect(): Capability {
  if (typeof window === "undefined") return "fallback";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  if (!hasWebGL()) return "fallback";
  const small = window.matchMedia("(max-width: 820px)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (small || (coarse && cores <= 4)) return "fallback";
  return "full";
}

export function useDeviceCapability(): Capability {
  const [cap, setCap] = useState<Capability>("fallback");
  useEffect(() => {
    setCap(detect());
    const mqs = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(max-width: 820px)"),
    ];
    const on = () => setCap(detect());
    mqs.forEach((m) => m.addEventListener("change", on));
    return () => mqs.forEach((m) => m.removeEventListener("change", on));
  }, []);
  return cap;
}

/* ----------------------------- smooth scroll ------------------------------ */
export function useSmoothScroll() {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [reduced]);
}

/* --------------------- rAF progress subscriber (DOM) ---------------------- */
/** Runs cb(progress) every frame from the store, without React re-renders. */
export function useExperienceProgress(cb: (progress: number) => void) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const { progress, inView } = useExperience.getState();
      if (inView) ref.current(progress);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
}
