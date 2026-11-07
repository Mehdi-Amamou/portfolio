import { useTranslations } from "next-intl";
import type { CSSProperties, ReactNode } from "react";
import { Ic, type IconName } from "@/components/ui/Ic";
import { ServiceCard } from "./ServiceCard";
import { ServicesTrack } from "./ServicesTrack";

const SERVICES: { key: "s1" | "s2" | "s3" | "s4"; icon: IconName; art: ReactNode }[] = [
  {
    key: "s1",
    icon: "site",
    art: (
      <div className="mh-art-win">
        <div className="mh-art-top">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="mh-art-hero">
          <div className="mh-mini-col">
            <span className="mh-ln mh-ln--ink" style={{ width: "94%" }} />
            <span className="mh-ln mh-ln--ink" style={{ width: "72%" }} />
            <span className="mh-ln" style={{ width: "88%" }} />
            <span className="mh-ln" style={{ width: "64%" }} />
            <span className="mh-ln mh-ln--acc" />
          </div>
          <div className="mh-mini-img" />
        </div>
      </div>
    ),
  },
  { key: "s2", icon: "catalog", art: null },
  {
    key: "s3",
    icon: "layers",
    art: (
      <div className="mh-art-rows">
        <div className="mh-art-row on">
          <em>1</em>
          <i />
          <u style={{ flex: "0 0 52%" }} />
          <u />
        </div>
        <div className="mh-art-row">
          <em>2</em>
          <i />
          <u style={{ flex: "0 0 40%" }} />
          <u />
        </div>
        <div className="mh-art-row">
          <em>3</em>
          <i />
          <u style={{ flex: "0 0 30%" }} />
          <u />
        </div>
        <div className="mh-art-row">
          <em>4</em>
          <i />
          <u style={{ flex: "0 0 22%" }} />
          <u />
        </div>
      </div>
    ),
  },
  { key: "s4", icon: "shield", art: null },
];

function CatalogArt({ quote }: { quote: string }) {
  return (
    <>
      <div className="mh-art-cards">
        <div className="mh-art-prod">
          <div />
          <span className="mh-ln" style={{ width: "80%" }} />
          <span className="mh-ln" style={{ width: "50%" }} />
        </div>
        <div className="mh-art-prod">
          <div style={{ background: "linear-gradient(160deg, rgb(255, 231, 204), rgb(255, 246, 236))" }} />
          <span className="mh-ln" style={{ width: "70%" }} />
          <span className="mh-ln" style={{ width: "46%" }} />
        </div>
        <div className="mh-art-prod">
          <div style={{ background: "linear-gradient(160deg, rgb(217, 242, 230), rgb(242, 251, 246))" }} />
          <span className="mh-ln" style={{ width: "76%" }} />
          <span className="mh-ln" style={{ width: "40%" }} />
        </div>
      </div>
      <div className="mh-art-steps">
        <i className="on">1</i>
        <i className="on">2</i>
        <i>3</i>
        <b>{quote}</b>
      </div>
    </>
  );
}

function SecurityArt({ domain }: { domain: string }) {
  return (
    <>
      <div className="mh-art-ring" style={{ width: 200, height: 200 }} />
      <div className="mh-art-ring" style={{ width: 290, height: 290 }} />
      <div className="mh-art-shield">
        <Ic name="shield" />
      </div>
      <span className="mh-art-badge" style={{ left: 16, top: 20 }}>
        <i />
        HTTPS
      </span>
      <span className="mh-art-badge" style={{ right: 16, top: 46 }}>
        <i />
        VPS
      </span>
      <span className="mh-art-badge" style={{ left: 26, bottom: 18 }}>
        <i />
        {domain}
      </span>
    </>
  );
}

export function Services() {
  const t = useTranslations("services");
  const swipe = useTranslations()("swipe");

  return (
    <section className="mh-sec" id="services" aria-labelledby="services-title">
      <div className="mh-wrap">
        <div className="mh-sec-head">
          <div>
            <p className="mh-eyebrow">{t("eyebrow")}</p>
            <h2 className="mh-h2" id="services-title">
              {t("title")}
            </h2>
          </div>
          <p className="mh-lead">{t("intro")}</p>
        </div>

        <ServicesTrack count={SERVICES.length} swipe={swipe}>
          {SERVICES.map(({ key, icon, art }, index) => (
            <ServiceCard key={key} style={{ "--i": index } as CSSProperties}>
              <div className="mh-svc-halo" aria-hidden="true" />
              <div className="mh-svc-art" aria-hidden="true">
                {key === "s2" && <CatalogArt quote={t("artQuote")} />}
                {key === "s4" && <SecurityArt domain={t("artDomain")} />}
                {art}
              </div>
              <div className="mh-svc-body">
                <div className="mh-svc-top">
                  <span className="mh-ic-box">
                    <Ic name={icon} />
                  </span>
                  <span className="mh-num">{`0${index + 1}`}</span>
                </div>
                <h3 className="mh-h3">{t(`${key}.title`)}</h3>
                <p className="mh-svc-desc">{t(`${key}.desc`)}</p>
                <p className="mh-svc-for">
                  <span className="mh-svc-for-lbl">{t("ideal")}</span>
                  {t(`${key}.for`)}
                </p>
                <ul className="mh-svc-list">
                  {(t.raw(`${key}.items`) as string[]).map((item) => (
                    <li key={item}>
                      <Ic name="check" size="sm" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ServiceCard>
          ))}
        </ServicesTrack>
      </div>
    </section>
  );
}
