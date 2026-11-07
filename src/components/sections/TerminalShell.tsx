"use client";

import { inView } from "motion";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

const DESKTOP_SPEED = 1;
const PHONE_SPEED = 2;

type TerminalShellProps = {
  replay: string;
  children: ReactNode;
};

export function TerminalShell({ replay, children }: TerminalShellProps) {
  const root = useRef<HTMLElement>(null);
  const stop = useRef<(() => void) | null>(null);

  const play = useCallback(async () => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { playTerminal } = await import("@/lib/terminal-typing");
    stop.current?.();
    const speed = window.matchMedia("(max-width: 767px)").matches ? PHONE_SPEED : DESKTOP_SPEED;
    stop.current = playTerminal(el, speed);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.classList.add("is-armed");
    return inView(el, () => {
      play();
    }, { amount: 0.35 });
  }, [play]);

  useEffect(() => () => stop.current?.(), []);

  return (
    <figure className="mh-term" ref={root} onClick={play}>
      {children}
      <button type="button" className="mh-sr mh-term-replay" onClick={play}>
        {replay}
      </button>
    </figure>
  );
}
