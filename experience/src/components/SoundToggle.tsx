"use client";

import { useExperience } from "@/lib/store";
import { audio } from "@/lib/audio";
import { useExperienceProgress } from "@/hooks/useExperienceHooks";
import { moodFromProgress } from "@/lib/acts";

/** Drives the audio mix from the film each frame (no-op until enabled). */
export function AudioDriver() {
  useExperienceProgress((p) => audio.update(p, moodFromProgress(p)));
  return null;
}

/** Visible, tasteful mute toggle. Sound starts off (autoplay policy); this invites it in. */
export function SoundToggle() {
  const muted = useExperience((s) => s.muted);
  const toggle = useExperience((s) => s.toggleMuted);

  const onClick = () => {
    audio.setEnabled(muted); // if currently muted, enabling
    toggle();
  };

  return (
    <button
      onClick={onClick}
      aria-pressed={!muted}
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      className="fixed bottom-6 right-6 z-[65] flex items-center gap-2 rounded-full border border-paper/20 bg-void/50 px-4 py-2.5 font-display text-kicker uppercase text-paper/80 backdrop-blur-md transition-colors duration-300 hover:border-cyan hover:text-cyan"
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-[2px] bg-current transition-all duration-300 ${muted ? "h-[3px]" : ""}`}
            style={muted ? undefined : { height: `${6 + i * 3}px` }}
          />
        ))}
      </span>
      {muted ? "Sound off" : "Sound on"}
    </button>
  );
}
