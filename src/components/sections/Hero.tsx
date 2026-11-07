import Image from "next/image";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { Ic } from "@/components/ui/Ic";
import { HeroChips } from "./HeroChips";
import { HeroFrags } from "./HeroFrags";

export function Hero() {
  const t = useTranslations("hero");
  const lead = t.raw("lead") as string[];
  const highlight = t.raw("hl") as string[];
  const chips = t.raw("chips") as string[];

  const word = (text: string, index: number, highlighted = false) => (
    <span
      key={index}
      className={highlighted ? "mh-w is-hl" : "mh-w"}
      style={{ "--i": index } as CSSProperties}
    >
      {text}
    </span>
  );

  return (
    <section className="mh-hero" id="accueil" aria-labelledby="hero-title">
      <div className="mh-hero-bg" aria-hidden="true">
        <div className="mh-dots" />
        <div className="mh-glow" />
        <div className="mh-arc" />
      </div>

      <HeroFrags>
        <div className="mh-frag mh-frag--toast">
          <span className="mh-frag-ic">
            <Ic name="inbox" />
          </span>
          <span className="mh-frag-txt">
            <b>{t("toast")}</b>
            <small>{t("toastTime")}</small>
          </span>
        </div>
        <div className="mh-frag mh-frag--lock">
          <span className="mh-frag-ic">
            <Ic name="lock" />
          </span>
          <span className="mh-frag-lbl">{t("secure")}</span>
          <em>HTTPS</em>
        </div>
        <div className="mh-frag mh-frag--admin">
          <span className="mh-switch" />
          <span className="mh-frag-txt">
            <b>{t("published")}</b>
            <small>Back-office</small>
          </span>
        </div>
        <div className="mh-frag mh-frag--browser">
          <div className="mh-mini">
            <div className="mh-mini-win">
              <div className="mh-mini-bar">
                <span className="mh-mini-url">
                  <Ic name="lock" />
                  {t("url")}
                </span>
              </div>
              <div className="mh-mini-body">
                <div className="mh-mini-col">
                  <span className="mh-ln mh-ln--ink" style={{ width: "92%" }} />
                  <span className="mh-ln mh-ln--ink" style={{ width: "70%" }} />
                  <span className="mh-ln" style={{ width: "86%" }} />
                  <span className="mh-ln" style={{ width: "60%" }} />
                  <span className="mh-ln mh-ln--acc" />
                </div>
                <div className="mh-mini-img" />
              </div>
            </div>
            <div className="mh-mini-phone">
              <div>
                <span className="mh-ln mh-ln--ink" style={{ width: "80%" }} />
                <span className="mh-ln" style={{ width: "90%" }} />
                <span className="mh-ln" style={{ width: "60%" }} />
                <span className="mh-ln mh-ln--acc" style={{ width: "70%", height: 12 }} />
              </div>
            </div>
          </div>
        </div>
      </HeroFrags>

      <div className="mh-wrap mh-hero-in">
        <p className="mh-pill">
          <span className="mh-avatar mh-avatar--detouree">
            <Image
              className="mh-avatar-img"
              src="/generated/photo/avatar.webp"
              alt={t("photoAlt")}
              width={32}
              height={32}
            />
          </span>
          <span className="mh-pill-name">Mehdi Amamou</span>
          <span className="mh-pill-sep mh-pill-sep--role" aria-hidden="true" />
          <span className="mh-pill-role">{t("role")}</span>
          <span className="mh-pill-sep" aria-hidden="true" />
          <span className="mh-status">
            <span className="mh-dot" aria-hidden="true" />
            {t("status")}
          </span>
        </p>

        <h1 className="mh-h1" id="hero-title">
          <span className="mh-sr">{t("h1")}</span>
          <span className="mh-h1-words" aria-hidden="true">
            {lead.map((text, index) => word(text, index))}
            <span className="mh-h1-hl">
              {highlight.map((text, index) => word(text, lead.length + index, true))}
              <span className="mh-caret mh-caret--h1" />
            </span>
          </span>
        </h1>

        <p className="mh-hero-sub">{t("sub")}</p>

        <div className="mh-hero-ctas">
          <a className="mh-btn mh-btn--primary mh-btn--lg" href="#projets">
            <span>{t("cta1")}</span>
            <span className="mh-btn-ic">
              <Ic name="right" size="sm" />
            </span>
          </a>
          <a className="mh-btn mh-btn--secondary mh-btn--lg" href="#contact">
            {t("cta2")}
          </a>
        </div>

        <HeroChips>
          {chips.map((chip) => (
            <li className="mh-chip" key={chip}>
              <Ic name="check" size="sm" />
              <span>{chip}</span>
            </li>
          ))}
        </HeroChips>
      </div>

      <a className="mh-scroll" href="#services">
        <span>{t("scroll")}</span>
        <span className="mh-scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}
