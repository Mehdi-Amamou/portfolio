"use client";

import { m } from "motion/react";
import { forwardRef } from "react";
import { Ic } from "@/components/ui/Ic";
import { ProjectMock } from "./ProjectMock";
import { ProjectResult } from "./ProjectResult";
import { SiteLink } from "./SiteLink";
import type { ProjectLabels, ProjectView } from "./types";

type ProjectCardProps = {
  project: ProjectView;
  number: number;
  labels: ProjectLabels;
  layoutId?: string;
  onOpen: () => void;
};

export const ProjectCard = forwardRef<HTMLElement, ProjectCardProps>(function ProjectCard(
  { project, number, labels, layoutId, onOpen },
  ref,
) {
  const classes = [
    "mh-proj",
    project.featured && "is-featured",
    project.placeholder && "is-placeholder",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <m.article
      ref={ref}
      layout="position"
      className={classes}
      data-cursor
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mh-proj-media">
        <ProjectMock
          project={project}
          labels={labels}
          layoutId={layoutId}
          sizes="(min-width: 1024px) 60vw, (min-width: 768px) 50vw, 90vw"
        />
      </div>
      <div className="mh-proj-info">
        <div className="mh-proj-tags">
          <span className="mh-tag">{project.type}</span>
          <span className="mh-num">{`0${number}`}</span>
        </div>
        <h3 className="mh-h3 mh-proj-name">{project.name}</h3>
        <p className="mh-proj-desc">{project.desc}</p>
        <dl className="mh-meta">
          <div>
            <dt>{labels.stack}</dt>
            <dd className="mh-stack">
              {project.stack.map((tech) => (
                <span className="mh-tech" key={tech}>
                  {tech}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt>{labels.role}</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>{labels.result}</dt>
            <dd>
              <ProjectResult value={project.result} />
            </dd>
          </div>
        </dl>
        <div className="mh-proj-actions">
          <button
            type="button"
            className="mh-proj-cta"
            aria-label={`${labels.view} : ${project.name}`}
            onClick={(event) => {
              event.currentTarget.focus();
              onOpen();
            }}
          >
            <span>{labels.view}</span>
            <span className="mh-proj-cta-ic">
              <Ic name="upRight" />
            </span>
          </button>
          <SiteLink project={project} labels={labels} />
        </div>
      </div>
    </m.article>
  );
});
