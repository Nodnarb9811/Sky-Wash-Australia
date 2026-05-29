import { Reveal } from "@/components/Reveal";
import { Kicker } from "@/components/Kicker";
import { WHAT } from "@/lib/content";

/** 1 — What it is. One bold sentence, generous negative space. */
export function WhatItIs() {
  return (
    <section id="what" className="relative bg-void py-32 md:py-44">
      <div className="shell">
        <Reveal>
          <Kicker>{WHAT.kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          {/* TODO: final copy */}
          <h2 className="mt-8 max-w-5xl text-balance text-display-md font-semibold text-paper">
            {WHAT.headline}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-10 max-w-prose text-lead font-sans text-mist">{WHAT.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
