"use client";

import { useEffect, useRef } from "react";

/**
 * Custom precision targeting reticle (fits the aircraft theme). Follows the
 * pointer with easing, expands over interactive elements. Fine-pointer only —
 * touch devices keep the native cursor (we never add the hiding class).
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("has-custom-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;
    let hovering = false;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement;
      hovering = !!t.closest("a, button, input, select, textarea, [role='button']");
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      if (ring.current) {
        ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%) scale(${hovering ? 1.8 : 1})`;
        ring.current.style.borderColor = hovering ? "var(--c-cyan)" : "rgba(127,220,239,0.5)";
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden [@media(pointer:fine)]:block" aria-hidden="true">
      <div ref={ring} className="absolute left-0 top-0 h-8 w-8 rounded-full border transition-[border-color] duration-200" style={{ borderColor: "rgba(127,220,239,0.5)" }} />
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-cyan" />
    </div>
  );
}
