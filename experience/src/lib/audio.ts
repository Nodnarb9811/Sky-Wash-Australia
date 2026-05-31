import { Howl, Howler } from "howler";

/**
 * Sound design manager. Layered ambience that follows the film:
 *   - murk hum (Acts I–III), rising whoosh (ascent), high-pressure hit (wash),
 *     airy clarity pad (Act V), soft UI ticks.
 *
 * Starts MUTED (autoplay policy); a visible toggle invites the user in.
 * Every layer is OPTIONAL — if the asset file is missing it silently no-ops,
 * so the experience never breaks while audio is still TODO.
 *
 * TODO: drop royalty-free / licensed audio into experience/public/audio:
 *   hum.mp3, whoosh.mp3, wash-hit.mp3, clarity-pad.mp3, tick.mp3
 */

type LayerName = "hum" | "whoosh" | "pad";

interface Layer {
  howl: Howl;
  base: number; // target volume when fully active
  loaded: boolean;
}

class AudioManager {
  private layers: Partial<Record<LayerName, Layer>> = {};
  private oneShots: Partial<Record<"washHit" | "tick", Howl>> = {};
  private started = false;
  private enabled = false;
  private washFired = false;

  private make(src: string, opts: { loop?: boolean; volume?: number }) {
    return new Howl({
      src: [src],
      loop: opts.loop ?? false,
      volume: 0,
      html5: false,
      preload: true,
      onloaderror: () => {
        /* asset not present yet — layer stays silent */
      },
    });
  }

  /** Build the graph. Call once after first user gesture (browser requirement). */
  init() {
    if (this.started || typeof window === "undefined") return;
    this.started = true;

    const loop = (name: LayerName, src: string, base: number) => {
      const howl = this.make(src, { loop: true });
      const layer: Layer = { howl, base, loaded: false };
      howl.once("load", () => {
        layer.loaded = true;
        howl.play();
      });
      this.layers[name] = layer;
    };

    loop("hum", "/audio/hum.mp3", 0.5);
    loop("whoosh", "/audio/whoosh.mp3", 0.6);
    loop("pad", "/audio/clarity-pad.mp3", 0.45);

    this.oneShots.washHit = this.make("/audio/wash-hit.mp3", { volume: 1 });
    this.oneShots.tick = this.make("/audio/tick.mp3", { volume: 0.3 });

    Howler.mute(!this.enabled);
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (on) this.init();
    Howler.mute(!on);
  }

  tick() {
    if (!this.enabled) return;
    this.oneShots.tick?.volume(0.25);
    this.oneShots.tick?.play();
  }

  /**
   * Drive the mix from the film. progress 0..1; mood 0(murk)..1(clarity).
   */
  update(progress: number, mood: number) {
    if (!this.enabled || !this.started) return;
    const setVol = (name: LayerName, v: number) => {
      const l = this.layers[name];
      if (l?.loaded) l.howl.volume(Math.max(0, Math.min(1, v)) * l.base);
    };

    // Hum dominates the murk, fades as we clean up.
    setVol("hum", (1 - mood) * (progress < 0.05 ? progress / 0.05 : 1));
    // Whoosh peaks across the ascent (0.45–0.65).
    const ascent = Math.sin(Math.max(0, Math.min(1, (progress - 0.45) / 0.2)) * Math.PI);
    setVol("whoosh", ascent);
    // Clarity pad rises with mood.
    setVol("pad", mood);

    // Fire the wash hit once, at the threshold.
    if (!this.washFired && progress >= 0.66) {
      this.washFired = true;
      this.oneShots.washHit?.play();
    }
    if (progress < 0.6) this.washFired = false; // re-arm if scrolled back up
  }
}

export const audio = new AudioManager();
