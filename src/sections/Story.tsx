import { Reveal } from "@/components/Reveal";
import { Kicker } from "@/components/Kicker";
import { STORY } from "@/lib/content";

/** 3 — The story. Origin-story tone; founder copy is a TODO. */
export function Story() {
  return (
    <section id="story" className="relative bg-void py-32 md:py-44">
      <div className="shell grid gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <Reveal>
            <Kicker>{STORY.kicker}</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-8 text-display-sm font-semibold text-paper">{STORY.headline}</h2>
          </Reveal>
          <div className="mt-10 space-y-6">
            {/* TODO: final founder copy */}
            {STORY.body.map((para, i) => (
              <Reveal key={i} delay={0.1 + i * 0.06}>
                <p className="max-w-prose text-lead font-sans text-mist">{para}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="md:col-span-5">
          <Reveal delay={0.15}>
            <div className="relative flex h-full min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-teal-deep/40 via-void-2 to-void p-8 md:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-cyan/15 blur-3xl"
              />
              {/* TODO: replace with founder portrait / first-flight photo */}
              <span className="font-display text-display-md font-bold text-gleam">{STORY.stat.value}</span>
              <span className="mt-2 font-sans text-sm uppercase tracking-[0.15em] text-mist">
                {STORY.stat.label}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
