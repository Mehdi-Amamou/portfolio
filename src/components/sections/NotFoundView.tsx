import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { localePath } from "@/lib/site-url";

export function NotFoundView() {
  const t = useTranslations("notFound");
  const locale = useLocale();

  return (
    <main className="mh-hero" style={{ justifyContent: "center" }}>
      <div className="mh-wrap mh-hero-in">
        <p className="mh-eyebrow">404</p>
        <h1 className="mh-h2">{t("title")}</h1>
        <div className="mh-hero-ctas">
          <Link className="mh-btn mh-btn--primary mh-btn--lg" href={localePath(locale)}>
            {t("back")}
          </Link>
        </div>
      </div>
    </main>
  );
}
