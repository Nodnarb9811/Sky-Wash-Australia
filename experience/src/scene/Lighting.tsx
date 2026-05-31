"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, Lightformer } from "@react-three/drei";
import { moodFromProgress } from "@/lib/acts";
import { useExperience } from "@/lib/store";
import { lerp } from "@/lib/easing";

/**
 * Two-world lighting. In MURK it's cold, low-key, oppressive; across the wash
 * it lifts into luminous, airy CLARITY. Reflections come from Lightformers (no
 * external HDRI fetch — offline-safe). Key/rim intensities ride `mood`.
 */
export function Lighting() {
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.PointLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);

  useFrame(() => {
    const mood = moodFromProgress(useExperience.getState().progress);
    if (amb.current) amb.current.intensity = lerp(0.1, 0.55, mood);
    if (key.current) key.current.intensity = lerp(0.7, 1.7, mood);
    if (rim.current) rim.current.intensity = lerp(14, 30, mood);
  });

  return (
    <>
      <ambientLight ref={amb} intensity={0.1} />
      <directionalLight ref={key} position={[6, 10, 4]} intensity={0.7} color="#dfeef5" />
      <directionalLight position={[-7, 2, 3]} intensity={0.3} color="#9fb4bd" />
      <pointLight ref={rim} position={[-2, 1.5, -6]} intensity={14} distance={40} decay={2} color="#1FB6D6" />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={1.4} position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[14, 14, 1]} color="#cdd9df" />
        <Lightformer form="rect" intensity={2.0} position={[5, 3, 3]} scale={[1, 8, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.2} position={[-5, 1, 2]} scale={[1, 6, 1]} color="#7fdcef" />
        <Lightformer form="ring" intensity={1.8} position={[-3, 0, -5]} scale={[3, 3, 1]} color="#1FB6D6" />
      </Environment>
    </>
  );
}
