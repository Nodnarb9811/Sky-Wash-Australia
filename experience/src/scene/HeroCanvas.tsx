"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "@/lib/store";
import { Atmosphere } from "./Atmosphere";
import { Lighting } from "./Lighting";
import { GrimeSurface } from "./GrimeSurface";
import { ForgeField } from "./ForgeField";
import { Drone } from "./Drone";
import { WashJet } from "./WashJet";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";

function ReadyFlag() {
  const setLoaded = useExperience((s) => s.setLoaded);
  useEffect(() => {
    const id = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(id);
  }, [setLoaded]);
  return null;
}

/**
 * The live WebGL film (full-capability path). The render loop pauses
 * (`frameloop="never"`) whenever the hero stage scrolls out of view; pixel
 * ratio is capped at 2.
 */
export function HeroCanvas() {
  const inView = useExperience((s) => s.inView);
  return (
    <Canvas
      frameloop={inView ? "always" : "never"}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      camera={{ position: [0.2, -1.4, 4.8], fov: 42, near: 0.1, far: 120 }}
    >
      <Suspense fallback={null}>
        <ReadyFlag />
        <Atmosphere />
        <Lighting />
        <GrimeSurface />
        <ForgeField />
        <Drone />
        <WashJet />
        <CameraRig />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
