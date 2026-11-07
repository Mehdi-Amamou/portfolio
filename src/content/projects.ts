// Les projets sont dans projects.json : passer "live" à true active le bouton « Voir le site ».
// Les captures viennent de assets/projects/<id>/ (voir scripts/prepare-assets.mjs).
import data from "./projects.json";

export type ProjectCategory = "vitrine" | "catalogue" | "plateforme";

export type ProjectCopy = {
  type: string;
  client: string;
  desc: string;
  role: string;
  result: string;
  need: string;
  did: string;
};

export type Project = {
  id: string;
  name: string;
  featured: boolean;
  placeholder: boolean;
  tint: string;
  url: string;
  live: boolean;
  stack: string[];
  categories: ProjectCategory[];
  fr: ProjectCopy;
  en: ProjectCopy;
};

export const projects = data as Project[];
