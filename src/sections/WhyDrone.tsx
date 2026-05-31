import { Reveal } from "@/components/Reveal";
import { Kicker } from "@/components/Kicker";
import { WHY_DRONE } from "@/lib/content";

/** 2 — The problem / why drone. Old way vs. Sky Wash way, split contrast. */
export function WhyDrone() {
  return (
    <section className="relative bg-void-2 py-32 md:py-44">
      <div className="shell">
        <Reveal>
          <Kicker>{WHY_DRONE.kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-8 max-w-3xl text-display-sm font-semibold text-paper">{WHY_DRONE.headline}</h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {/* Old way */}
          <Reveal delay={0.05}>
            <div className="h-full rounded-2xl border border-white/8 bg-white/[0.02] p-8 md:p-10">
              <h3 className="font-display text-sm uppercase tracking-[0.18em] text-mist/70">
                {WHY_DRONE.oldWay.title}
              </h3>
              <ul className="mt-7 space-y-4">
                {WHY_DRONE.oldWay.points.map((p) => (
                  <li key={p} className="flex gap-3 font-sans text-mist">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mist/40" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Sky Wash way */}
          <Reveal delay={0.12}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-cyan/30 bg-gradient-to-b from-cyan/10 to-transparent p-8 md:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan/20 blur-3xl"
              />
              <h3 className="font-display text-sm uppercase tracking-[0.18em] text-cyan">
                {WHY_DRONE.skyWay.title}
              </h3>
              <ul className="mt-7 space-y-4">
                {WHY_DRONE.skyWay.points.map((p) => (
                  <li key={p} className="flex gap-3 font-sans text-paper">
                    <span aria-hidden className="mt-1.5 text-cyan">
                      ↗
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
