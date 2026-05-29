import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useHeroStore } from "@/lib/store";
import { Drone } from "./Drone";
import { WaterJet } from "./WaterJet";
import { CameraRig } from "./CameraRig";
import { Lighting } from "./Lighting";
import { Effects } from "./Effects";
import { Atmosphere } from "./Atmosphere";

function ReadyFlag() {
  const setReady = useHeroStore((s) => s.setReady);
  useEffect(() => {
    // Procedural scene mounted — mark ready on the next tick so the loader can
    // fade out gracefully.
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [setReady]);
  return null;
}

/**
 * The live WebGL hero (full-capability path only). The render loop is paused
 * via `frameloop="never"` whenever the hero scrolls out of view (set by an
 * IntersectionObserver in <Hero>), and the pixel ratio is capped at 2.
 */
export function HeroScene() {
  const inView = useHeroStore((s) => s.inView);

  return (
    <Canvas
      frameloop={inView ? "always" : "never"}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ position: [0.4, 2.6, 11.5], fov: 38, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#0A0D11"]} />
      <fog attach="fog" args={["#0A0D11", 9, 22]} />

      <Suspense fallback={null}>
        <ReadyFlag />
        <Lighting />
        <Atmosphere />
        <Drone />
        <WaterJet />
        <CameraRig />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
