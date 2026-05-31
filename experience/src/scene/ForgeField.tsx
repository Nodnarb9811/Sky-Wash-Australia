"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sampleForgeTargets } from "@/lib/droneParts";
import { ACTS } from "@/lib/acts";
import { remap, clamp, easeInOutCubic } from "@/lib/easing";
import { useExperience } from "@/lib/store";

const COUNT = 4200;

/**
 * "THE FORGING" (Act II). Grime detaches from the surface in its thousands,
 * swarms upward and CONDENSES into the drone — each particle eases from a
 * scattered low origin to a target point sampled across the drone's geometry.
 * Colour shifts grime-green → cyan as it hardens; the cloud fades as the solid
 * <Drone> dissolves in. Matter becomes machine.
 */
export function ForgeField() {
  const points = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const { positions, colors, scatter, targets, seed } = useMemo(() => {
    const targets = sampleForgeTargets(COUNT);
    const scatter = new Float32Array(COUNT * 3);
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      // Scattered low, wide — "trapped in grime".
      const r = 2 + Math.random() * 7;
      const a = Math.random() * Math.PI * 2;
      scatter[i * 3] = Math.cos(a) * r;
      scatter[i * 3 + 1] = -4 + Math.random() * 3;
      scatter[i * 3 + 2] = Math.sin(a) * r - 1;
      positions[i * 3] = scatter[i * 3];
      positions[i * 3 + 1] = scatter[i * 3 + 1];
      positions[i * 3 + 2] = scatter[i * 3 + 2];
      seed[i] = Math.random();
    }
    return { positions, colors, scatter, targets, seed };
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  const grime = useMemo(() => new THREE.Color("#404a3a"), []);
  const cyan = useMemo(() => new THREE.Color("#1FB6D6"), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const p = useExperience.getState().progress;
    const t = clock.elapsedTime;

    // Forge progress across Act II.
    const forge = clamp(remap(p, ACTS.forging.start, ACTS.forging.end));
    // Cloud visible through ground+forging, gone once the solid drone resolves.
    const visible = clamp(remap(p, 0, 0.04)) * (1 - clamp(remap(p, ACTS.forging.end - 0.04, ACTS.forging.end + 0.02)));
    if (matRef.current) matRef.current.opacity = visible * 0.9;
    if (points.current) points.current.visible = visible > 0.01;
    if (visible <= 0.01) return;

    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = geom.getAttribute("color") as THREE.BufferAttribute;

    for (let i = 0; i < COUNT; i++) {
      // Per-particle staggered convergence for a swarming, deliberate feel.
      const local = easeInOutCubic(clamp((forge - seed[i] * 0.35) / 0.65));
      const drift = (1 - local) * Math.sin(t * 0.8 + seed[i] * 9) * 0.25; // pre-forge churn
      const ix = i * 3;
      posAttr.array[ix] = THREE.MathUtils.lerp(scatter[ix], targets[ix], local) + drift;
      posAttr.array[ix + 1] = THREE.MathUtils.lerp(scatter[ix + 1], targets[ix + 1], local) + drift * 0.5;
      posAttr.array[ix + 2] = THREE.MathUtils.lerp(scatter[ix + 2], targets[ix + 2], local) + drift;

      tmp.copy(grime).lerp(cyan, local * 0.85);
      colAttr.array[ix] = tmp.r;
      colAttr.array[ix + 1] = tmp.g;
      colAttr.array[ix + 2] = tmp.b;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geom} frustumCulled={false}>
      <pointsMaterial
        ref={matRef}
        vertexColors
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
