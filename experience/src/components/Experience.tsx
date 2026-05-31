"use client";

import { MotionConfig } from "framer-motion";
import { useSmoothScroll } from "@/hooks/useExperienceHooks";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Cursor } from "./Cursor";
import { SkipIntro } from "./SkipIntro";
import { SoundToggle, AudioDriver } from "./SoundToggle";
import { WhatItIs } from "./sections/WhatItIs";
import { WhyDrone } from "./sections/WhyDrone";
import { Story } from "./sections/Story";
import { Services } from "./sections/Services";
import { WhyUs } from "./sections/WhyUs";
import { Process } from "./sections/Process";
import { Contact } from "./sections/Contact";
import { Footer } from "./Footer";

/**
 * Top-level client experience. Owns smooth scroll, the cinematic chrome (custom
 * cursor, sound, skip intro) and the continuous-world page. Reduced motion is
 * honoured globally via MotionConfig.
 */
export function Experience() {
  useSmoothScroll();

  return (
    <MotionConfig reducedMotion="user">
      <a href="#what" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-cyan focus:px-5 focus:py-2 focus:font-display focus:text-sm focus:text-void">
        Skip to content
      </a>

      <Nav />
      <Cursor />
      <SkipIntro />
      <SoundToggle />
      <AudioDriver />
      <div className="grain" aria-hidden="true" />

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
