import { useLocale, useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { LangSwitch } from "@/components/chrome/LangSwitch";
import { cvItems } from "@/components/chrome/SiteChrome";
import { Ic } from "@/components/ui/Ic";
import { Reveal } from "@/components/ui/Reveal";
import { links, nav, whatsappHref } from "@/content/site";
import { external } from "@/lib/external";

const WORDMARK = "mehdi".split("");

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();
  const newTab = t("newTab");

  return (
    <footer className="mh-footer">
      <div className="mh-foot">
        <div className="mh-foot-grid">
          <div className="mh-foot-brand">
            <a className="mh-logo" href="#accueil" aria-label={t("logoAria")}>
              <span>mehdi</span>
              <span className="mh-caret" aria-hidden="true" />
            </a>
            <p>{t("footer.tagline")}</p>
            <a
              className="mh-btn mh-btn--primary mh-btn--sm"
              href="#contact"
              style={{ alignSelf: "flex-start" }}
            >
              <span>{t("quote")}</span>
              <Ic name="right" size="sm" />
            </a>
          </div>

          <nav className="mh-foot-col" aria-label={t("footer.nav")}>
            <h3>{t("footer.nav")}</h3>
            {nav
              .filter((item) => item.href !== "#temoignages")
              .map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label[locale]}
                </a>
              ))}
          </nav>

          <div className="mh-foot-col">
            <h3>{t("footer.contact")}</h3>
            <a href={whatsappHref(t("whatsappText"))} {...external("WhatsApp", newTab)}>
              <Ic name="whatsappFoot" size="sm" />
              WhatsApp
            </a>
            <a href={`mailto:${links.email}`}>
              <Ic name="mail" size="sm" />
              {t("contact.emailLbl")}
            </a>
            <a href={links.linkedin} {...external("LinkedIn", newTab)}>
              <Ic name="linkedinFoot" size="sm" />
              LinkedIn
            </a>
            <a href={links.github} {...external("GitHub", newTab)}>
              <Ic name="codeFoot" size="sm" />
              GitHub
            </a>
          </div>

          <div className="mh-foot-col">
            <h3>CV</h3>
            {cvItems().map((item) => (
              <a key={item.code} href={item.href} download>
                <Ic name="download" size="sm" />
                <span>{item.label}</span>
              </a>
            ))}
            <h3 style={{ marginTop: 18 }}>{t("footer.lang")}</h3>
            <LangSwitch label={t("langAria")} style={{ alignSelf: "flex-start" }} />
          </div>
        </div>

        <div className="mh-foot-bottom">
          <span>{`© ${year} Mehdi Amamou · ${t("footer.made")}`}</span>
          <a className="mh-totop" href="#accueil">
            <span>{t("footer.top")}</span>
            <Ic name="up" size="sm" />
          </a>
        </div>

        <Reveal as="p" className="mh-wordmark" aria-hidden amount={0.25}>
          <span>
            {WORDMARK.map((letter, index) => (
              <span className="mh-wl" key={index} style={{ "--i": index } as CSSProperties}>
                {letter}
              </span>
            ))}
          </span>
          <span className="mh-caret" />
        </Reveal>
      </div>
    </footer>
  );
}
