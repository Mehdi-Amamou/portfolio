"use client";

import { useEffect } from "react";

let locks = 0;

// Bloque le scroll de la page et masque la barre basse tant qu'une couche est ouverte.
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const page = document.querySelector(".mh-page");
    const root = document.documentElement;
    // Sans barre de défilement, la page garde sa largeur et le voile couvre tout l'écran.
    if (locks === 0) root.style.setProperty("--sbw", `${window.innerWidth - root.clientWidth}px`);
    locks += 1;
    root.classList.add("is-locked");
    page?.classList.add("has-overlay");

    return () => {
      locks -= 1;
      if (locks > 0) return;
      root.classList.remove("is-locked");
      root.style.removeProperty("--sbw");
      page?.classList.remove("has-overlay");
    };
  }, [active]);
}
