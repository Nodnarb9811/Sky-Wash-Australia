import { create } from "zustand";

/**
 * Shared experience state. GSAP ScrollTrigger writes `progress`; R3F reads it
 * inside useFrame via getState() (no React re-renders). `mood` is derived murk→
 * clarity. Sound + preloader + skip live here too.
 */
interface ExperienceState {
  progress: number; // 0..1 master hero scroll progress
  inView: boolean; // hero stage on screen (pause canvas when false)
  loaded: boolean; // assets/scene ready
  introDone: boolean; // pinned hero passed (or skipped)
  muted: boolean; // sound (starts muted per autoplay policy)
  setProgress: (p: number) => void;
  setInView: (v: boolean) => void;
  setLoaded: (v: boolean) => void;
  setIntroDone: (v: boolean) => void;
  toggleMuted: () => void;
}

export const useExperience = create<ExperienceState>((set) => ({
  progress: 0,
  inView: true,
  loaded: false,
  introDone: false,
  muted: true,
  setProgress: (progress) => set({ progress }),
  setInView: (inView) => set({ inView }),
  setLoaded: (loaded) => set({ loaded }),
  setIntroDone: (introDone) => set({ introDone }),
  toggleMuted: () => set((s) => ({ muted: !s.muted })),
}));
