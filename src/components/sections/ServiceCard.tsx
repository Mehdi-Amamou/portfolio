"use client";

import { useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

const TILT = 3;
const LIFT = -4;
const SPRING = { stiffness: 220, damping: 24 };

type ServiceCardProps = {
  style: CSSProperties;
  children: ReactNode;
};

export function ServiceCard({ style, children }: ServiceCardProps) {
  const card = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const lift = useSpring(0, SPRING);
  const active = fine && !reduced;

  useEffect(() => {
    if (!active) return;
    const apply = () => {
      const el = card.current;
      if (!el) return;
      const x = rotateX.get();
      const y = rotateY.get();
      const up = lift.get();
      if (Math.abs(x) + Math.abs(y) + Math.abs(up) < 0.01) {
        el.style.removeProperty("transform");
        el.style.removeProperty("transition");
        return;
      }
      // Le ressort pilote la transformation : on retire la transition CSS pendant le survol.
      el.style.transition = "box-shadow .4s var(--ease)";
      el.style.transform = `perspective(1000px) translateY(${up.toFixed(2)}px) rotateX(${x.toFixed(2)}deg) rotateY(${y.toFixed(2)}deg)`;
    };
    const stops = [rotateX, rotateY, lift].map((value) => value.on("change", apply));
    return () => {
      stops.forEach((stop) => stop());
      cancelAnimationFrame(frame.current);
    };
  }, [active, rotateX, rotateY, lift]);

  const onMove = (event: PointerEvent<HTMLElement>) => {
    if (!active) return;
    const { currentTarget: el, clientX, clientY } = event;
    const box = el.getBoundingClientRect();
    const x = (clientX - box.left) / box.width;
    const y = (clientY - box.top) / box.height;

    rotateY.set((x - 0.5) * 2 * TILT);
    rotateX.set((0.5 - y) * 2 * TILT);
    lift.set(LIFT);

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--hx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--hy", `${(y * 100).toFixed(1)}%`);
    });
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    lift.set(0);
  };

  return (
    <article
      ref={card}
      className="mh-svc"
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </article>
  );
}
