import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DRONE_PARTS } from "@/lib/droneParts";
import { BEATS } from "@/lib/beats";
import { remap, easeOutExpo, lerp } from "@/lib/easing";
import { useHeroStore } from "@/lib/store";
import { DronePart } from "./DronePart";

/**
 * The assembled craft. Owns the SHARED materials (so emissive accents can be
 * lit in one place during ignition) and the GROUP-level motion: assembly-phase
 * rotation, the ignition lift into hover, and a subtle idle bob throughout.
 */
export function Drone() {
  const group = useRef<THREE.Group>(null);

  const { metal, accent } = useMemo(() => {
    const metal = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#3a444d"),
      metalness: 0.92,
      roughness: 0.34,
      envMapIntensity: 1.1,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0c2a31"),
      emissive: new THREE.Color("#1FB6D6"),
      emissiveIntensity: 0,
      metalness: 0.4,
      roughness: 0.3,
    });
    return { metal, accent };
  }, []);

  // Dispose shared materials on unmount (perf hygiene).
  useEffect(() => {
    return () => {
      metal.dispose();
      accent.dispose();
    };
  }, [metal, accent]);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const p = useHeroStore.getState().progress;
    const t = clock.elapsedTime;

    // During assembly the whole rig rotates slowly so the build reads in 3D.
    const assembly = remap(p, BEATS.assembly.start, BEATS.assembly.end);
    const baseSpin = lerp(-0.5, 0.18, easeOutExpo(assembly));

    // Ignition: craft lifts a few units and levels into a hover.
    const ignition = remap(p, BEATS.ignition.start, BEATS.ignition.end);
    const lift = easeOutExpo(ignition) * 0.9;

    // Subtle idle bob so it's never dead-still.
    const bob = Math.sin(t * 1.1) * 0.04 * (0.3 + ignition * 0.7);

    g.position.y = lift + bob;
    g.rotation.y = baseSpin + Math.sin(t * 0.25) * 0.02;
    g.rotation.z = Math.sin(t * 0.5) * 0.01 * ignition;

    // Light the cyan accents (LEDs/nozzle) as the craft powers up.
    accent.emissiveIntensity = lerp(0, 2.6, easeOutExpo(ignition));
  });

  return (
    <group ref={group} name="drone-rig">
      {DRONE_PARTS.map((spec) => (
        <DronePart key={spec.id} spec={spec} metal={metal} accent={accent} />
      ))}
    </group>
  );
}
