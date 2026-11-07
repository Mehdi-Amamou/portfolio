"use client";

import { m } from "motion/react";
import { useEffect, useRef } from "react";
import { Ic } from "@/components/ui/Ic";
import { external } from "@/lib/external";
import type { ContactLabels } from "./types";

type SentCardProps = {
  labels: ContactLabels;
  name: string;
  email: string;
  project: string;
  onReset: () => void;
};

export function SentCard({ labels, name, email, project, onReset }: SentCardProps) {
  const title = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    title.current?.focus({ preventScroll: true });
    title.current?.closest(".mh-form")?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <m.div
      className="mh-sent"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <m.span
        className="mh-sent-ic"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 16 }}
      >
        <svg className="mh-ic" viewBox="0 0 24 24" aria-hidden="true">
          <m.path
            d="m5 12.5 4.5 4.5L19 7.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
          />
        </svg>
      </m.span>
      <h3 ref={title} tabIndex={-1}>
        {labels.sentTitle}
      </h3>
      <p>
        {labels.sentA}
        {name}
        {labels.sentB}
        {email}.
      </p>
      <div className="mh-sent-recap">
        <b>{labels.recap}</b>
        {project}
      </div>
      <div className="mh-sent-btns">
        <a
          className="mh-btn mh-btn--dark"
          href={labels.whatsapp}
          {...external(labels.sentWa, labels.newTab)}
        >
          <Ic name="whatsapp" />
          <span>{labels.sentWa}</span>
        </a>
        <button type="button" className="mh-btn mh-btn--secondary" onClick={onReset}>
          {labels.sentNew}
        </button>
      </div>
    </m.div>
  );
}
