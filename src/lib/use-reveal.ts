"use client";

import { inView } from "motion";
import { useEffect, type RefObject } from "react";

// Le contenu reste visible sans JS : on ne l'arme qu'à l'hydratation, s'il est encore sous la ligne de flottaison.
export function useReveal(ref: RefObject<HTMLElement | null>, amount = 0.3) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.classList.add("is-armed");
    return inView(el, () => {
      el.classList.add("is-in");
    }, { amount });
  }, [ref, amount]);
}
