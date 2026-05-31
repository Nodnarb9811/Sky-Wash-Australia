"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ACTS } from "@/lib/acts";
import { remap, clamp } from "@/lib/easing";
import { useExperience } from "@/lib/store";

/**
 * Act I — the grimed surface the camera creeps over. A large plane below the
 * forming drone with a procedurally noisy, oppressive material under a raking
 * light. It fades and drops away as the grime lifts into the forging.
 */
function makeNoiseTexture(size = 256) {
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const n = Math.random();
    const blotch = Math.random() < 0.08 ? 0.4 : 1;
    const v = Math.floor(28 + n * 36) * blotch;
    data[i * 4] = v * 0.85;
    data[i * 4 + 1] = v; // green-grey grime bias
    data[i * 4 + 2] = v * 0.7;
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.needsUpdate = true;
  return tex;
}

export function GrimeSurface() {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const tex = useMemo(() => makeNoiseTexture(), []);

  useFrame(() => {
    const p = useExperience.getState().progress;
    // Visible in Act I, fades out as the forging takes the grime upward.
    const vis = 1 - clamp(remap(p, ACTS.ground.end - 0.02, ACTS.forging.start + 0.12));
    if (matRef.current) {
      matRef.current.opacity = vis;
      matRef.current.transparent = true;
    }
    if (ref.current) {
      ref.current.visible = vis > 0.01;
      ref.current.position.y = -2.4 - (1 - vis) * 4; // drops away as it lifts
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -2.4, -1]}>
      <planeGeometry args={[40, 40, 1, 1]} />
      <meshStandardMaterial
        ref={matRef}
        map={tex}
        color="#2c322b"
        roughness={0.95}
        metalness={0.05}
        transparent
      />
    </mesh>
  );
}
