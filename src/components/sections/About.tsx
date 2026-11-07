import { useTranslations } from "next-intl";
import { cvItems } from "@/components/chrome/SiteChrome";
import { Ic, type IconName } from "@/components/ui/Ic";
import { Reveal } from "@/components/ui/Reveal";
import { HorizonFx } from "./HorizonFx";
import { TerminalShell } from "./TerminalShell";
import { Fragment, type CSSProperties } from "react";

// Invite neutre : ni utilisateur, ni superutilisateur.
function Prompt() {
  return <span className="mh-p-path">$</span>;
}

export function About() {
  const t = useTranslations("about");
  const skills = t.raw("skills") as { k: string; v: string }[];

  const path: { icon: IconName; meta: string; org: string; role: string }[] = [
    { icon: "grad", meta: t("i1.meta"), org: "École Polytechnique de Sousse", role: t("i1.role") },
    { icon: "shield", meta: "2026 – 2027", org: "Securinets EPS", role: t("i2.role") },
    { icon: "globe", meta: t("i3.meta"), org: "Forum FTE / FCIERI", role: t("i3.role") },
  ];

  return (
    <section className="mh-dark" id="parcours" aria-labelledby="about-title">
      <HorizonFx />
      <div className="mh-horizon" aria-hidden="true" />
      <div className="mh-dark-sec">
        <div className="mh-wrap">
          <div className="mh-sec-head mh-sec-head--stack">
            <div>
              <p className="mh-eyebrow">{t("eyebrow")}</p>
              <h2 className="mh-h2" id="about-title">
                {t("title")}
              </h2>
            </div>
            <p className="mh-lead">{t("intro")}</p>
          </div>

          <div className="mh-about">
            <Reveal className="mh-path mh-rv">
              {path.map((item, index) => (
                <div
                  className="mh-path-item"
                  key={item.org}
                  style={{ "--i": index } as CSSProperties}
                >
                  <span className="mh-path-ic">
                    <Ic name={item.icon} />
                  </span>
                  <div>
                    <p className="mh-path-meta">{item.meta}</p>
                    <h3 className="mh-path-org">{item.org}</h3>
                    <p className="mh-path-role">{item.role}</p>
                  </div>
                </div>
              ))}
              <div className="mh-cvbox">
                <p className="mh-cvbox-title">
                  <Ic name="doc" />
                  {t("cvTitle")}
                </p>
                <div className="mh-cvbox-btns">
                  {cvItems().map((item) => (
                    <a className="mh-cvbtn" href={item.href} download key={item.code}>
                      <span className="mh-cv-code">{item.code}</span>
                      <span>{item.label}</span>
                      <Ic name="download" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            <TerminalShell replay={t("termReplay")}>
              <figcaption className="mh-sr">{t("termCaption")}</figcaption>
              <div className="mh-term-glow" aria-hidden="true" />
              <div className="mh-term-bar">
                <span className="mh-term-title">
                  <Ic name="terminal" size="sm" />
                  ~/portfolio
                </span>
                <span className="mh-term-ctl" aria-hidden="true">
                  <Ic name="minimize" />
                  <Ic name="maximize" />
                  <Ic name="close" />
                </span>
              </div>
              <div className="mh-term-body">
                <p className="mh-tl">
                  <Prompt />
                  <span className="mh-p-cmd">whoami</span>
                </p>
                <p className="mh-tl mh-out">{t("whoami")}</p>
                <p className="mh-tl mh-tl--gap">
                  <Prompt />
                  <span className="mh-p-cmd">{t("catCmd")}</span>
                </p>
                <dl className="mh-kv">
                  {skills.map((skill) => (
                    <Fragment key={skill.k}>
                      <dt>{skill.k}</dt>
                      <dd>{skill.v}</dd>
                    </Fragment>
                  ))}
                </dl>
                <p className="mh-tl mh-tl--gap">
                  <Prompt />
                  <span className="mh-p-cmd">{t("langCmd")}</span>
                </p>
                <p className="mh-tl">
                  <span className="mh-ok">FR · EN · AR</span>
                  <span className="mh-out">{t("langsOut")}</span>
                </p>
                <p className="mh-tl mh-tl--gap">
                  <Prompt />
                  <span className="mh-term-caret" aria-hidden="true" />
                </p>
              </div>
            </TerminalShell>
          </div>
        </div>
      </div>
      <div className="mh-horizon mh-horizon--up" aria-hidden="true" />
    </section>
  );
}
