"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Ic } from "@/components/ui/Ic";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { useMediaQuery } from "@/lib/use-media-query";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { usePortalHost } from "@/lib/use-portal-host";
import type { ChromeLabels, CvItem } from "./types";

const SHEET_SPRING = { type: "spring", stiffness: 420, damping: 40 } as const;

function CvLink({ item, onPick }: { item: CvItem; onPick: () => void }) {
  return (
    <a className="mh-cv-item" href={item.href} download onClick={onPick}>
      <span className="mh-cv-code">{item.code}</span>
      <span className="mh-cv-text">
        <b>{item.label}</b>
        <small>{item.ready ? item.file : `[${item.file}]`}</small>
      </span>
      <Ic name="download" />
    </a>
  );
}

type CvMenuProps = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  labels: ChromeLabels;
  items: CvItem[];
};

export function CvMenu({ open, onToggle, onClose, labels, items }: CvMenuProps) {
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const isPhone = useMediaQuery("(max-width: 767px)");
  const host = usePortalHost();

  useScrollLock(open && isPhone);
  useFocusTrap(sheet, open && isPhone, onClose);

  useEffect(() => {
    if (!open || isPhone) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      onClose();
      button.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, isPhone, onClose]);

  return (
    <div className="mh-cv" ref={root}>
      <button
        ref={button}
        type="button"
        className={open ? "mh-cv-btn is-open" : "mh-cv-btn"}
        aria-expanded={open}
        aria-controls="cv-menu"
        aria-label={labels.cvAria}
        onClick={(event) => {
          event.currentTarget.focus();
          onToggle();
        }}
      >
        <Ic name="doc" size="sm" />
        <span>CV</span>
        <Ic name="chev" size="sm" className="mh-ic--chev" />
      </button>

      {open && !isPhone && (
        <div className="mh-cv-pop" id="cv-menu">
          <p className="mh-cv-title">
            <span>{labels.cvTitle}</span>
            <span className="mh-cv-tag">PDF</span>
          </p>
          {items.map((item) => (
            <CvLink key={item.code} item={item} onPick={onClose} />
          ))}
        </div>
      )}

      {host &&
        createPortal(
          <AnimatePresence>
            {open && isPhone && (
              <div className="mh-sheet-wrap" key="cv-sheet" id="cv-menu">
                <m.button
                  type="button"
                  className="mh-scrim"
                  aria-label={labels.close}
                  tabIndex={-1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                />
                <m.div
                  ref={sheet}
                  className="mh-sheet"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="cv-sheet-title"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={SHEET_SPRING}
                >
                  <div className="mh-grab" aria-hidden="true" />
                  <div className="mh-sheet-head">
                    <h2 id="cv-sheet-title">{labels.cvTitle}</h2>
                    <button
                      type="button"
                      className="mh-icon-btn"
                      aria-label={labels.close}
                      onClick={onClose}
                    >
                      <Ic name="close" />
                    </button>
                  </div>
                  {items.map((item) => (
                    <CvLink key={item.code} item={item} onPick={onClose} />
                  ))}
                </m.div>
              </div>
            )}
          </AnimatePresence>,
          host,
        )}
    </div>
  );
}
