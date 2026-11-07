"use client";

import { useEffect } from "react";
import { loadGsap } from "@/lib/load-gsap";

// Les arcs d'horizon s'élargissent de 0,9 à 1,05 au fil du scroll.
export function HorizonFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const arcs = Array.from(document.querySelectorAll<HTMLElement>("#parcours .mh-horizon"));
    if (arcs.length === 0) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const context = gsap.context(() => {
        arcs.forEach((arc) => {
          gsap.fromTo(
            arc,
            { "--hz": 0.9 },
            {
              "--hz": 1.05,
              ease: "none",
              scrollTrigger: { trigger: arc, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      revert = () => context.revert();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        start();
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(arcs[0]);

    return () => {
      cancelled = true;
      observer.disconnect();
      revert?.();
    };
  }, []);

  return null;
}
