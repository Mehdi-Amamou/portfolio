import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localePath, siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${siteUrl}${localePath(locale)}`]),
  );

  return routing.locales.map((locale) => ({
    url: `${siteUrl}${localePath(locale)}`,
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
