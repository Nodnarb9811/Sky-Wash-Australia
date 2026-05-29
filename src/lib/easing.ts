/**
 * Cinematic, weighted easings. No linear motion anywhere in the experience.
 * Mirrors the cubic-beziers exposed to Tailwind in tailwind.config.ts.
 */

export const EASE_CINE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_CINE_IN: [number, number, number, number] = [0.7, 0, 0.84, 0];
export const EASE_SOFT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/** Clamp a value to a range. */
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Frame-rate-independent damping toward a target. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

/**
 * Map a value from one range to another, clamped to [0,1] of the input window.
 * Used heavily to slice the master scroll progress (0..1) into per-beat ranges.
 */
export const remap = (value: number, inMin: number, inMax: number, outMin = 0, outMax = 1) => {
  const t = clamp((value - inMin) / (inMax - inMin));
  return outMin + (outMax - outMin) * t;
};

/** Smoothstep (ease in-out) for a normalised t. */
export const smoothstep = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

/** Expo-out — the workhorse for "settle into place" motion. */
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t)));

/** Back-out — gives the slight overshoot when parts lock into place. */
export const easeOutBack = (t: number, overshoot = 1.7) => {
  const c1 = overshoot;
  const c3 = c1 + 1;
  const x = clamp(t);
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
