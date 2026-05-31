/** Weighted, cinematic easings + math helpers. No linear motion anywhere. */

export const EASE_CINE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_CINE_IN: [number, number, number, number] = [0.7, 0, 0.84, 0];

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Map value from one range to another, clamped to the input window → [0,1]. */
export const remap = (value: number, inMin: number, inMax: number, outMin = 0, outMax = 1) => {
  const t = clamp((value - inMin) / (inMax - inMin));
  return outMin + (outMax - outMin) * t;
};

export const smoothstep = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t)));
export const easeInExpo = (t: number) => (t <= 0 ? 0 : Math.pow(2, 10 * clamp(t) - 10));

export const easeInOutCubic = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/** Frame-rate-independent damp toward target. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * Math.min(dt, 0.1)));
