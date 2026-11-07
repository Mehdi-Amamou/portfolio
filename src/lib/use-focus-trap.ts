"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Couches ouvertes, de la plus ancienne à la plus récente : seule la dernière réagit au clavier
// (le zoom d'une capture s'ouvre par-dessus la modale projet).
const layers: symbol[] = [];

// Garde le focus dans la couche ouverte, ferme avec Échap et rend le focus au déclencheur.
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape: () => void,
) {
  const escape = useRef(onEscape);

  useEffect(() => {
    escape.current = onEscape;
  });

  useEffect(() => {
    if (!active) return;
    const root = ref.current;
    if (!root) return;

    const layer = Symbol("couche");
    layers.push(layer);
    const previous = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0 && !el.closest("[inert]"),
      );

    const first = root.querySelector<HTMLElement>("[data-autofocus]") ?? focusable()[0];
    first?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (layers[layers.length - 1] !== layer) return;
      if (event.key === "Escape") {
        event.preventDefault();
        escape.current();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;
      const head = items[0];
      const tail = items[items.length - 1];
      const current = document.activeElement as HTMLElement;

      if (!root.contains(current)) {
        event.preventDefault();
        head.focus();
      } else if (event.shiftKey && current === head) {
        event.preventDefault();
        tail.focus();
      } else if (!event.shiftKey && current === tail) {
        event.preventDefault();
        head.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      layers.splice(layers.indexOf(layer), 1);
      previous?.focus({ preventScroll: true });
    };
  }, [active, ref]);
}
