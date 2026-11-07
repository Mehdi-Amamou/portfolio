import { useTranslations } from "next-intl";
import { links } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

export function PersonJsonLd() {
  const t = useTranslations("meta");

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mehdi Amamou",
    jobTitle: t("jobTitle"),
    url: siteUrl,
    image: `${siteUrl}/generated/photo/portrait.webp`,
    email: `mailto:${links.email}`,
    telephone: links.telephone.replace(/\s/g, ""),
    knowsLanguage: ["fr", "en", "ar"],
    sameAs: [links.linkedin, links.github],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
    />
  );
}
