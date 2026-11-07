import { useLocale, useTranslations } from "next-intl";
import { cvFiles, nav, whatsappHref } from "@/content/site";
import { showTestimonials } from "@/content/testimonials";
import { hasPublicFile } from "@/lib/assets";
import { Chrome } from "./Chrome";
import type { ChromeLabels, ChromeNavItem, CvItem } from "./types";

export const cvItems = (): CvItem[] =>
  cvFiles.map((file) => ({ ...file, ready: hasPublicFile(`cv/${file.file}`) }));

export function SiteChrome() {
  const t = useTranslations();
  const locale = useLocale();

  const labels: ChromeLabels = {
    logoAria: t("logoAria"),
    navAria: t("navAria"),
    langAria: t("langAria"),
    quote: t("quote"),
    menuOpen: t("menuOpen"),
    menuClose: t("menuClose"),
    menuLabel: t("menuLabel"),
    cvAria: t("cvAria"),
    cvTitle: t("cvTitle"),
    close: t("close"),
    loading: t("loading"),
    cursor: t("projects.cursor"),
    whatsapp: whatsappHref(t("whatsappText")),
    newTab: t("newTab"),
  };

  const items: ChromeNavItem[] = nav.map((item) => ({
    href: item.href,
    num: item.num,
    label: item.label[locale],
  }));

  const hasReviewsSection = (item: ChromeNavItem) => item.href === "#temoignages";

  return (
    <Chrome
      labels={labels}
      desktopNav={items.filter((item) => !hasReviewsSection(item))}
      mobileNav={items.filter((item) => showTestimonials || !hasReviewsSection(item))}
      cv={cvItems()}
    />
  );
}
