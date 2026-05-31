import * as THREE from "three";

/**
 * ===========================================================================
 * DATA-DRIVEN DRONE — assembled transforms only (the concept is "forging":
 * matter BECOMES machine, so there is no exploded layout to choreograph).
 * ===========================================================================
 *
 * Two things are derived from this data:
 *   1. The solid procedural drone (rendered part-by-part in <Drone/>).
 *   2. `sampleForgeTargets(n)` — ~n points distributed across the parts. The
 *      grime particle field converges to these so the drone CONDENSES out of
 *      particulate. Swap in a real .glb later: sample target points from the
 *      loaded mesh surfaces instead, and render the glTF — choreography (which
 *      only needs the target cloud + a `mood`/forge progress) is unchanged.
 */

export type PartKind =
  | "core"
  | "frame"
  | "motor"
  | "rotor"
  | "tank"
  | "boom"
  | "nozzle"
  | "gear"
  | "sensor";

export interface PartSpec {
  id: string;
  kind: PartKind;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  /** rough bounding size used to scatter forge target points across the part */
  extent: [number, number, number];
  emissive?: boolean;
}

const ARM_LEN = 2.15;
const ARM_DIAG = Math.SQRT1_2 * ARM_LEN;
const MOTOR_Y = 0.18;

const CORNERS = [
  { x: -1, z: -1, tag: "fl" },
  { x: 1, z: -1, tag: "fr" },
  { x: -1, z: 1, tag: "bl" },
  { x: 1, z: 1, tag: "br" },
];

function build(): PartSpec[] {
  const parts: PartSpec[] = [];

  parts.push({ id: "core", kind: "core", position: [0, 0, 0], extent: [1.3, 0.6, 1.5] });
  parts.push({ id: "tank", kind: "tank", position: [0, 0.62, -0.1], extent: [0.85, 1.1, 0.85] });

  CORNERS.forEach((c) => {
    const ax = c.x * ARM_DIAG;
    const az = c.z * ARM_DIAG;
    const angle = Math.atan2(az, ax);
    parts.push({
      id: `arm-${c.tag}`,
      kind: "frame",
      position: [ax / 2, 0, az / 2],
      rotation: [0, -angle, 0],
      extent: [2.1, 0.16, 0.16],
    });
    parts.push({ id: `motor-${c.tag}`, kind: "motor", position: [ax, MOTOR_Y, az], extent: [0.6, 0.35, 0.6] });
    parts.push({ id: `rotor-${c.tag}`, kind: "rotor", position: [ax, MOTOR_Y + 0.16, az], extent: [1.7, 0.06, 0.2] });
    parts.push({
      id: `led-${c.tag}`,
      kind: "sensor",
      emissive: true,
      position: [ax * 0.92, MOTOR_Y - 0.02, az * 0.92],
      scale: [0.5, 0.5, 0.5],
      extent: [0.2, 0.2, 0.2],
    });
  });

  [-1, 1].forEach((s, i) => {
    parts.push({ id: `gear-${i}`, kind: "gear", position: [s * 0.55, -0.55, 0], extent: [0.16, 0.6, 1.3] });
  });

  parts.push({ id: "boom", kind: "boom", position: [0, -0.18, 1.05], extent: [0.18, 0.18, 1.7] });
  parts.push({ id: "nozzle", kind: "nozzle", emissive: true, position: [0, -0.18, 1.85], extent: [0.25, 0.25, 0.4] });
  parts.push({
    id: "sensor-fwd",
    kind: "sensor",
    emissive: true,
    position: [0, 0.05, 0.78],
    scale: [0.7, 0.7, 0.7],
    extent: [0.25, 0.25, 0.25],
  });

  return parts;
}

export const DRONE_PARTS: PartSpec[] = build();

/** World-space nozzle tip the wash jet emits from, and its direction (toward camera). */
export const NOZZLE_TIP = new THREE.Vector3(0, -0.18, 2.05);
export const NOZZLE_DIR = new THREE.Vector3(0, 0.12, 1).normalize();

/**
 * Distribute `count` points across the drone parts (weighted by volume) — the
 * convergence cloud the forging particles harden into.
 */
export function sampleForgeTargets(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const volumes = DRONE_PARTS.map((p) => p.extent[0] * p.extent[1] * p.extent[2]);
  const total = volumes.reduce((a, b) => a + b, 0);

  for (let i = 0; i < count; i++) {
    // pick a part proportional to its volume
    let r = Math.random() * total;
    let pi = 0;
    while (pi < DRONE_PARTS.length - 1 && r > volumes[pi]) {
      r -= volumes[pi];
      pi++;
    }
    const part = DRONE_PARTS[pi];
    const [ex, ey, ez] = part.extent;
    arr[i * 3] = part.position[0] + (Math.random() - 0.5) * ex;
    arr[i * 3 + 1] = part.position[1] + (Math.random() - 0.5) * ey;
    arr[i * 3 + 2] = part.position[2] + (Math.random() - 0.5) * ez;
  }
  return arr;
}
