"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  ChromaticAberration,
  Vignette,
  Noise,
  HueSaturation,
  BrightnessContrast,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { moodFromProgress, ACTS } from "@/lib/acts";
import { remap, clamp, lerp } from "@/lib/easing";
import { useExperience } from "@/lib/store";

/**
 * Postprocessing + the master mood control. The colour grade IS the two-world
 * device: in MURK the image is desaturated, cool and dim; across the wash it
 * lifts to saturated, bright CLARITY. Chromatic aberration peaks during the
 * ascent for speed; bloom lifts the cyan emissives. (Animated grade stands in
 * for an authored .cube LUT — drop a real LUT here later via the `LUT` effect.)
 */
export function Effects() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hue = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bc = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ca = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bloom = useRef<any>(null);

  useFrame(() => {
    const p = useExperience.getState().progress;
    const mood = moodFromProgress(p);

    if (hue.current) hue.current.saturation = lerp(-0.42, 0.12, mood);
    if (bc.current) {
      bc.current.brightness = lerp(-0.07, 0.04, mood);
      bc.current.contrast = lerp(0.08, 0.0, mood);
    }
    if (bloom.current) bloom.current.intensity = lerp(0.5, 0.95, mood);

    // Chromatic aberration: peaks across the ascent.
    const ascent = Math.sin(clamp(remap(p, ACTS.ascent.start, ACTS.ascent.end)) * Math.PI);
    const off = lerp(0.0006, 0.004, ascent);
    if (ca.current?.offset) ca.current.offset.set(off, off);
  });

  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom ref={bloom} intensity={0.5} luminanceThreshold={0.5} luminanceSmoothing={0.25} mipmapBlur radius={0.75} />
      <DepthOfField focusDistance={0.012} focalLength={0.05} bokehScale={2.2} height={480} />
      <ChromaticAberration ref={ca} blendFunction={BlendFunction.NORMAL} radialModulation={false} modulationOffset={0} />
      <HueSaturation ref={hue} hue={0} saturation={-0.42} />
      <BrightnessContrast ref={bc} brightness={-0.07} contrast={0.08} />
      <Vignette eskil={false} offset={0.26} darkness={0.9} />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.04} />
    </EffectComposer>
  );
}
