"use client";

import { useRef, type ReactNode } from "react";
import { useScrollFocus } from "@/lib/use-scroll-focus";

export function HeroChips({ children }: { children: ReactNode }) {
  const list = useRef<HTMLUListElement>(null);
  useScrollFocus(list);

  return (
    <ul className="mh-hero-chips" ref={list}>
      {children}
    </ul>
  );
}
