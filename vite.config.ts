import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    // NOTE: no manualChunks. The hero scene is loaded via dynamic import() in
    // src/components/Hero.tsx, so Vite automatically code-splits Three.js / R3F
    // (and their exclusive deps) into async chunks that are NOT preloaded on
    // initial load — phones and reduced-motion users never download them.
    chunkSizeWarningLimit: 800,
  },
});
