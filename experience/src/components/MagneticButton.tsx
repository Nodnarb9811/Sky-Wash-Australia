"use client";

import { useRef, type ReactNode, type MouseEvent, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/hooks/useExperienceHooks";

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  className?: string;
  type?: "button" | "submit";
  "aria-label"?: string;
}

/** Affordant magnetic CTA — pulls toward the cursor (pointer, non-reduced only). */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "solid",
  className = "",
  type = "button",
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const onMove = (e: MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.22}px, ${(e.clientY - (r.top + r.height / 2)) * 0.3}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const cls = `group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-medium tracking-wide transition-[transform,background-color,color] duration-300 ease-cine will-change-transform ${
    variant === "solid" ? "bg-cyan text-void hover:bg-cyan-soft" : "border border-paper/30 text-paper hover:border-cyan hover:text-cyan"
  } ${className}`;

  const inner = (
    <>
      <span>{children}</span>
      <span aria-hidden className="transition-transform duration-300 ease-cine group-hover:translate-x-1">→</span>
    </>
  );

  if (href) {
    return (
      <a ref={ref as RefObject<HTMLAnchorElement>} href={href} className={cls} onMouseMove={onMove} onMouseLeave={reset} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref as RefObject<HTMLButtonElement>} type={type} onClick={onClick} className={cls} onMouseMove={onMove} onMouseLeave={reset} {...rest}>
      {inner}
    </button>
  );
}
