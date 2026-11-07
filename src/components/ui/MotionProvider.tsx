"use client";

import { LazyMotion, MotionConfig, MotionGlobalConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

// Avec reduced-motion, Motion ne garde même pas les fondus.
if (typeof window !== "undefined") {
  MotionGlobalConfig.skipAnimations = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
