/**
 * The hero film is ONE pinned scroll sequence. Master progress 0→1 is sliced
 * into 5 acts ("FROM GRIME, FLIGHT"). Every animated value derives from these
 * ranges via `remap`, so retiming the film = editing this one file.
 */

export const HERO_PIN_VH = 560; // length of the pinned hero (~5.6 screens)

export const ACTS = {
  ground: { start: 0.0, end: 0.15 }, // I — macro grime, cold open
  forging: { start: 0.15, end: 0.45 }, // II — grime particles condense into the drone
  ascent: { start: 0.45, end: 0.65 }, // III — ignition + launch up through the murk
  wash: { start: 0.65, end: 0.8 }, // IV — the jet hits the lens; world re-grades
  altitude: { start: 0.8, end: 1.0 }, // V — coast, hover, brand reveal
} as const;

export type ActName = keyof typeof ACTS;

/**
 * Master mood 0 (full MURK) → 1 (full CLARITY). The world re-grades across the
 * wash. Drives the LUT/colour grade, fog, exposure and DOM scrims.
 */
export const moodFromProgress = (p: number) => {
  // Mostly murk until the wash, then a fast, decisive clean to clarity.
  if (p < ACTS.wash.start) return 0;
  if (p > ACTS.wash.end) return 1;
  const t = (p - ACTS.wash.start) / (ACTS.wash.end - ACTS.wash.start);
  return t * t * (3 - 2 * t); // smoothstep
};
