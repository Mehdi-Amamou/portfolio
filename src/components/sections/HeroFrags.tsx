"use client";

import { useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

const POINTER_RANGE = 12;
const TILT_RANGE = 8;
const SPRING = { stiffness: 70, damping: 18, mass: 0.6 };

// Profondeur de chaque fragment : le navigateur est au premier plan, le cadenas au fond.
const DEPTH = [0.85, 0.6, 0.7, 1];

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

type OrientationRequest = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export function HeroFrags({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, SPRING);
  const y = useSpring(targetY, SPRING);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;

    const frags = Array.from(el.querySelectorAll<HTMLElement>(".mh-frag"));
    const apply = () => {
      const dx = x.get();
      const dy = y.get();
      frags.forEach((frag, index) => {
        const depth = DEPTH[index] ?? 1;
        frag.style.translate = `${(dx * depth).toFixed(2)}px ${(dy * depth).toFixed(2)}px`;
      });
    };
    const stopX = x.on("change", apply);
    const stopY = y.on("change", apply);

    const onPointer = (event: PointerEvent) => {
      targetX.set(clamp((event.clientX / window.innerWidth) * 2 - 1) * POINTER_RANGE);
      targetY.set(clamp((event.clientY / window.innerHeight) * 2 - 1) * POINTER_RANGE);
    };

    let gyroActive = false;
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return;
      if (!gyroActive) {
        gyroActive = true;
        el.classList.add("has-gyro");
      }
      targetX.set(clamp(event.gamma / 30) * TILT_RANGE);
      targetY.set(clamp((event.beta - 45) / 30) * TILT_RANGE);
    };

    const fine = window.matchMedia("(pointer: fine)").matches;
    const orientation = window.DeviceOrientationEvent as unknown as OrientationRequest | undefined;
    const needsPermission = typeof orientation?.requestPermission === "function";
    let gyroAllowed = !fine && !needsPermission && Boolean(orientation);

    const listen = (active: boolean) => {
      if (fine) {
        if (active) window.addEventListener("pointermove", onPointer, { passive: true });
        else window.removeEventListener("pointermove", onPointer);
      } else if (gyroAllowed) {
        if (active) window.addEventListener("deviceorientation", onOrientation);
        else window.removeEventListener("deviceorientation", onOrientation);
      }
    };

    // iOS exige un geste de l'utilisateur avant d'ouvrir le gyroscope.
    const askPermission = () => {
      orientation?.requestPermission?.()
        .then((state) => {
          if (state !== "granted") return;
          gyroAllowed = true;
          listen(true);
        })
        .catch(() => {});
    };
    if (!fine && needsPermission) {
      window.addEventListener("touchend", askPermission, { once: true });
    }

    const observer = new IntersectionObserver(([entry]) => listen(entry.isIntersecting));
    observer.observe(el);

    return () => {
      observer.disconnect();
      listen(false);
      window.removeEventListener("touchend", askPermission);
      stopX();
      stopY();
    };
  }, [reduced, targetX, targetY, x, y]);

  return (
    <div className="mh-frags" aria-hidden="true" ref={root}>
      {children}
    </div>
  );
}
