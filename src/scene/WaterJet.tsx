import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NOZZLE_TIP, NOZZLE_DIR } from "@/lib/droneParts";
import { BEATS } from "@/lib/beats";
import { remap, clamp } from "@/lib/easing";
import { useHeroStore } from "@/lib/store";

const COUNT = 700;

/**
 * High-pressure spray fired from the nozzle toward the camera during the wash
 * beat (0.62–0.80). A recycled CPU particle field — cheap, and it reads as a
 * dense cone of droplets. The fullscreen wash/wipe itself is the DOM
 * <WashOverlay>; this is the in-scene jet that motivates it.
 */
export function WaterJet() {
  const points = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const { positions, velocities, ages, lifetimes } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const ages = new Float32Array(COUNT);
    const lifetimes = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      ages[i] = Math.random() * 1.2;
      lifetimes[i] = 0.6 + Math.random() * 0.9;
      positions[i * 3] = NOZZLE_TIP.x;
      positions[i * 3 + 1] = NOZZLE_TIP.y;
      positions[i * 3 + 2] = NOZZLE_TIP.z;
    }
    return { positions, velocities, ages, lifetimes };
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const spawn = (i: number) => {
    const spread = 0.5;
    const dir = NOZZLE_DIR.clone();
    dir.x += (Math.random() - 0.5) * spread;
    dir.y += (Math.random() - 0.5) * spread * 0.7;
    dir.z += (Math.random() - 0.5) * spread * 0.3;
    dir.normalize();
    const speed = 6 + Math.random() * 6;
    velocities[i * 3] = dir.x * speed;
    velocities[i * 3 + 1] = dir.y * speed;
    velocities[i * 3 + 2] = dir.z * speed;
    positions[i * 3] = NOZZLE_TIP.x;
    positions[i * 3 + 1] = NOZZLE_TIP.y;
    positions[i * 3 + 2] = NOZZLE_TIP.z;
    ages[i] = 0;
    lifetimes[i] = 0.5 + Math.random() * 0.8;
  };

  useFrame((_, dtRaw) => {
    const p = useHeroStore.getState().progress;
    const dt = Math.min(dtRaw, 0.05);

    // Jet intensity ramps up across the wash beat then tails off.
    const washT = remap(p, BEATS.wash.start, BEATS.wash.end);
    const intensity = Math.sin(clamp(washT) * Math.PI); // 0 -> 1 -> 0
    const active = intensity > 0.02;

    if (matRef.current) matRef.current.opacity = intensity * 0.9;
    if (points.current) points.current.visible = active;
    if (!active) return;

    const pos = geom.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      ages[i] += dt;
      if (ages[i] > lifetimes[i]) {
        // Only spawn proportionally to intensity for a believable ramp.
        if (Math.random() < intensity) spawn(i);
        else continue;
      }
      velocities[i * 3 + 1] -= 4.5 * dt; // gravity
      positions[i * 3] += velocities[i * 3] * dt;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * dt;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * dt;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geom} frustumCulled={false}>
      <pointsMaterial
        ref={matRef}
        color="#bfeefb"
        size={0.07}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
