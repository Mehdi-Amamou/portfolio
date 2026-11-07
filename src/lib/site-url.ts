export const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const localePath = (locale: string) => (locale === "fr" ? "/" : `/${locale}`);
