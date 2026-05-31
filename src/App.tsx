import { MotionConfig } from "framer-motion";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Footer } from "@/components/Footer";
import { WhatItIs } from "@/sections/WhatItIs";
import { WhyDrone } from "@/sections/WhyDrone";
import { Story } from "@/sections/Story";
import { Services } from "@/sections/Services";
import { WhyUs } from "@/sections/WhyUs";
import { Process } from "@/sections/Process";
import { Contact } from "@/sections/Contact";

export default function App() {
  useSmoothScroll();

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#what"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-cyan focus:px-5 focus:py-2 focus:font-display focus:text-sm focus:text-void"
      >
        Skip to content
      </a>

      <Nav />
      <GrainOverlay />

      <main>
        <Hero />
        <WhatItIs />
        <WhyDrone />
        <Story />
        <Services />
        <WhyUs />
        <Process />
        <Contact />
      </main>

      <Footer />
    </MotionConfig>
  );
}
