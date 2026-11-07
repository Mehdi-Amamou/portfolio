import { Ic } from "@/components/ui/Ic";
import { external } from "@/lib/external";
import type { ProjectLabels, ProjectView } from "./types";

type SiteLinkProps = {
  project: ProjectView;
  labels: Pick<ProjectLabels, "visit" | "soon" | "newTab">;
};

// « Voir le site » si le projet est en ligne (live: true dans projects.json), sinon « Bientôt en ligne ».
export function SiteLink({ project, labels }: SiteLinkProps) {
  if (!project.url) return null;

  if (!project.live) {
    return (
      <span className="mh-btn mh-btn--sm is-disabled mh-site-link" role="link" aria-disabled="true">
        {labels.soon}
      </span>
    );
  }

  return (
    <a
      className="mh-btn mh-btn--secondary mh-btn--sm mh-site-link"
      href={project.url}
      data-cursor-off
      {...external(`${labels.visit} ${project.name}`, labels.newTab)}
    >
      <span>{labels.visit}</span>
      <Ic name="upRight" size="sm" />
    </a>
  );
}
