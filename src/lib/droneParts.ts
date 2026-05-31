import * as THREE from "three";

/**
 * ===========================================================================
 * DATA-DRIVEN DRONE RIG
 * ===========================================================================
 * Every part of the procedural drone is described here as pure data:
 *   - `assembled`  : final resting transform (the constructed drone)
 *   - `exploded`   : scattered start transform (deconstructed in dark space)
 *   - `assembleAt` : the [start, end] window WITHIN the assembly beat (0..1)
 *                    during which this part flies home. Staggering these makes
 *                    the build read as deliberate and engineered.
 *   - `kind`       : tells <DronePart> which primitive mesh to render.
 *
 * SWAPPING IN A REAL .glb MODEL
 * -----------------------------
 * The choreography in <Drone> only cares about `id`, `assembled`, `exploded`
 * and `assembleAt`. To use a real model:
 *   1. Load the .glb and traverse named meshes.
 *   2. Map each mesh name -> a PartSpec here (reuse assembled = mesh's authored
 *      transform; derive `exploded` from its outward vector).
 *   3. Render the GLTF mesh instead of the primitive in <DronePart>, keyed by id.
 * Nothing in the scroll logic changes. See README "Swapping the drone model".
 */

export type PartKind =
  | "core" // central body
  | "frame" // X-frame strut
  | "motor" // motor can
  | "rotor" // spinning rotor disc
  | "tank" // water tank
  | "boom" // pressure boom
  | "nozzle" // spray nozzle (jet origin)
  | "gear" // landing gear
  | "sensor"; // sensor pod / LED

export interface PartSpec {
  id: string;
  kind: PartKind;
  /** Final resting transform of the constructed drone. */
  assembled: {
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  };
  /** Scattered start transform (offset along an outward vector + random spin). */
  exploded: {
    position: [number, number, number];
    rotation: [number, number, number];
  };
  /** [start,end] window within the assembly beat (0..1) when this part settles. */
  assembleAt: [number, number];
  /** Optional emissive accent (status LEDs, sensors). */
  emissive?: boolean;
}

// Arm geometry: a quad-X layout. Each arm points to a diagonal corner.
const ARM_LEN = 2.15;
const ARM_DIAG = Math.SQRT1_2 * ARM_LEN; // x/z component for a 45° arm
const MOTOR_Y = 0.18;

// Outward unit vectors for the four arms (FL, FR, BL, BR)
const CORNERS: Array<{ x: number; z: number; tag: string }> = [
  { x: -1, z: -1, tag: "fl" },
  { x: 1, z: -1, tag: "fr" },
  { x: -1, z: 1, tag: "bl" },
  { x: 1, z: 1, tag: "br" },
];

/** Build an exploded transform by pushing a point outward along its own vector. */
function explode(
  pos: [number, number, number],
  distance: number,
  extra: [number, number, number] = [0, 0, 0]
): { position: [number, number, number]; rotation: [number, number, number] } {
  const v = new THREE.Vector3(...pos);
  const dir = v.lengthSq() < 0.001 ? new THREE.Vector3(0, 1, 0) : v.clone().normalize();
  const out = v.add(dir.multiplyScalar(distance));
  return {
    position: [out.x + extra[0], out.y + extra[1], out.z + extra[2]],
    rotation: [
      (Math.random() - 0.5) * Math.PI * 2,
      (Math.random() - 0.5) * Math.PI * 2,
      (Math.random() - 0.5) * Math.PI * 2,
    ],
  };
}

function buildParts(): PartSpec[] {
  const parts: PartSpec[] = [];

  // Central body / core — lands first, it's the anchor everything attaches to.
  parts.push({
    id: "core",
    kind: "core",
    assembled: { position: [0, 0, 0] },
    exploded: explode([0, 0, 0], 9, [0, 6, -4]),
    assembleAt: [0.0, 0.22],
  });

  // Water tank sits atop the core.
  parts.push({
    id: "tank",
    kind: "tank",
    assembled: { position: [0, 0.62, -0.1] },
    exploded: explode([0, 0.62, -0.1], 8, [3, 4, 2]),
    assembleAt: [0.12, 0.42],
  });

  // Four arms + motors + rotors, staggered around the ring.
  CORNERS.forEach((c, i) => {
    const ax = c.x * ARM_DIAG;
    const az = c.z * ARM_DIAG;
    const stagger = i * 0.07;

    // Arm strut (rotated to point at its corner)
    const angle = Math.atan2(az, ax);
    parts.push({
      id: `arm-${c.tag}`,
      kind: "frame",
      assembled: { position: [ax / 2, 0, az / 2], rotation: [0, -angle, 0] },
      exploded: explode([ax / 2, 0, az / 2], 7),
      assembleAt: [0.15 + stagger, 0.4 + stagger],
    });

    // Motor can at the end of the arm
    parts.push({
      id: `motor-${c.tag}`,
      kind: "motor",
      assembled: { position: [ax, MOTOR_Y, az] },
      exploded: explode([ax, MOTOR_Y, az], 9),
      assembleAt: [0.22 + stagger, 0.46 + stagger],
    });

    // Rotor disc above the motor (instanced visually; spins during ignition)
    parts.push({
      id: `rotor-${c.tag}`,
      kind: "rotor",
      assembled: { position: [ax, MOTOR_Y + 0.16, az] },
      exploded: explode([ax, MOTOR_Y + 0.16, az], 11, [0, 3, 0]),
      assembleAt: [0.3 + stagger, 0.52 + stagger],
    });

    // Status LED sensor near each motor
    parts.push({
      id: `led-${c.tag}`,
      kind: "sensor",
      emissive: true,
      assembled: { position: [ax * 0.92, MOTOR_Y - 0.02, az * 0.92], scale: [0.5, 0.5, 0.5] },
      exploded: explode([ax * 0.92, MOTOR_Y, az * 0.92], 6),
      assembleAt: [0.34 + stagger, 0.5 + stagger],
    });
  });

  // Landing gear (two skids)
  [-1, 1].forEach((s, i) => {
    parts.push({
      id: `gear-${i}`,
      kind: "gear",
      assembled: { position: [s * 0.55, -0.55, 0] },
      exploded: explode([s * 0.55, -0.55, 0], 7, [0, -4, 0]),
      assembleAt: [0.18 + i * 0.05, 0.44 + i * 0.05],
    });
  });

  // Pressure boom extends forward (+z toward camera) ending in the nozzle.
  parts.push({
    id: "boom",
    kind: "boom",
    assembled: { position: [0, -0.18, 1.05] },
    exploded: explode([0, -0.18, 1.05], 8, [-3, -2, 4]),
    assembleAt: [0.4, 0.62],
  });

  // Nozzle — the jet origin. Lands LAST so the craft is complete before firing.
  parts.push({
    id: "nozzle",
    kind: "nozzle",
    emissive: true,
    assembled: { position: [0, -0.18, 1.85] },
    exploded: explode([0, -0.18, 1.85], 10, [2, -3, 6]),
    assembleAt: [0.5, 0.72],
  });

  // Forward sensor pod
  parts.push({
    id: "sensor-fwd",
    kind: "sensor",
    emissive: true,
    assembled: { position: [0, 0.05, 0.78], scale: [0.7, 0.7, 0.7] },
    exploded: explode([0, 0.05, 0.78], 7, [-2, 2, 3]),
    assembleAt: [0.36, 0.56],
  });

  return parts;
}

export const DRONE_PARTS: PartSpec[] = buildParts();

/** World-space position the spray jet emits from (the nozzle tip). */
export const NOZZLE_TIP = new THREE.Vector3(0, -0.18, 2.05);
/** Direction the jet travels (toward camera / +z, angled slightly up). */
export const NOZZLE_DIR = new THREE.Vector3(0, 0.12, 1).normalize();
