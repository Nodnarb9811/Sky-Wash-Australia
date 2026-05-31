"use client";

import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { moodFromProgress, ACTS } from "@/lib/acts";
import { remap, clamp, lerp } from "@/lib/easing";
import { useExperience } from "@/lib/store";

/**
 * Drives the scene background + fog between the two worlds. Fog thickens through
 * the ascent ("a ceiling of murk" the camera punches through) then clears into
 * luminous open sky at altitude.
 */
const MURK = new THREE.Color("#0a0d11");
const CLARITY = new THREE.Color("#cfe6ee");
const FOG_MURK = new THREE.Color("#0b1014");
const FOG_CLARITY = new THREE.Color("#dceef3");

export function Atmosphere() {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.Fog(FOG_MURK.clone(), 6, 26);
    scene.background = MURK.clone();
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  useFrame(() => {
    const p = useExperience.getState().progress;
    const mood = moodFromProgress(p);

    if (scene.background instanceof THREE.Color) scene.background.copy(MURK).lerp(CLARITY, mood);
    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      fog.color.copy(FOG_MURK).lerp(FOG_CLARITY, mood);
      // Thicken during ascent, then open right up at altitude.
      const ascent = Math.sin(clamp(remap(p, ACTS.ascent.start, ACTS.wash.start)) * Math.PI);
      fog.near = lerp(6, 1.5, ascent) + mood * 8;
      fog.far = lerp(26, 14, ascent) + mood * 40;
    }
  });

  return null;
}
