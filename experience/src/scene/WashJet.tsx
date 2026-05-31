"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NOZZLE_DIR } from "@/lib/droneParts";
import { ACTS } from "@/lib/acts";
import { remap, clamp } from "@/lib/easing";
import { useExperience } from "@/lib/store";
import { droneAnchor } from "./shared";

const COUNT = 900;

/**
 * The in-scene high-pressure jet fired from the nozzle toward the lens during
 * Act IV. It motivates the fullscreen <WashOverlay> wipe (the actual screen-
 * clean happens there). Origin tracks the live drone anchor.
 */
export function WashJet() {
  const points = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const { positions, velocities, ages, lifetimes } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const ages = new Float32Array(COUNT);
    const lifetimes = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      ages[i] = Math.random();
      lifetimes[i] = 0.4 + Math.random() * 0.7;
    }
    return { positions, velocities, ages, lifetimes };
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const origin = useMemo(() => new THREE.Vector3(), []);

  const spawn = (i: number) => {
    origin.set(droneAnchor.x, droneAnchor.y - 0.18, droneAnchor.z + 1.85);
    const dir = NOZZLE_DIR.clone();
    dir.x += (Math.random() - 0.5) * 0.55;
    dir.y += (Math.random() - 0.5) * 0.45;
    dir.normalize();
    const speed = 7 + Math.random() * 7;
    velocities[i * 3] = dir.x * speed;
    velocities[i * 3 + 1] = dir.y * speed;
    velocities[i * 3 + 2] = dir.z * speed;
    positions[i * 3] = origin.x;
    positions[i * 3 + 1] = origin.y;
    positions[i * 3 + 2] = origin.z;
    ages[i] = 0;
  };

  useFrame((_, dtRaw) => {
    const p = useExperience.getState().progress;
    const dt = Math.min(dtRaw, 0.05);
    const intensity = Math.sin(clamp(remap(p, ACTS.wash.start, ACTS.wash.end)) * Math.PI);
    const active = intensity > 0.02;
    if (matRef.current) matRef.current.opacity = intensity * 0.85;
    if (points.current) points.current.visible = active;
    if (!active) return;

    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      ages[i] += dt;
      if (ages[i] > lifetimes[i]) {
        if (Math.random() < intensity) spawn(i);
        else continue;
      }
      velocities[i * 3 + 1] -= 3.5 * dt;
      positions[i * 3] += velocities[i * 3] * dt;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * dt;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * dt;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geom} frustumCulled={false}>
      <pointsMaterial
        ref={matRef}
        color="#cdeffb"
        size={0.08}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
