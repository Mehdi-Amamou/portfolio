"use client";

import { AnimatePresence, m } from "motion/react";
import { useRef, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { links } from "@/content/site";
import { Ic } from "@/components/ui/Ic";
import { external } from "@/lib/external";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { usePortalHost } from "@/lib/use-portal-host";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { LangSwitch } from "./LangSwitch";
import type { ChromeLabels, ChromeNavItem, CvItem } from "./types";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  labels: ChromeLabels;
  nav: ChromeNavItem[];
  cv: CvItem[];
};

export function MobileMenu({ open, onClose, labels, nav, cv }: MobileMenuProps) {
  const panel = useRef<HTMLDivElement>(null);
  const host = usePortalHost();

  useScrollLock(open);
  useFocusTrap(panel, open, onClose);

  // Le scroll est bloqué pendant que le menu est ouvert : on ferme d'abord, puis on rejoint l'ancre.
  const goTo = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    onClose();
    requestAnimationFrame(() => {
      history.replaceState(null, "", href);
      document.querySelector(href)?.scrollIntoView();
    });
  };

  if (!host) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          ref={panel}
          className="mh-menu"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={labels.menuLabel}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mh-menu-glow" aria-hidden="true" />
          <div className="mh-menu-top">
            <a
              className="mh-logo"
              href="#accueil"
              aria-label={labels.logoAria}
              onClick={(event) => goTo(event, "#accueil")}
            >
              <span>mehdi</span>
              <span className="mh-caret" aria-hidden="true" />
            </a>
            <LangSwitch label={labels.langAria} dark />
            <button
              type="button"
              className="mh-icon-btn mh-icon-btn--dark"
              aria-label={labels.menuClose}
              data-autofocus
              onClick={onClose}
            >
              <Ic name="close" />
            </button>
          </div>

          <nav className="mh-menu-nav" aria-label={labels.navAria}>
            {nav.map((item, index) => (
              <a
                key={item.href}
                className="mh-menu-link"
                href={item.href}
                style={{ "--i": index } as React.CSSProperties}
                onClick={(event) => goTo(event, item.href)}
              >
                <span className="mh-menu-num">{item.num}</span>
                <span className="mh-menu-label">{item.label}</span>
                <Ic name="upRight" />
              </a>
            ))}
          </nav>

          <div className="mh-menu-foot">
            <p className="mh-kicker">{labels.cvTitle}</p>
            <div className="mh-menu-cv">
              {cv.map((item) => (
                <a key={item.code} href={item.href} download>
                  <Ic name="download" />
                  <span>{item.short}</span>
                </a>
              ))}
            </div>
            <div className="mh-menu-actions">
              <a
                className="mh-btn mh-btn--primary"
                href="#contact"
                onClick={(event) => goTo(event, "#contact")}
              >
                {labels.quote}
              </a>
              <a
                className="mh-btn mh-btn--glass"
                href={labels.whatsapp}
                {...external("WhatsApp", labels.newTab)}
              >
                <Ic name="whatsapp" />
                <span>WhatsApp</span>
              </a>
            </div>
            <p className="mh-menu-mail">{links.email}</p>
          </div>
        </m.div>
      )}
    </AnimatePresence>,
    host,
  );
}
