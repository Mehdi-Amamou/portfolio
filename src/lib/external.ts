// Lien externe : nouvel onglet, sans accès à window.opener ni référent, nom accessible explicite.
export const external = (label: string, newTab: string) => ({
  target: "_blank",
  rel: "noopener noreferrer",
  "aria-label": `${label} (${newTab})`,
});
