import { Reveal } from "@/components/Reveal";
import { Kicker } from "@/components/Kicker";
import { PROCESS } from "@/lib/content";

/** 6 — Process. Animated stepper, 4 steps. */
export function Process() {
  return (
    <section className="relative bg-void-2 py-32 md:py-44">
      <div className="shell">
        <Reveal>
          <Kicker>{PROCESS.kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-8 max-w-3xl text-display-sm font-semibold text-paper">{PROCESS.headline}</h2>
        </Reveal>

        <div
          role="list"
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4"
        >
          {PROCESS.steps.map((step, i) => (
            <Reveal key={step.n} delay={0.08 * i} role="listitem" className="group relative h-full bg-void p-8">
              <span className="font-display text-sm font-medium text-cyan">{step.n}</span>
              <span
                aria-hidden
                className="mt-4 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-cyan to-transparent transition-transform duration-700 ease-cine group-hover:scale-x-100 md:scale-x-100 md:from-cyan/40"
              />
              <h3 className="mt-6 font-display text-xl font-medium text-paper">{step.title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-mist">{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
