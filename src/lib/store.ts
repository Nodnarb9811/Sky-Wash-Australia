import { create } from "zustand";

/**
 * Shared hero scroll state. GSAP ScrollTrigger writes `progress` (0..1) on
 * scrub; R3F reads it inside useFrame WITHOUT subscribing to re-renders by
 * calling `useHeroStore.getState().progress` each frame. The `inView` flag
 * lets us pause the WebGL render loop when the hero scrolls off screen.
 */
interface HeroState {
  progress: number;
  inView: boolean;
  ready: boolean; // 3D assets loaded
  setProgress: (p: number) => void;
  setInView: (v: boolean) => void;
  setReady: (v: boolean) => void;
}

export const useHeroStore = create<HeroState>((set) => ({
  progress: 0,
  inView: true,
  ready: false,
  setProgress: (progress) => set({ progress }),
  setInView: (inView) => set({ inView }),
  setReady: (ready) => set({ ready }),
}));
