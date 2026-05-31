"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DRONE_PARTS, type PartSpec } from "@/lib/droneParts";
import { ACTS } from "@/lib/acts";
import { remap, easeOutExpo, clamp, lerp } from "@/lib/easing";
import { useExperience } from "@/lib/store";
import { droneAnchor, droneHeight } from "./shared";

/**
 * The solid procedural drone. It DISSOLVES in across the forging act (matter
 * becoming machine — the particle field in <ForgeField> hands off to this),
 * then rises with the ascent and persists as the companion. Rotors spin from
 * ignition; cyan accents ignite; subtle idle wobble so it's never dead-still.
 */
export function Drone() {
  const group = useRef<THREE.Group>(null);
  const rotors = useRef<THREE.Group[]>([]);

  const { metal, accent } = useMemo(() => {
    const metal = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#3a444d"),
      metalness: 0.95,
      roughness: 0.32,
      clearcoat: 0.6,
      clearcoatRoughness: 0.3,
      envMapIntensity: 1.1,
      transparent: true,
      opacity: 0,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0c2a31"),
      emissive: new THREE.Color("#1FB6D6"),
      emissiveIntensity: 0,
      metalness: 0.4,
      roughness: 0.3,
      transparent: true,
      opacity: 0,
    });
    return { metal, accent };
  }, []);

  useEffect(() => () => {
    metal.dispose();
    accent.dispose();
  }, [metal, accent]);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const p = useExperience.getState().progress;
    const t = clock.elapsedTime;

    // Forge dissolve-in (solid resolves out of particulate in the back half of forging).
    const forge = remap(p, lerp(ACTS.forging.start, ACTS.forging.end, 0.45), ACTS.forging.end);
    const solidity = easeOutExpo(forge);
    metal.opacity = solidity;
    accent.opacity = solidity;

    // Ignition: cyan accents light up.
    const ignition = remap(p, ACTS.ascent.start, ACTS.ascent.end);
    accent.emissiveIntensity = lerp(0, 3.0, easeOutExpo(ignition));

    // Position: rise with the ascent + idle wobble.
    const y = droneHeight(p);
    const wobble = Math.sin(t * 1.2) * 0.05 * (0.3 + ignition * 0.7);
    g.position.set(Math.sin(t * 0.6) * 0.04, y + wobble, 0);
    g.rotation.set(Math.sin(t * 0.5) * 0.012, Math.sin(t * 0.25) * 0.03, Math.sin(t * 0.4) * 0.01);
    droneAnchor.set(g.position.x, g.position.y, 0.2);

    // Rotor spin-up from ignition.
    const spin = easeOutExpo(remap(p, ACTS.ascent.start, 1)) * 50;
    for (const r of rotors.current) if (r) r.rotation.y += spin * 0.016;
  });

  rotors.current = [];

  return (
    <group ref={group} name="drone">
      {DRONE_PARTS.map((spec) => (
        <PartMesh
          key={spec.id}
          spec={spec}
          metal={metal}
          accent={accent}
          rotorRef={(el) => el && rotors.current.push(el)}
        />
      ))}
    </group>
  );
}

function PartMesh({
  spec,
  metal,
  accent,
  rotorRef,
}: {
  spec: PartSpec;
  metal: THREE.Material;
  accent: THREE.Material;
  rotorRef: (el: THREE.Group | null) => void;
}) {
  const mat = spec.emissive ? accent : metal;
  const pos = spec.position;
  const rot = spec.rotation ?? [0, 0, 0];
  const scl = spec.scale ?? [1, 1, 1];

  switch (spec.kind) {
    case "core":
      return (
        <group position={pos}>
          <mesh material={metal}>
            <boxGeometry args={[1.3, 0.5, 1.5]} />
          </mesh>
          <mesh position={[0, 0.28, 0]} material={metal}>
            <boxGeometry args={[1.0, 0.18, 1.1]} />
          </mesh>
        </group>
      );
    case "frame":
      return (
        <group position={pos} rotation={rot as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={metal}>
            <cylinderGeometry args={[0.08, 0.08, 2.1, 12]} />
          </mesh>
        </group>
      );
    case "motor":
      return (
        <mesh position={pos} material={metal}>
          <cylinderGeometry args={[0.26, 0.3, 0.34, 24]} />
        </mesh>
      );
    case "rotor":
      return (
        <group position={pos} ref={rotorRef}>
          <mesh material={metal}>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 12]} />
          </mesh>
          <mesh position={[0, 0.05, 0]} material={metal}>
            <boxGeometry args={[1.7, 0.02, 0.14]} />
          </mesh>
        </group>
      );
    case "tank":
      return (
        <mesh position={pos} material={metal}>
          <capsuleGeometry args={[0.42, 0.7, 8, 20]} />
        </mesh>
      );
    case "boom":
      return (
        <mesh position={pos} rotation={[Math.PI / 2, 0, 0]} material={metal}>
          <cylinderGeometry args={[0.07, 0.09, 1.7, 16]} />
        </mesh>
      );
    case "nozzle":
      return (
        <group position={pos}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={metal}>
            <coneGeometry args={[0.12, 0.34, 20]} />
          </mesh>
          <mesh position={[0, 0, 0.2]} material={accent}>
            <sphereGeometry args={[0.05, 12, 12]} />
          </mesh>
        </group>
      );
    case "gear":
      return (
        <group position={pos}>
          <mesh position={[0, -0.2, 0]} material={metal}>
            <boxGeometry args={[0.08, 0.5, 0.08]} />
          </mesh>
          <mesh position={[0, -0.45, 0]} material={metal}>
            <boxGeometry args={[0.1, 0.08, 1.3]} />
          </mesh>
        </group>
      );
    case "sensor":
      return (
        <mesh position={pos} scale={scl as [number, number, number]} material={mat}>
          <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>
      );
    default:
      return null;
  }
}
