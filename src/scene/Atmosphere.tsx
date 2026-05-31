import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BEATS } from "@/lib/beats";
import { remap, clamp } from "@/lib/easing";
import { useHeroStore } from "@/lib/store";

const DUST = 320;

/**
 * Slow drifting particle field + a single faint droplet catching light during
 * the cold open. Sets the volumetric, near-black void mood of beat 1.
 */
export function Atmosphere() {
  const ref = useRef<THREE.Points>(null);
  const dropRef = useRef<THREE.Mesh>(null);
  const dropMat = useRef<THREE.MeshStandardMaterial>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) ref.current.rotation.y = t * 0.012;

    const p = useHeroStore.getState().progress;
    // Droplet glows in the cold open, fades as assembly begins.
    const cold = 1 - remap(p, BEATS.coldOpen.end, BEATS.assembly.start + 0.05);
    if (dropRef.current) {
      dropRef.current.position.set(2.6, 0.6 + Math.sin(t * 0.6) * 0.15, 1.5);
      dropRef.current.visible = cold > 0.01;
    }
    if (dropMat.current) dropMat.current.emissiveIntensity = clamp(cold) * 2.2;
  });

  return (
    <group>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#5d6f78"
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </points>

      <mesh ref={dropRef}>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshStandardMaterial
          ref={dropMat}
          color="#bfeefb"
          emissive="#7fdcef"
          emissiveIntensity={2}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}
