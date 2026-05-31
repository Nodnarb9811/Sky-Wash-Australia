import { Reveal } from "../Reveal";
import { KickerLabel } from "../KickerLabel";
import { WHAT } from "@/lib/content";

export function WhatItIs() {
  return (
    <section id="what" className="relative bg-void py-32 md:py-44">
      <div className="shell">
        <Reveal><KickerLabel>{WHAT.kicker}</KickerLabel></Reveal>
        <Reveal delay={0.05}>
          {/* TODO: final copy */}
          <h2 className="mt-8 max-w-5xl text-balance text-display-md font-semibold text-paper">{WHAT.headline}</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-10 max-w-prose text-lead font-sans text-mist">{WHAT.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
