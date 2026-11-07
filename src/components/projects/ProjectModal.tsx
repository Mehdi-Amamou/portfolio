"use client";

import { AnimatePresence, m, useDragControls, type PanInfo } from "motion/react";
import { useEffect, useRef, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { Ic } from "@/components/ui/Ic";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { usePortalHost } from "@/lib/use-portal-host";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { Gallery } from "./Gallery";
import { ProjectMock } from "./ProjectMock";
import { ProjectResult } from "./ProjectResult";
import { SiteLink } from "./SiteLink";
import type { ProjectLabels, ProjectView } from "./types";

const SHEET_SPRING = { type: "spring", stiffness: 340, damping: 36 } as const;
const CLOSE_OFFSET = 120;
const CLOSE_VELOCITY = 600;

type ProjectModalProps = {
  project: ProjectView;
  labels: ProjectLabels;
  isPhone: boolean;
  layoutId?: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function ProjectModal({
  project,
  labels,
  isPhone,
  layoutId,
  onClose,
  onPrev,
  onNext,
}: ProjectModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  const host = usePortalHost();
  const drag = useDragControls();
  const copy = labels.modal;

  useScrollLock(true);
  useFocusTrap(panel, true, onClose);

  useEffect(() => {
    panel.current?.scrollTo({ top: 0 });
  }, [project.id]);

  const startDrag = (event: PointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    drag.start(event);
  };

  const endDrag = (_: unknown, info: PanInfo) => {
    if (info.offset.y > CLOSE_OFFSET || info.velocity.y > CLOSE_VELOCITY) onClose();
  };

  const hidden = isPhone ? { y: "100%" } : { opacity: 0, y: 24, scale: 0.97 };

  if (!host) return null;

  return createPortal(
    <div className="mh-modal">
      <m.button
        type="button"
        className="mh-scrim"
        aria-label={copy.close}
        tabIndex={-1}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <m.div
        ref={panel}
        className="mh-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        drag={isPhone ? "y" : false}
        dragControls={drag}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        dragMomentum={false}
        onDragEnd={endDrag}
        initial={hidden}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={hidden}
        transition={SHEET_SPRING}
      >
        <div className="mh-grab" aria-hidden="true" onPointerDown={startDrag} />
        <div className="mh-modal-head" onPointerDown={startDrag}>
          <div>
            <span className="mh-tag">{project.type}</span>
            <h2 className="mh-modal-title" id="project-title">
              {project.name}
            </h2>
          </div>
          <button
            type="button"
            className="mh-icon-btn"
            aria-label={copy.close}
            data-autofocus
            onClick={onClose}
          >
            <Ic name="close" />
          </button>
        </div>

        <div className="mh-modal-body">
          <ProjectMock
            project={project}
            labels={labels}
            layoutId={layoutId}
            sizes="(min-width: 1080px) 1016px, 100vw"
          />
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={project.id}
              className="mh-modal-copy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="mh-modal-grid">
                <div className="mh-story">
                  <div>
                    <h3>{copy.need}</h3>
                    <p>{project.need}</p>
                  </div>
                  <div>
                    <h3>{copy.did}</h3>
                    <p>{project.did}</p>
                  </div>
                  <div>
                    <h3>{copy.result}</h3>
                    <p>
                      <ProjectResult value={project.result} />
                    </p>
                  </div>
                </div>
                <dl className="mh-modal-meta">
                  <div>
                    <dt>{copy.client}</dt>
                    <dd>{project.client}</dd>
                  </div>
                  <div>
                    <dt>{copy.role}</dt>
                    <dd>{project.role}</dd>
                  </div>
                  <div>
                    <dt>{copy.year}</dt>
                    <dd className="mh-ph">{copy.yearVal}</dd>
                  </div>
                  <div>
                    <dt>{copy.link}</dt>
                    {project.url ? (
                      <dd>
                        <SiteLink project={project} labels={labels} />
                      </dd>
                    ) : (
                      <dd className="mh-ph">{copy.linkVal}</dd>
                    )}
                  </div>
                </dl>
              </div>
              <Gallery name={project.name} captures={project.captures} labels={copy} />
            </m.div>
          </AnimatePresence>
          <div className="mh-modal-foot">
            <button type="button" className="mh-btn mh-btn--secondary" onClick={onPrev}>
              <Ic name="left" size="sm" />
              <span>{copy.prev}</span>
            </button>
            <button type="button" className="mh-btn mh-btn--primary" onClick={onNext}>
              <span>{copy.next}</span>
              <Ic name="right" size="sm" />
            </button>
          </div>
        </div>
      </m.div>
    </div>,
    host,
  );
}
