import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { PartSpec } from "@/lib/droneParts";
import { BEATS } from "@/lib/beats";
import { remap, easeOutExpo, easeOutBack, clamp } from "@/lib/easing";
import { useHeroStore } from "@/lib/store";

interface Props {
  spec: PartSpec;
  metal: THREE.Material;
  accent: THREE.Material;
}

/**
 * One physical part of the drone. Owns its own transform and animates between
 * its `exploded` and `assembled` poses based on the master scroll progress —
 * with no React re-renders (reads the store inside useFrame).
 *
 * To render a real GLTF mesh instead of a primitive, swap the geometry switch
 * below for the loaded mesh keyed by `spec.id`; the motion logic is untouched.
 */
export function DronePart({ spec, metal, accent }: Props) {
  const ref = useRef<THREE.Group>(null);
  const isRotor = spec.kind === "rotor";

  // Pre-build vector targets once.
  const targets = useMemo(() => {
    const ex = spec.exploded;
    const as = spec.assembled;
    return {
      exPos: new THREE.Vector3(...ex.position),
      asPos: new THREE.Vector3(...as.position),
      exRot: new THREE.Euler(...ex.rotation),
      asRot: new THREE.Euler(...(as.rotation ?? [0, 0, 0])),
      scale: new THREE.Vector3(...(as.scale ?? [1, 1, 1])),
    };
  }, [spec]);

  const tmpQuatA = useMemo(() => new THREE.Quaternion().setFromEuler(targets.exRot), [targets]);
  const tmpQuatB = useMemo(() => new THREE.Quaternion().setFromEuler(targets.asRot), [targets]);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const p = useHeroStore.getState().progress;

    // Local progress through the assembly beat (0..1), then this part's window.
    const assembly = remap(p, BEATS.assembly.start, BEATS.assembly.end);
    const partT = remap(assembly, spec.assembleAt[0], spec.assembleAt[1]);
    const settle = easeOutBack(partT, 1.45); // slight overshoot as it locks home
    const settleSmooth = easeOutExpo(partT);

    // Position: scattered -> home with weighted overshoot (allow t>1 so the
    // part eases slightly past its home before settling back).
    g.position.lerpVectors(targets.exPos, targets.asPos, clamp(settle, 0, 1.18));

    // Rotation: random spin -> aligned.
    tmpQuat.slerpQuaternions(tmpQuatA, tmpQuatB, settleSmooth);
    g.quaternion.copy(tmpQuat);

    // Micro "lock" pulse exactly as the part finishes seating.
    const lockPulse = 1 + 0.12 * Math.max(0, Math.sin(clamp(remap(partT, 0.82, 1.0)) * Math.PI));
    const baseScale = targets.scale;
    g.scale.set(baseScale.x * lockPulse, baseScale.y * lockPulse, baseScale.z * lockPulse);

    // Rotor spin-up during ignition and beyond.
    if (isRotor) {
      const ignition = remap(p, BEATS.ignition.start, 1.0);
      const spin = easeOutExpo(ignition) * 42;
      g.rotation.y += spin * dt;
    }
  });

  return (
    <group ref={ref}>
      <PartMesh spec={spec} metal={metal} accent={accent} />
    </group>
  );
}

function PartMesh({ spec, metal, accent }: Props) {
  const mat = spec.emissive ? accent : metal;

  switch (spec.kind) {
    case "core":
      return (
        <group>
          <mesh castShadow receiveShadow material={metal}>
            <boxGeometry args={[1.3, 0.5, 1.5]} />
          </mesh>
          <mesh position={[0, 0.28, 0]} material={metal}>
            <boxGeometry args={[1.0, 0.18, 1.1]} />
          </mesh>
        </group>
      );
    case "frame":
      return (
        // strut runs along +x from the core; mesh offset so group origin is the midpoint
        <mesh material={metal} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 2.1, 12]} />
        </mesh>
      );
    case "motor":
      return (
        <mesh material={metal}>
          <cylinderGeometry args={[0.26, 0.3, 0.34, 24]} />
        </mesh>
      );
    case "rotor":
      return (
        <group>
          <mesh material={metal}>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 12]} />
          </mesh>
          {/* two-blade rotor */}
          <mesh material={metal} position={[0, 0.05, 0]}>
            <boxGeometry args={[1.7, 0.02, 0.14]} />
          </mesh>
        </group>
      );
    case "tank":
      return (
        <mesh material={metal}>
          <capsuleGeometry args={[0.42, 0.7, 8, 20]} />
        </mesh>
      );
    case "boom":
      return (
        <mesh material={metal} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 1.7, 16]} />
        </mesh>
      );
    case "nozzle":
      return (
        <group>
          <mesh material={metal} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.12, 0.34, 20]} />
          </mesh>
          <mesh material={accent} position={[0, 0, 0.2]}>
            <sphereGeometry args={[0.05, 12, 12]} />
          </mesh>
        </group>
      );
    case "gear":
      return (
        <group>
          <mesh material={metal} position={[0, -0.2, 0]}>
            <boxGeometry args={[0.08, 0.5, 0.08]} />
          </mesh>
          <mesh material={metal} position={[0, -0.45, 0]}>
            <boxGeometry args={[0.1, 0.08, 1.3]} />
          </mesh>
        </group>
      );
    case "sensor":
      return (
        <mesh material={mat}>
          <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>
      );
    default:
      return null;
  }
}
