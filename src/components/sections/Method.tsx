import { useTranslations } from "next-intl";
import { Ic, type IconName } from "@/components/ui/Ic";
import { MethodTimeline } from "./MethodTimeline";

const STEPS: { key: "s1" | "s2" | "s3" | "s4" | "s5"; icon: IconName }[] = [
  { key: "s1", icon: "chat" },
  { key: "s2", icon: "pen" },
  { key: "s3", icon: "code" },
  { key: "s4", icon: "launch" },
  { key: "s5", icon: "refresh" },
];

export function Method() {
  const t = useTranslations("method");

  return (
    <section className="mh-sec" id="methode" aria-labelledby="method-title">
      <div className="mh-wrap">
        <div className="mh-sec-head">
          <div>
            <p className="mh-eyebrow">{t("eyebrow")}</p>
            <h2 className="mh-h2" id="method-title">
              {t("title")}
            </h2>
          </div>
          <p className="mh-lead">{t("intro")}</p>
        </div>

        <MethodTimeline>
          <li className="mh-steps-rail" aria-hidden="true">
            <span className="mh-steps-fill" />
          </li>
          {STEPS.map(({ key, icon }, index) => (
            <li className="mh-step is-done" key={key}>
              <span className="mh-node">{`0${index + 1}`}</span>
              <div className="mh-step-body">
                <h3 className="mh-step-title">
                  <Ic name={icon} />
                  {t(`${key}.t`)}
                </h3>
                <p>{t(`${key}.d`)}</p>
                <p className="mh-get">
                  <span className="mh-get-lbl">{t("get")}</span>
                  <b>{t(`${key}.g`)}</b>
                </p>
              </div>
            </li>
          ))}
        </MethodTimeline>
      </div>
    </section>
  );
}
