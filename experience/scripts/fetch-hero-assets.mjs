#!/usr/bin/env node
/**
 * Downloads the generated photoreal fallback assets into public/hero/.
 * Run on a machine with open network (locally, or as a deploy prebuild step):
 *   npm run fetch:hero
 * Edit scripts/hero-assets.json to point at fresh URLs if a link expires.
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const manifest = JSON.parse(await readFile(join(here, "hero-assets.json"), "utf8"));
const outDir = resolve(root, manifest.outputDir);
await mkdir(outDir, { recursive: true });

let ok = 0, skipped = 0, failed = 0;
for (const a of manifest.assets) {
  const dest = join(outDir, a.file);
  if (!a.url) { console.warn(`• ${a.file}: no URL yet — skipping`); skipped++; continue; }
  try {
    process.stdout.write(`↓ ${a.file} … `);
    const res = await fetch(a.url);
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
console.log(`\nHero assets → ${manifest.outputDir} (${ok} downloaded, ${skipped} pending, ${failed} failed)`);
process.exit(failed > 0 ? 1 : 0);
