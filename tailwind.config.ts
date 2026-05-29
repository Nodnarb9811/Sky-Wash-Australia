import type { Config } from "tailwindcss";

/**
 * Brand tokens are defined as CSS variables in src/styles/globals.css and
 * surfaced here so they can be used as Tailwind utilities (e.g. `text-cyan`,
 * `bg-void`). Edit the palette in ONE place: globals.css `:root`.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "var(--c-void)",
        "void-2": "var(--c-void-2)",
        ink: "var(--c-ink)",
        paper: "var(--c-paper)",
        cyan: "var(--c-cyan)",
        "cyan-soft": "var(--c-cyan-soft)",
        teal: "var(--c-teal)",
        "teal-deep": "var(--c-teal-deep)",
        mist: "var(--c-mist)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Fluid, cinematic type scale (clamp min / preferred / max)
        kicker: ["clamp(0.72rem, 0.68rem + 0.2vw, 0.85rem)", { lineHeight: "1.4", letterSpacing: "0.28em" }],
        "display-sm": ["clamp(1.9rem, 1.4rem + 2.4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2.6rem, 1.8rem + 4vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(3.2rem, 2rem + 6.5vw, 8.5rem)", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        lead: ["clamp(1.05rem, 0.98rem + 0.5vw, 1.35rem)", { lineHeight: "1.6" }],
      },
      maxWidth: {
        shell: "1280px",
        prose: "62ch",
      },
      transitionTimingFunction: {
        // Weighted, cinematic easings (mirrors src/lib/easing.ts)
        cine: "cubic-bezier(0.16, 1, 0.3, 1)",
        "cine-in": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
