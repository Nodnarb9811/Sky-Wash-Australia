import * as THREE from "three";
import { ACTS } from "@/lib/acts";
import { clamp, lerp, easeInOutCubic } from "@/lib/easing";

/**
 * The drone's world anchor. <Drone> writes its position here each frame and
 * <CameraRig> reads it as the lookAt target, so the camera always frames the
 * craft no matter how the ascent is retimed.
 */
export const droneAnchor = new THREE.Vector3(0, 0, 0);

/** Drone vertical position as a function of master progress (the ascent). */
export function droneHeight(p: number): number {
  if (p <= ACTS.ascent.start) return 0;
  if (p < ACTS.ascent.end) {
    const t = easeInOutCubic((p - ACTS.ascent.start) / (ACTS.ascent.end - ACTS.ascent.start));
    return lerp(0, 10, t);
  }
  if (p < ACTS.altitude.start) {
    const t = (p - ACTS.wash.start) / (ACTS.wash.end - ACTS.wash.start);
    return lerp(10, 11, clamp(t));
  }
  const t = (p - ACTS.altitude.start) / (ACTS.altitude.end - ACTS.altitude.start);
  return lerp(11, 11.6, clamp(t));
}
