import { useLocale, useTranslations } from "next-intl";
import { ContactForm } from "@/components/contact/ContactForm";
import type { ContactLabels } from "@/components/contact/types";
import { Ic, type IconName } from "@/components/ui/Ic";
import { displayUrl, links, whatsappHref } from "@/content/site";
import { external } from "@/lib/external";

function Way({
  href,
  icon,
  label,
  value,
  newTab,
}: {
  href: string;
  icon: IconName;
  label: string;
  value: string;
  newTab?: string;
}) {
  return (
    <a className="mh-way" href={href} {...(newTab && external(`${label} ${value}`, newTab))}>
      <span className="mh-way-ic">
        <Ic name={icon} />
      </span>
      <span className="mh-way-txt">
        <small>{label}</small> <b>{value}</b>
      </span>
      <Ic name="upRight" />
    </a>
  );
}

export function Contact() {
  const t = useTranslations("contact");
  const common = useTranslations();
  const locale = useLocale();
  const newTab = common("newTab");

  const keys = [
    "formTitle", "formSub", "name", "namePh", "email", "emailPh", "project", "projectPh",
    "budget", "submit", "privacy", "errName", "errEmail", "errProject", "errOne", "errMany",
    "sentTitle", "sentA", "sentB", "recap", "sentWa", "sentNew",
  ] as const;

  const labels = {
    ...Object.fromEntries(keys.map((key) => [key, t.raw(key) as string])),
    budgets: t.raw("budgets") as string[],
    whatsapp: whatsappHref(common("whatsappText")),
    newTab,
  } as ContactLabels;

  return (
    <section className="mh-contact-sec" id="contact" aria-labelledby="contact-title">
      <div className="mh-contact-wrap">
        <div className="mh-contact">
          <div className="mh-contact-glow" aria-hidden="true" />
          <div className="mh-contact-info">
            <div>
              <p className="mh-eyebrow">{t("eyebrow")}</p>
              <h2 className="mh-h2" id="contact-title">
                {t("title")}
              </h2>
            </div>
            <p className="mh-contact-sub">{t("sub")}</p>
            <p className="mh-badge24">
              <Ic name="clock" />
              {t("badge")}
            </p>
            <div className="mh-ways">
              <Way
                href={whatsappHref(common("whatsappText"))}
                icon="whatsapp"
                label="WhatsApp"
                value={links.telephone}
                newTab={newTab}
              />
              <Way href={`mailto:${links.email}`} icon="mail" label={t("emailLbl")} value={links.email} />
              <Way
                href={links.linkedin}
                icon="linkedin"
                label="LinkedIn"
                value={displayUrl(links.linkedin)}
                newTab={newTab}
              />
              <Way
                href={links.github}
                icon="code"
                label="GitHub"
                value={displayUrl(links.github)}
                newTab={newTab}
              />
            </div>
            <p className="mh-langs">{t("langs")}</p>
          </div>
          <ContactForm labels={labels} locale={locale} />
        </div>
      </div>
    </section>
  );
}
