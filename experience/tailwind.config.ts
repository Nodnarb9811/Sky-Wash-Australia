import type { Config } from "tailwindcss";

/**
 * Brand tokens are CSS variables in app/globals.css (single source of truth).
 * The two-world palette — MURK (cold, heavy) and CLARITY (luminous, coastal) —
 * is graded in 3D via an animated LUT; these tokens drive the DOM/UI layer.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "var(--c-void)",
        murk: "var(--c-murk)",
        grime: "var(--c-grime)",
        ink: "var(--c-ink)",
        paper: "var(--c-paper)",
        mist: "var(--c-mist)",
        cyan: "var(--c-cyan)",
        "cyan-soft": "var(--c-cyan-soft)",
        teal: "var(--c-teal)",
        "teal-deep": "var(--c-teal-deep)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        kicker: ["clamp(0.72rem, 0.68rem + 0.2vw, 0.85rem)", { lineHeight: "1.4", letterSpacing: "0.3em" }],
        "display-sm": ["clamp(1.9rem, 1.4rem + 2.4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2.6rem, 1.8rem + 4vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(3.2rem, 2rem + 6.5vw, 9rem)", { lineHeight: "0.96", letterSpacing: "-0.04em" }],
        lead: ["clamp(1.05rem, 0.98rem + 0.5vw, 1.4rem)", { lineHeight: "1.6" }],
      },
      maxWidth: { shell: "1320px", prose: "60ch" },
      transitionTimingFunction: {
        cine: "cubic-bezier(0.16, 1, 0.3, 1)",
        "cine-in": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
    },
  },
  plugins: [],
};

export default config;
