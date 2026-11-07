"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Couche des menus et de la modale, à l'intérieur de .mh-vp (voir Chrome.tsx).
export function usePortalHost() {
  return useSyncExternalStore(
    subscribe,
    () => document.getElementById("mh-overlays"),
    () => null,
  );
}
