import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { smoothstep, clamp } from "@/lib/easing";
import { useHeroStore } from "@/lib/store";

interface Key {
  at: number;
  pos: [number, number, number];
  target: [number, number, number];
}

/**
 * Camera keyframes across the 5 beats: distant cold-open -> arcing around the
 * forming drone -> settling to a clean hero 3/4 angle -> a gentle push toward
 * the nozzle as the wash fires. Eased between frames with subtle idle noise so
 * the camera is never dead-still.
 */
const KEYS: Key[] = [
  { at: 0.0, pos: [0.4, 2.6, 11.5], target: [0, 0.4, 0] },
  { at: 0.08, pos: [5.4, 1.6, 8.2], target: [0, 0, 0] },
  { at: 0.27, pos: [-6.0, 2.4, 6.0], target: [0, 0, 0] },
  { at: 0.45, pos: [3.6, 1.7, 7.6], target: [0, 0.2, 0] },
  { at: 0.62, pos: [2.3, 1.05, 7.0], target: [0, 0, 0.3] },
  { at: 0.8, pos: [1.5, 0.8, 6.0], target: [0, 0, 0.9] },
  { at: 1.0, pos: [1.5, 0.8, 6.0], target: [0, 0, 0.9] },
];

export function CameraRig() {
  const { camera } = useThree();
  const posV = useMemo(() => new THREE.Vector3(...KEYS[0].pos), []);
  const tgtV = useMemo(() => new THREE.Vector3(...KEYS[0].target), []);
  const curPos = useRef(posV.clone());
  const curTgt = useRef(tgtV.clone());
  const a = useMemo(() => new THREE.Vector3(), []);
  const b = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    const p = useHeroStore.getState().progress;

    // Find the surrounding keyframes.
    let i = 0;
    while (i < KEYS.length - 1 && p > KEYS[i + 1].at) i++;
    const k0 = KEYS[i];
    const k1 = KEYS[Math.min(i + 1, KEYS.length - 1)];
    const span = Math.max(0.0001, k1.at - k0.at);
    const local = smoothstep(clamp((p - k0.at) / span));

    a.set(...k0.pos).lerp(b.set(...k1.pos), local);
    posV.copy(a);
    a.set(...k0.target).lerp(b.set(...k1.target), local);
    tgtV.copy(a);

    // Idle breathing noise (low amplitude, eases off as the wash takes over).
    const t = clock.elapsedTime;
    const idle = (1 - clamp((p - 0.62) / 0.18)) * 0.5 + 0.05;
    posV.x += Math.sin(t * 0.4) * 0.12 * idle;
    posV.y += Math.cos(t * 0.33) * 0.08 * idle;

    // Critically-damped follow for smoothness.
    const lambda = 4.5;
    const f = 1 - Math.exp(-lambda * Math.min(dt, 0.05));
    curPos.current.lerp(posV, f);
    curTgt.current.lerp(tgtV, f);

    camera.position.copy(curPos.current);
    camera.lookAt(curTgt.current);
  });

  return null;
}
