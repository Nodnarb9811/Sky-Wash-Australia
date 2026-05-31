import { Reveal } from "../Reveal";
import { KickerLabel } from "../KickerLabel";
import { WHY_US } from "@/lib/content";

export function WhyUs() {
  return (
    <section className="relative bg-void py-32 md:py-44">
      <div className="shell">
        <Reveal><KickerLabel>{WHY_US.kicker}</KickerLabel></Reveal>
        <Reveal delay={0.05}><h2 className="mt-8 max-w-3xl text-display-sm font-semibold text-paper">{WHY_US.headline}</h2></Reveal>
        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {WHY_US.items.map((it, i) => (
            <Reveal key={it.label} delay={0.06 * i}>
              <div className="border-t border-paper/12 pt-6">
                <div className="font-display text-display-sm font-bold text-gleam">{it.stat}</div>
                <div className="mt-3 font-sans text-sm leading-relaxed text-mist">{it.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
