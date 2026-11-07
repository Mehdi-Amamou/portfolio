import { existsSync } from "node:fs";
import path from "node:path";

// Lu au build : déposer un fichier dans public/ puis reconstruire suffit à remplacer l'emplacement.
export const hasPublicFile = (file: string) =>
  existsSync(path.join(process.cwd(), "public", file));
