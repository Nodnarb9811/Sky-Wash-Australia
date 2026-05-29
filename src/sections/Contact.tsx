import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/Reveal";
import { Kicker } from "@/components/Kicker";
import { MagneticButton } from "@/components/MagneticButton";
import { CONTACT, BRAND } from "@/lib/content";

const inputBase =
  "w-full rounded-lg border border-white/12 bg-white/[0.03] px-4 py-3 font-sans text-paper placeholder:text-mist/50 transition-colors duration-300 focus:border-cyan focus:bg-white/[0.05] focus:outline-none";

/** 7 — CTA / contact. Quote form + service-area note. */
export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire to a real backend / form service (e.g. Formspree, API route).
    setSent(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-void py-32 md:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-[40rem] w-[40rem] rounded-full bg-cyan/10 blur-[120px]"
      />
      <div className="shell grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <Kicker>{CONTACT.kicker}</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-8 text-display-sm font-semibold text-paper">{CONTACT.headline}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-prose text-lead font-sans text-mist">{CONTACT.body}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="mt-10 space-y-4 font-sans text-sm">
              <div>
                <dt className="text-mist/60">Call</dt>
                <dd>
                  <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="text-paper hover:text-cyan">
                    {BRAND.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-mist/60">Email</dt>
                <dd>
                  <a href={`mailto:${BRAND.email}`} className="text-paper hover:text-cyan">
                    {BRAND.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-mist/60">Service area</dt>
                <dd className="text-paper">{CONTACT.serviceArea}</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <Reveal delay={0.1}>
            {sent ? (
              <div
                className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-cyan/30 bg-cyan/[0.04] p-10 text-center"
                role="status"
              >
                <div className="font-display text-display-sm text-gleam">Thank you.</div>
                <p className="mt-4 max-w-sm font-sans text-mist">
                  We&apos;ve received your request and will be in touch shortly to arrange your free site
                  assessment.
                </p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 md:p-10"
                noValidate
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="name" label="Name" autoComplete="name" required />
                  <Field id="email" label="Email" type="email" autoComplete="email" required />
                  <Field id="phone" label="Phone" type="tel" autoComplete="tel" />
                  <Field id="suburb" label="Address / suburb" autoComplete="address-level2" />
                </div>

                <div className="mt-5">
                  <label htmlFor="service" className="mb-2 block font-sans text-sm text-mist">
                    Service type
                  </label>
                  <select id="service" name="service" className={inputBase} defaultValue="">
                    <option value="" disabled>
                      Select a service…
                    </option>
                    {CONTACT.serviceTypes.map((s) => (
                      <option key={s} value={s} className="bg-void">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-5">
                  <label htmlFor="message" className="mb-2 block font-sans text-sm text-mist">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className={inputBase}
                    placeholder="Tell us about your property…"
                  />
                </div>

                <div className="mt-8">
                  <MagneticButton type="submit" aria-label="Send quote request">
                    Request assessment
                  </MagneticButton>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}

function Field({ id, label, type = "text", required, autoComplete }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-sans text-sm text-mist">
        {label}
        {required && <span className="text-cyan"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={inputBase}
      />
    </div>
  );
}
