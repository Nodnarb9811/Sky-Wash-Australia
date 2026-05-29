import { Environment, Lightformer } from "@react-three/drei";

/**
 * Dark studio rig with a cyan rim. The reflective environment is built from
 * Lightformers (no external HDRI fetch — fully self-contained and offline-safe)
 * so the dark metal has something premium to reflect.
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.18} />

      {/* Key light, cool white from upper-right */}
      <directionalLight position={[6, 8, 4]} intensity={1.4} color="#dfeef5" />
      {/* Fill, soft from the left */}
      <directionalLight position={[-7, 2, 3]} intensity={0.4} color="#9fb4bd" />
      {/* Cyan rim from behind */}
      <pointLight position={[-2, 1.5, -6]} intensity={28} distance={22} decay={2} color="#1FB6D6" />

      <Environment resolution={256} frames={1}>
        {/* Large soft top panel */}
        <Lightformer
          form="rect"
          intensity={1.6}
          position={[0, 6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[12, 12, 1]}
          color="#cdd9df"
        />
        {/* Cool streaks for metallic highlights */}
        <Lightformer form="rect" intensity={2.2} position={[5, 2, 3]} scale={[1, 6, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.4} position={[-5, 1, 2]} scale={[1, 5, 1]} color="#7fdcef" />
        {/* Cyan accent ring behind */}
        <Lightformer form="ring" intensity={2.0} position={[-3, 0, -5]} scale={[3, 3, 1]} color="#1FB6D6" />
      </Environment>
    </>
  );
}
