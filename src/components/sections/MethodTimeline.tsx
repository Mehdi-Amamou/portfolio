"use client";

import { inView } from "motion";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { loadGsap } from "@/lib/load-gsap";
import { useMediaQuery } from "@/lib/use-media-query";

const DESKTOP = "(min-width: 1024px)";
const END = 0.995;

export function MethodTimeline({ children }: { children: ReactNode }) {
  const list = useRef<HTMLOListElement>(null);
  const paint = useRef<(progress: number) => void>(() => {});
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 70%", "end 60%"] });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!isDesktop && !reduced) paint.current(progress);
  });

  useEffect(() => {
    const root = list.current;
    if (!root || reduced) return;

    const rail = root.querySelector<HTMLElement>(".mh-steps-rail");
    const fill = root.querySelector<HTMLElement>(".mh-steps-fill");
    const steps = Array.from(root.querySelectorAll<HTMLElement>(".mh-step"));
    if (!rail || !fill) return;

    // Position de chaque pastille sur le rail, de 0 à 1.
    const thresholds = () => {
      const box = rail.getBoundingClientRect();
      return steps.map((step) => {
        const node = step.querySelector(".mh-node")!.getBoundingClientRect();
        return isDesktop
          ? (node.left + node.width / 2 - box.left) / box.width
          : (node.top + node.height / 2 - box.top) / box.height;
      });
    };

    let marks = thresholds();
    paint.current = (progress) => {
      fill.style.transform = isDesktop ? `scaleX(${progress})` : `scaleY(${progress})`;
      const reached = marks.filter((mark) => progress >= mark).length;
      steps.forEach((step, index) => {
        step.classList.toggle("is-done", index < reached - 1 || progress >= END);
        step.classList.toggle("is-current", index === reached - 1 && progress < END);
      });
    };

    const onResize = () => {
      marks = thresholds();
    };
    window.addEventListener("resize", onResize);

    root.classList.add("is-armed");
    paint.current(isDesktop ? 0 : scrollYProgress.get());

    const stopSteps = steps.map((step) =>
      inView(step, () => {
        step.classList.add("is-seen");
      }, { amount: 0.4 }),
    );

    return () => {
      window.removeEventListener("resize", onResize);
      stopSteps.forEach((stop) => stop());
      root.classList.remove("is-armed");
      fill.style.removeProperty("transform");
      steps.forEach((step) => {
        step.classList.add("is-done");
        step.classList.remove("is-current");
      });
    };
  }, [isDesktop, reduced, scrollYProgress]);

  useEffect(() => {
    const root = list.current;
    const section = root?.closest("section");
    if (!section || !isDesktop || reduced) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    // Le pin est en CSS (extras.css) : GSAP ne fait que lier la ligne au scroll.
    const start = async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const media = gsap.matchMedia();
      const state = { progress: 0 };
      const run = (scrollTrigger: gsap.plugins.ScrollTriggerInstanceVars) => {
        gsap.to(state, {
          progress: 1,
          ease: "none",
          scrollTrigger: { trigger: section, scrub: 0.3, ...scrollTrigger },
          onUpdate: () => paint.current(state.progress),
        });
      };
      media.add("(min-height: 760px)", () => {
        run({ start: "top top", end: () => `+=${window.innerHeight * 1.2}` });
      });
      media.add("(max-height: 759px)", () => {
        run({ start: "top 40%", end: "bottom 80%" });
      });
      revert = () => media.revert();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        start();
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(section);

    return () => {
      cancelled = true;
      observer.disconnect();
      revert?.();
    };
  }, [isDesktop, reduced]);

  return (
    <ol className="mh-steps" ref={list} style={{ "--fill": "100%" } as CSSProperties}>
      {children}
    </ol>
  );
}
