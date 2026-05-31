"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_CINE } from "@/lib/easing";

interface Props extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: ReactNode;
  delay?: number;
  y?: number;
}

/** Reveal-on-scroll: fade + rise, eased. Respects reduced motion via MotionConfig. */
export function Reveal({ children, delay = 0, y = 32, className, ...rest }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.85, ease: EASE_CINE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
