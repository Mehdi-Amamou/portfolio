import { useLocale, useTranslations } from "next-intl";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import type { ProjectLabels, ProjectView } from "@/components/projects/types";
import { projects } from "@/content/projects";
import { capturesOf } from "@/lib/captures";

export function Projects() {
  const locale = useLocale();
  const t = useTranslations("projects");
  const modal = useTranslations("modal");

  const common = useTranslations();

  const views: ProjectView[] = projects.map(({ fr, en, ...project }) => {
    const captures = capturesOf(project.id);
    return {
      ...project,
      ...(locale === "en" ? en : fr),
      captures,
      thumb: captures[0],
      phone: captures.find((capture) => capture.height > capture.width),
    };
  });

  const labels: ProjectLabels = {
    filterAria: t("filterAria"),
    filters: {
      all: t("filters.all"),
      vitrine: t("filters.vitrine"),
      catalogue: t("filters.catalogue"),
      plateforme: t("filters.plateforme"),
    },
    stack: "Stack",
    role: t("role"),
    result: t("result"),
    view: t("view"),
    visit: t("visit"),
    soon: t("soon"),
    newTab: common("newTab"),
    prev: t("prev"),
    next: t("next"),
    shot: t("shot"),
    shotSm: t("shotSm"),
    modal: {
      need: modal("need"),
      did: modal("did"),
      result: modal("result"),
      client: modal("client"),
      role: modal("role"),
      year: modal("year"),
      yearVal: modal("yearVal"),
      link: modal("link"),
      linkVal: modal("linkVal"),
      gallery: modal("gallery"),
      galleryHint: modal("galleryHint"),
      galleryEmpty: modal("galleryEmpty"),
      shotAlt: modal.raw("shotAlt"),
      zoom: modal("zoom"),
      zoomClose: modal("zoomClose"),
      shotPrev: modal("shotPrev"),
      shotNext: modal("shotNext"),
      close: modal("close"),
      prev: modal("prev"),
      next: modal("next"),
    },
  };

  return (
    <section className="mh-sec mh-projects-sec" id="projets" aria-labelledby="projects-title">
      <div className="mh-wrap">
        <div className="mh-sec-head">
          <div>
            <p className="mh-eyebrow">{t("eyebrow")}</p>
            <h2 className="mh-h2" id="projects-title">
              {t("title")}
            </h2>
          </div>
          <p className="mh-lead">{t("intro")}</p>
        </div>
        <ProjectsExplorer projects={views} labels={labels} />
      </div>
    </section>
  );
}
