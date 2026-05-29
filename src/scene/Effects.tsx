import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/**
 * Tasteful post stack — bloom and DOF should "whisper, not shout" (per brief).
 * Bloom lifts the cyan emissives; shallow DOF + vignette + faint grain give the
 * cinematic, in-camera feel. Disabled on the fallback/reduced paths.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom
        intensity={0.7}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.25}
        mipmapBlur
        radius={0.7}
      />
      <DepthOfField focusDistance={0.012} focalLength={0.05} bokehScale={2.2} height={480} />
      <Vignette eskil={false} offset={0.28} darkness={0.85} />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.035} />
    </EffectComposer>
  );
}
