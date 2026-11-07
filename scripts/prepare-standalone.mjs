// next build ne copie ni les fichiers statiques ni public/ dans le dossier standalone.
import { cpSync, existsSync } from "node:fs";

const target = ".next/standalone";
if (!existsSync(target)) throw new Error(`${target} introuvable : lancer next build d'abord.`);

cpSync(".next/static", `${target}/.next/static`, { recursive: true });
cpSync("public", `${target}/public`, { recursive: true });
console.log("Standalone prêt : .next/static et public copiés.");
