"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Ic } from "@/components/ui/Ic";
import { useMediaQuery } from "@/lib/use-media-query";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import type { ProjectFilter, ProjectLabels, ProjectView } from "./types";

const FILTERS: ProjectFilter[] = ["all", "vitrine", "catalogue", "plateforme"];

const inFilter = (project: ProjectView, filter: ProjectFilter) =>
  filter === "all" || project.categories.includes(filter);

const pad = (value: number) => String(value).padStart(2, "0");

type ProjectsExplorerProps = {
  projects: ProjectView[];
  labels: ProjectLabels;
};

export function ProjectsExplorer({ projects, labels }: ProjectsExplorerProps) {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [originId, setOriginId] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const isPhone = useMediaQuery("(max-width: 767px)");

  const visible = useMemo(
    () => projects.filter((project) => inFilter(project, filter)),
    [projects, filter],
  );
  const openIndex = visible.findIndex((project) => project.id === openId);
  const opened = openIndex >= 0 ? visible[openIndex] : null;

  useEffect(() => {
    const root = track.current;
    if (!root || !isPhone) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".mh-proj"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = cards.indexOf(entry.target as HTMLElement);
          if (index >= 0) setSlide(index);
        });
      },
      { root, threshold: 0.6 },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [isPhone, visible]);

  const changeFilter = (next: ProjectFilter) => {
    setFilter(next);
    setSlide(0);
    track.current?.scrollTo({ left: 0 });
  };

  const goToSlide = (index: number) => {
    const root = track.current;
    const card = root?.querySelectorAll<HTMLElement>(".mh-proj")[index];
    if (!root || !card) return;
    root.scrollTo({ left: card.offsetLeft - root.offsetLeft - parseFloat(getComputedStyle(root).paddingLeft) });
  };

  const open = (id: string) => {
    setOriginId(id);
    setOpenId(id);
  };

  const step = (delta: number) => {
    const next = (openIndex + delta + visible.length) % visible.length;
    setOpenId(visible[next].id);
  };

  // Le mockup ne s'envole depuis la carte que pour le projet d'ouverture, pas après précédent / suivant.
  const mockId = (id: string) => (id === originId && id === openId ? `mock-${id}` : undefined);

  return (
    <>
      <m.div className="mh-filters" role="group" aria-label={labels.filterAria} layoutScroll>
        {FILTERS.map((key) => {
          const on = filter === key;
          return (
            <button
              key={key}
              type="button"
              className={on ? "mh-filter is-on" : "mh-filter"}
              aria-pressed={on}
              onClick={() => changeFilter(key)}
            >
              {on && (
                <m.span
                  className="mh-filter-pill"
                  layoutId="filter-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span>{labels.filters[key]}</span>
              <small>{projects.filter((project) => inFilter(project, key)).length}</small>
            </button>
          );
        })}
      </m.div>

      <m.div className="mh-proj-track" ref={track} layoutScroll>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              number={projects.indexOf(project) + 1}
              labels={labels}
              layoutId={mockId(project.id)}
              onOpen={() => open(project.id)}
            />
          ))}
        </AnimatePresence>
      </m.div>

      <div className="mh-pager">
        <span className="mh-pager-count">
          {pad(slide + 1)} <span>/ {pad(visible.length)}</span>
        </span>
        <span className="mh-hint-bar">
          <span style={{ transform: `scaleX(${(slide + 1) / visible.length})` }} />
        </span>
        <button
          type="button"
          className="mh-icon-btn"
          aria-label={labels.prev}
          disabled={slide === 0}
          onClick={() => goToSlide(slide - 1)}
        >
          <Ic name="left" />
        </button>
        <button
          type="button"
          className="mh-icon-btn"
          aria-label={labels.next}
          disabled={slide === visible.length - 1}
          onClick={() => goToSlide(slide + 1)}
        >
          <Ic name="right" />
        </button>
      </div>

      <AnimatePresence onExitComplete={() => setOriginId(null)}>
        {opened && (
          <ProjectModal
            key="project-modal"
            project={opened}
            labels={labels}
            isPhone={isPhone}
            layoutId={mockId(opened.id)}
            onClose={() => setOpenId(null)}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
