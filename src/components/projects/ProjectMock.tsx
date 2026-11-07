import { m } from "motion/react";
import { ProjectShot } from "./ProjectShot";
import type { ProjectLabels, ProjectView } from "./types";

type ProjectMockProps = {
  project: ProjectView;
  labels: ProjectLabels;
  layoutId?: string;
  sizes: string;
};

export function ProjectMock({ project, labels, layoutId, sizes }: ProjectMockProps) {
  return (
    <m.div
      className={`mh-mock ${project.tint}`}
      layoutId={layoutId}
      style={{ borderRadius: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 34 }}
    >
      <div className="mh-laptop">
        <div className="mh-laptop-screen">
          <ProjectShot
            src={project.thumb?.src}
            alt={project.name}
            label={labels.shot}
            sizes={sizes}
          />
        </div>
        <div className="mh-laptop-base" />
      </div>
      <div className="mh-phone-dev">
        <ProjectShot
          src={project.phone?.src}
          alt=""
          label={labels.shotSm}
          sizes="(min-width: 1024px) 200px, 120px"
        />
      </div>
    </m.div>
  );
}
