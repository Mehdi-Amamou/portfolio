import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { showTestimonials, testimonials } from "@/content/testimonials";

const SLOTS = 3;

const placeholder = {
  quote: "[Avis client à fournir]",
  name: "[Nom du client]",
  activity: "[Activité · Ville]",
};

function QuoteMark() {
  return (
    <svg className="mh-ic mh-quote-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path
        pathLength={1}
        d="M10 7.5H6.5A1.5 1.5 0 0 0 5 9v3.5A1.5 1.5 0 0 0 6.5 14H9v.5c0 1.8-1 3-3 3.5M19 7.5h-3.5A1.5 1.5 0 0 0 14 9v3.5a1.5 1.5 0 0 0 1.5 1.5H18v.5c0 1.8-1 3-3 3.5"
      />
    </svg>
  );
}

export function Testimonials() {
  const t = useTranslations("testi");
  if (!showTestimonials) return null;

  const items =
    testimonials.length > 0 ? testimonials : Array.from({ length: SLOTS }, () => placeholder);

  return (
    <section className="mh-sec mh-testi-sec" id="temoignages" aria-labelledby="testi-title">
      <div className="mh-wrap">
        <div className="mh-sec-head">
          <div>
            <p className="mh-eyebrow">{t("eyebrow")}</p>
            <h2 className="mh-h2" id="testi-title">
              {t("title")}
            </h2>
          </div>
          <p className="mh-lead">{t("intro")}</p>
        </div>
        <Reveal className="mh-quotes mh-rv mh-rv--desk" scrollable>
          {items.map((item, index) => (
            <figure className="mh-quote" key={index} style={{ "--i": index } as CSSProperties}>
              <div className="mh-quote-top">
                <QuoteMark />
                <span className="mh-quote-tag">{`${t("tag")} 0${index + 1}`}</span>
              </div>
              <blockquote className="mh-quote-txt" style={{ margin: 0 }}>
                {item.quote}
              </blockquote>
              <figcaption className="mh-quote-who">
                <span className="mh-quote-av" aria-hidden="true" />
                <span>
                  <b>{item.name}</b>
                  <small>{item.activity}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
