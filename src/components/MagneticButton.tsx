import { useRef, type ReactNode, type MouseEvent, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  className?: string;
  type?: "button" | "submit";
  "aria-label"?: string;
}

/**
 * Affordant, magnetic CTA. Gently pulls toward the cursor on hover (pointer,
 * non-reduced-motion only). Keyboard accessible with a visible focus ring.
 */
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
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-medium tracking-wide transition-[transform,background-color,color] duration-300 ease-cine will-change-transform";
  const styles =
    variant === "solid"
      ? "bg-cyan text-void hover:bg-cyan-soft"
      : "border border-white/25 text-paper hover:border-cyan hover:text-cyan";

  const content = (
    <>
      <span>{children}</span>
      <span aria-hidden className="transition-transform duration-300 ease-cine group-hover:translate-x-1">
        →
      </span>
    </>
  );

  const className_ = `${base} ${styles} ${className}`;

  if (href) {
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        className={className_}
        onMouseMove={onMove}
        onMouseLeave={reset}
        {...rest}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={className_}
      onMouseMove={onMove}
      onMouseLeave={reset}
      {...rest}
    >
      {content}
    </button>
  );
}
