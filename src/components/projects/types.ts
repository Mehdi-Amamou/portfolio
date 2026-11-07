import type { ProjectCategory, ProjectCopy } from "@/content/projects";

export type Capture = { src: string; width: number; height: number };

export type ProjectView = ProjectCopy & {
  id: string;
  name: string;
  featured: boolean;
  placeholder: boolean;
  tint: string;
  url: string;
  live: boolean;
  stack: string[];
  categories: ProjectCategory[];
  /** Toutes les captures de assets/projects/<id>/, triées par nom de fichier. */
  captures: Capture[];
  /** Première capture : vignette de l'ordinateur. */
  thumb?: Capture;
  /** Première capture en hauteur, s'il y en a une : écran du téléphone. */
  phone?: Capture;
};

export type ProjectFilter = "all" | ProjectCategory;

export type GalleryLabels = {
  gallery: string;
  galleryHint: string;
  galleryEmpty: string;
  shotAlt: string;
  zoom: string;
  zoomClose: string;
  shotPrev: string;
  shotNext: string;
};

export type ProjectLabels = {
  filterAria: string;
  filters: Record<ProjectFilter, string>;
  stack: string;
  role: string;
  result: string;
  view: string;
  visit: string;
  soon: string;
  newTab: string;
  prev: string;
  next: string;
  shot: string;
  shotSm: string;
  modal: GalleryLabels & {
    need: string;
    did: string;
    result: string;
    client: string;
    role: string;
    year: string;
    yearVal: string;
    link: string;
    linkVal: string;
    close: string;
    prev: string;
    next: string;
  };
};
