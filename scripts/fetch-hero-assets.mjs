#!/usr/bin/env node
/**
 * Downloads the generated photoreal hero assets into public/hero/.
 *
 * Why this exists: the hero drone visuals are AI-generated and live on a CDN.
 * They are intentionally NOT committed to the repo (binary, regenerable, and
 * the build sandbox can't reach the CDN). Run this on any machine with open
 * network — locally before `npm run dev`, or as a deploy/CI prebuild step.
 *
 *   npm run fetch:hero
 *
 * Edit scripts/hero-assets.json to point at fresh URLs (re-export from your
 * generator library if a link has expired).
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const manifest = JSON.parse(await readFile(join(__dirname, "hero-assets.json"), "utf8"));
const outDir = resolve(root, manifest.outputDir);
await mkdir(outDir, { recursive: true });

let ok = 0;
let skipped = 0;
let failed = 0;

for (const asset of manifest.assets) {
  const dest = join(outDir, asset.file);
  if (!asset.url) {
    console.warn(`• ${asset.file}: no URL in manifest yet — skipping`);
    skipped++;
    continue;
  }
  try {
    process.stdout.write(`↓ ${asset.file} … `);
    const res = await fetch(asset.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    console.log(`${(buf.length / 1024).toFixed(0)} KB ✓`);
    ok++;
  } catch (err) {
    console.error(`FAILED (${err.message})`);
    failed++;
  }
}

console.log(`\nHero assets → ${manifest.outputDir}  (${ok} downloaded, ${skipped} pending, ${failed} failed)`);
if (existsSync(join(outDir, "drone-assembled.png"))) {
  console.log("Ready: the hero will use these automatically.");
}
process.exit(failed > 0 ? 1 : 0);
