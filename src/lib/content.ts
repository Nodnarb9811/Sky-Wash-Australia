/**
 * ===========================================================================
 * SITE COPY — single source of truth for all marketing text.
 * All strings are placeholder-quality direction. Replace before launch.
 * Search this file for `TODO` to find everything that must be finalised.
 * ===========================================================================
 */

export const BRAND = {
  name: "Sky Wash Australia",
  shortName: "Sky Wash",
  region: "Mornington Peninsula, Victoria",
  // TODO: final contact details
  phone: "+61 000 000 000",
  email: "hello@skywashaustralia.com.au",
  abn: "ABN 00 000 000 000", // TODO: real ABN
  droneWeightKg: 24.8,
};

export const NAV_LINKS = [
  { label: "What we do", href: "#what" },
  { label: "Services", href: "#services" },
  { label: "Story", href: "#story" },
  { label: "Contact", href: "#contact" },
];

export const HERO = {
  kicker: "Precision from above", // beat 1 cold-open line
  wordmarkTop: "SKY WASH",
  wordmarkBottom: "AUSTRALIA",
  // TODO: final tagline
  tagline: "Exterior cleaning, reimagined from the sky.",
  cta: "Get a quote",
  scrollCue: "Scroll to continue",
};

// 1 — What it is
export const WHAT = {
  kicker: "What it is",
  // TODO: final copy
  headline: "Exterior cleaning, reimagined from the sky.",
  body: "A purpose-built pressure-washing aircraft, flown by a CASA-certified operator, restoring roofs, facades and hard-to-reach surfaces across the Mornington Peninsula — without a single ladder touching your property.",
};

// 2 — The problem / why drone
export const WHY_DRONE = {
  kicker: "Why drone",
  headline: "The old way is slow, risky and limited.",
  oldWay: {
    title: "Ladders & scaffolding",
    points: [
      "Hours of setup before a drop of water is sprayed",
      "Falls remain the leading cause of serious site injury",
      "Steep roofs, multi-storey facades and tight rooflines left untouched",
    ],
  },
  skyWay: {
    title: "The Sky Wash way",
    points: [
      "Airborne in minutes — no rigging, no access equipment",
      "Operators stay safely on the ground, every time",
      "Every surface reached, from ridge cap to render to solar array",
    ],
  },
};

// 3 — The story
export const STORY = {
  kicker: "The story",
  // TODO: final founder copy
  headline: "Built on the Peninsula. First of its kind.",
  body: [
    "Sky Wash Australia began with a simple frustration: the best homes on the Mornington Peninsula were the hardest — and most dangerous — to keep clean.",
    `So we engineered the answer. A ${BRAND.droneWeightKg} kg purpose-built cleaning aircraft, designed from the rotor up to carry water, pressure and precision to places ladders were never meant to go.`,
    "As the region's first-mover in drone exterior cleaning, we're local operators with aerospace standards — and a deep respect for the coastline we call home.",
  ],
  stat: { value: `${BRAND.droneWeightKg} kg`, label: "purpose-built cleaning aircraft" },
};

// 4 — Services
export const SERVICES = {
  kicker: "Services",
  headline: "Every exterior surface. Cleaned from above.",
  items: [
    { title: "Roof cleaning", desc: "Tile, metal and Colorbond roofs restored — no foot traffic, no broken tiles." },
    { title: "Facades & render", desc: "Multi-storey facades, render and cladding washed evenly, top to bottom." },
    { title: "Solar arrays", desc: "Gentle, precise cleaning that restores panel output without abrasion." },
    { title: "Gutters", desc: "Cleared and flushed from above — no ladders against the fascia." },
    { title: "Commercial buildings", desc: "Large-format exteriors and signage handled with minimal disruption." },
    { title: "Marine & yacht", desc: "Salt and grime lifted from hulls, masts and superstructure." },
  ],
  comingSoon: {
    label: "Expansion divisions — coming soon",
    items: ["Skyinspect", "Skyfarm", "Skysurvey"],
  },
};

// 5 — Why Sky Wash (credibility)
export const WHY_US = {
  kicker: "Why Sky Wash",
  headline: "Aerospace standards. Local precision.",
  items: [
    { stat: "CASA", label: "Certified remote operator" },
    { stat: "100%", label: "Fully insured operation" },
    { stat: "0", label: "Ladders, ever" },
    { stat: "1st", label: "On the Peninsula" },
  ],
};

// 6 — Process
export const PROCESS = {
  kicker: "The process",
  headline: "Four steps to spotless.",
  steps: [
    { n: "01", title: "Assess", desc: "We survey your property from the ground and air to map every surface and risk." },
    { n: "02", title: "Plan", desc: "A precise flight and cleaning plan, tailored to your surfaces and schedule." },
    { n: "03", title: "Clean from above", desc: "Our drone delivers controlled pressure exactly where it's needed." },
    { n: "04", title: "Spotless", desc: "A restored exterior — verified, documented and ladder-free." },
  ],
};

// 7 — Contact / CTA
export const CONTACT = {
  kicker: "Get started",
  headline: "Book your free site assessment.",
  body: "Tell us about your property and we'll map a plan from the sky.",
  serviceArea: `Proudly serving the ${BRAND.region} and surrounds.`,
  serviceTypes: [
    "Roof cleaning",
    "Facade & render",
    "Solar arrays",
    "Gutters",
    "Commercial building",
    "Marine / yacht",
    "Something else",
  ],
};

export const FOOTER = {
  // TODO: real socials
  socials: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Facebook", href: "#" },
  ],
  credentials: `CASA-certified · Fully insured · ${BRAND.abn}`,
};
