import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export type { Capture } from "@/components/projects/types";
import type { Capture } from "@/components/projects/types";

// Manifeste écrit par scripts/prepare-assets.mjs, lu au build.
export function capturesOf(id: string): Capture[] {
  const file = path.join(process.cwd(), ".generated/captures.json");
  if (!existsSync(file)) return [];
  const manifest = JSON.parse(readFileSync(file, "utf8")) as Record<string, Capture[]>;
  return manifest[id] ?? [];
}
