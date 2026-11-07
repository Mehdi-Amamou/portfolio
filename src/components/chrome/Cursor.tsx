"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

const SPRING = { stiffness: 380, damping: 34, mass: 0.5 };

// Le disque est décalé de son centre, comme dans la maquette : le point garde sa place sous la souris.
const DISC_OFFSET = 30;

export function Cursor({ label }: { label: string }) {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();
  const enabled = fine && wide && !reduced;

  const [overProject, setOverProject] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const discX = useSpring(x, SPRING);
  const discY = useSpring(y, SPRING);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as Element;
      setOverProject(Boolean(target.closest?.("[data-cursor]") && !target.closest("[data-cursor-off]")));
      setVisible(!target.closest?.("input, textarea"));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <m.div
        className="mh-cursor"
        aria-hidden="true"
        style={{ x: discX, y: discY, translate: `-${DISC_OFFSET}px -${DISC_OFFSET}px` }}
        initial={false}
        animate={{ scale: visible && overProject ? 1 : 0, opacity: visible && overProject ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      >
        {label}
      </m.div>
      <m.span
        className="mh-cursor-dot"
        aria-hidden="true"
        style={{ x, y }}
        initial={false}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.12 }}
      />
    </>
  );
}
