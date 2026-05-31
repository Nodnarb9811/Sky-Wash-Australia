import { Reveal } from "../Reveal";
import { KickerLabel } from "../KickerLabel";
import { SERVICES } from "@/lib/content";

const ICONS = [
  "M3 12 12 5l9 7M6 11v8h12v-8",
  "M5 21V4h14v17M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2",
  "M4 16h16l-2-9H6zM9 7v9M15 7v9M4 12h16",
  "M3 8h18v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM7 17v3M17 17v3",
  "M4 21V6l8-3 8 3v15M9 9h2M13 9h2M9 13h2M13 13h2",
  "M4 17h16l-3 4H7zM12 3v11M12 6l5 2-5 2-5-2z",
];

export function Services() {
  return (
    <section id="services" className="relative bg-murk py-32 md:py-44">
      <div className="shell">
        <Reveal><KickerLabel>{SERVICES.kicker}</KickerLabel></Reveal>
        <Reveal delay={0.05}><h2 className="mt-8 max-w-3xl text-display-sm font-semibold text-paper">{SERVICES.headline}</h2></Reveal>
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.items.map((s, i) => (
            <Reveal key={s.title} delay={0.04 * i} className="h-full">
              <article className="group relative h-full bg-void p-8 transition-colors duration-500 hover:bg-ink">
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-cyan transition-transform duration-500 ease-cine group-hover:scale-x-100" />
                <svg viewBox="0 0 24 24" className="h-9 w-9 text-cyan" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={ICONS[i % ICONS.length]} />
                </svg>
                <h3 className="mt-7 font-display text-xl font-medium text-paper">{s.title}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-mist">{s.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col items-start gap-5 border-t border-paper/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-display text-kicker uppercase text-mist/70">{SERVICES.comingSoon.label}</span>
            <ul className="flex flex-wrap gap-3">
              {SERVICES.comingSoon.items.map((c) => (
                <li key={c} className="rounded-full border border-paper/15 px-4 py-1.5 font-display text-sm text-mist">{c}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
