"use client";

import { useEffect, type RefObject } from "react";

// Une zone qui défile sans élément focusable doit rester atteignable au clavier.
export function useScrollFocus(ref: RefObject<HTMLElement | null>, enabled: boolean | undefined = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const sync = () => {
      if (el.scrollWidth > el.clientWidth) el.tabIndex = 0;
      else el.removeAttribute("tabindex");
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, enabled]);
}
