/**
 * The hero is ONE pinned scroll sequence. Master progress runs 0 -> 1 and is
 * sliced into 5 beats. Every animated value in the scene derives from these
 * ranges via `remap`, so retiming the film means editing only this file.
 */

export const HERO_PIN_VH = 480; // total scroll length of the pinned hero (~4.8 screens)

export const BEATS = {
  coldOpen: { start: 0.0, end: 0.08 },
  assembly: { start: 0.08, end: 0.45 },
  ignition: { start: 0.45, end: 0.62 },
  wash: { start: 0.62, end: 0.8 },
  reveal: { start: 0.8, end: 1.0 },
} as const;

export type BeatName = keyof typeof BEATS;
