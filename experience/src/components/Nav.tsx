"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS, BRAND, HERO } from "@/lib/content";
import { MagneticButton } from "./MagneticButton";
import { Logo } from "./Logo";

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-cine ${solid ? "border-b border-paper/10 bg-void/80 backdrop-blur-md" : "border-b border-transparent"}`}>
      <nav className="shell flex h-[72px] items-center justify-between" aria-label="Primary">
        <a href="#top" className="flex items-center gap-2.5" aria-label={`${BRAND.name} home`}>
          <Logo className="h-7 w-7" />
          <span className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-paper">{BRAND.shortName}</span>
        </a>
        <ul className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="font-sans text-sm text-mist transition-colors duration-300 hover:text-paper">{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <MagneticButton href="#contact" className="px-5 py-2.5 text-[13px]">{HERO.cta}</MagneticButton>
        </div>
        <button className="flex h-10 w-10 items-center justify-center md:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
          <span className="relative block h-4 w-6">
            <span className={`absolute left-0 top-0 h-0.5 w-6 bg-paper transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-[7px] h-0.5 w-6 bg-paper transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-[14px] h-0.5 w-6 bg-paper transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" className="border-t border-paper/10 bg-void/95 backdrop-blur-md md:hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            <ul className="shell flex flex-col gap-1 py-4">
              {NAV_LINKS.map((l) => (
                <li key={l.href}><a href={l.href} onClick={() => setOpen(false)} className="block py-3 font-display text-lg text-paper">{l.label}</a></li>
              ))}
              <li className="pt-3"><MagneticButton href="#contact" onClick={() => setOpen(false)}>{HERO.cta}</MagneticButton></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
