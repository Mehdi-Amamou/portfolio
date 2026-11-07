// Navigation (design/contenu.json) et coordonnées réelles.

export type NavItem = {
  href: string;
  num: string;
  label: { fr: string; en: string };
};

export const nav: NavItem[] = [
  {
    "href": "#services",
    "num": "02",
    "label": {
      "fr": "Services",
      "en": "Services"
    }
  },
  {
    "href": "#projets",
    "num": "03",
    "label": {
      "fr": "Projets",
      "en": "Work"
    }
  },
  {
    "href": "#methode",
    "num": "04",
    "label": {
      "fr": "Méthode",
      "en": "Process"
    }
  },
  {
    "href": "#parcours",
    "num": "05",
    "label": {
      "fr": "Parcours",
      "en": "About"
    }
  },
  {
    "href": "#temoignages",
    "num": "06",
    "label": {
      "fr": "Avis",
      "en": "Reviews"
    }
  },
  {
    "href": "#contact",
    "num": "07",
    "label": {
      "fr": "Contact",
      "en": "Contact"
    }
  }
];

export const links = {
  whatsapp: "https://wa.me/21652250949",
  email: "mehdi.amamou4@gmail.com",
  telephone: "+216 52 250 949",
  linkedin: "https://www.linkedin.com/in/mehdi-amamou/",
  github: "https://github.com/Mehdi-Amamou",
  cvFr: "/cv/cv-fr.pdf",
  cvEn: "/cv/cv-en.pdf",
};

// Lien WhatsApp avec le message pré-rempli dans la langue du visiteur.
export const whatsappHref = (text: string) => `${links.whatsapp}?text=${encodeURIComponent(text)}`;

// Adresse lisible, sans protocole ni « www. » : linkedin.com/in/mehdi-amamou
export const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export const cvFiles = [
  { code: "FR", label: "Télécharger en français", short: "Français", file: "cv-fr.pdf", href: links.cvFr },
  { code: "EN", label: "Download in English", short: "English", file: "cv-en.pdf", href: links.cvEn },
] as const;

export const isPlaceholder = (value: string) => value.trim().startsWith("[");
