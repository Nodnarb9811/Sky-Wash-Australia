"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "@/lib/store";
import { smoothstep, clamp } from "@/lib/easing";
import { droneAnchor } from "./shared";

/**
 * The ascent. Camera position follows a CatmullRom spline of eased waypoints —
 * from low over the grime, pulling back as the drone forges, then launching UP
 * through the murk to a serene hero hover at altitude. The lookAt target is the
 * live drone anchor (see shared.ts), so framing always holds. Subtle hand-held
 * noise keeps it alive; it eases off into the wash for a clean hero frame.
 */
const POS: THREE.Vector3[] = [
  new THREE.Vector3(0.2, -1.4, 4.8), // I  ground
  new THREE.Vector3(2.6, -0.2, 6.6), // I→II
  new THREE.Vector3(-3.6, 1.0, 6.2), // II forging orbit
  new THREE.Vector3(2.8, 1.8, 6.8), // II→III
  new THREE.Vector3(1.2, 5.5, 6.2), // III ascent
  new THREE.Vector3(0.6, 10.0, 5.8), // III→IV threshold
  new THREE.Vector3(0.4, 11.6, 5.4), // IV wash
  new THREE.Vector3(2.4, 13.0, 6.6), // V altitude hero 3/4
  new THREE.Vector3(2.4, 13.1, 6.7), // V settle
];

export function CameraRig() {
  const { camera } = useThree();
  const curve = useMemo(() => new THREE.CatmullRomCurve3(POS, false, "catmullrom", 0.5), []);
  const curPos = useRef(POS[0].clone());
  const curTgt = useRef(droneAnchor.clone());
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    const p = useExperience.getState().progress;
    curve.getPointAt(clamp(smoothstep(p)), curPos.current);

    const t = clock.elapsedTime;
    const calm = 1 - clamp((p - 0.62) / 0.18);
    tmp.copy(curPos.current);
    tmp.x += Math.sin(t * 0.5) * 0.1 * calm;
    tmp.y += Math.cos(t * 0.4) * 0.07 * calm;

    const k = 1 - Math.exp(-5 * Math.min(dt, 0.05));
    camera.position.lerp(tmp, k);
    curTgt.current.lerp(droneAnchor, k);
    camera.lookAt(curTgt.current);
  });

  return null;
}
