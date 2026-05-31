import { NAV_LINKS, FOOTER, BRAND } from "@/lib/content";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-void py-16">
      <div className="shell">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <a href="#top" className="flex items-center gap-2.5" aria-label={`${BRAND.name} home`}>
              <Logo className="h-7 w-7" />
              <span className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-paper">
                {BRAND.name}
              </span>
            </a>
            <p className="mt-5 font-sans text-sm leading-relaxed text-mist">
              Premium drone-powered exterior cleaning. {BRAND.region}.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="font-sans text-sm text-mist hover:text-paper">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            {FOOTER.socials.map((s) => (
              <a key={s.label} href={s.href} className="font-sans text-sm text-mist hover:text-paper">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/8 pt-8 text-xs text-mist/60 sm:flex-row sm:items-center sm:justify-between">
          {/* TODO: real ABN / credentials */}
          <span>{FOOTER.credentials}</span>
          <span>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
