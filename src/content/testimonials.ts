// Vrais avis uniquement, publiés avec l'accord de chaque client.
// Tant que ce tableau est vide, la section est masquée en production
// et les trois emplacements restent visibles en développement.

export type Testimonial = {
  quote: string;
  name: string;
  activity: string;
};

export const testimonials: Testimonial[] = [];

export const showTestimonials =
  testimonials.length > 0 || process.env.NODE_ENV !== "production";
