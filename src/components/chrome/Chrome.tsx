"use client";

import { m, useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Ic } from "@/components/ui/Ic";
import { useMediaQuery } from "@/lib/use-media-query";
import { BottomBar } from "./BottomBar";
import { Cursor } from "./Cursor";
import { CvMenu } from "./CvMenu";
import { LangSwitch } from "./LangSwitch";
import { MobileMenu } from "./MobileMenu";
import { Preloader } from "./Preloader";
import type { ChromeLabels, ChromeNavItem, CvItem } from "./types";

const SCROLLED_AT = 24;

// Ligne d'observation fine à la hauteur du header.
const HEADER_LINE = "-6% 0px -93% 0px";

function useDarkHeader() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const seen = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) seen.add(entry.target);
          else seen.delete(entry.target);
        });
        setDark(seen.size > 0);
      },
      { rootMargin: HEADER_LINE },
    );
    document.querySelectorAll("#parcours, .mh-contact").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return dark;
}

type ChromeProps = {
  labels: ChromeLabels;
  desktopNav: ChromeNavItem[];
  mobileNav: ChromeNavItem[];
  cv: CvItem[];
};

export function Chrome({ labels, desktopNav, mobileNav, cv }: ChromeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const dark = useDarkHeader();
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > SCROLLED_AT));

  const closeCv = useCallback(() => setCvOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleCv = useCallback(() => setCvOpen((value) => !value), []);

  const headerClass = ["mh-header", dark && "is-dark", scrolled && "is-scrolled"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mh-fixed">
      <div className="mh-vp">
        <header className={headerClass}>
          <div className="mh-hbar">
            <a className="mh-logo" href="#accueil" aria-label={labels.logoAria}>
              <span>mehdi</span>
              <span className="mh-caret" aria-hidden="true" />
            </a>
            <nav className="mh-nav" aria-label={labels.navAria}>
              {desktopNav.map((item) => (
                <a key={item.href} className="mh-nav-link" href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mh-hactions">
              <LangSwitch label={labels.langAria} />
              <CvMenu
                open={cvOpen}
                onToggle={toggleCv}
                onClose={closeCv}
                labels={labels}
                items={cv}
              />
              <a className="mh-btn mh-btn--primary mh-btn--sm mh-hdevis" href="#contact">
                {labels.quote}
              </a>
              <button
                type="button"
                className="mh-icon-btn mh-burger"
                aria-label={labels.menuOpen}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={(event) => {
                  // Safari ne donne pas le focus à un bouton cliqué : il doit pouvoir y revenir.
                  event.currentTarget.focus();
                  setMenuOpen(true);
                }}
              >
                <Ic name="burger" />
              </button>
            </div>
            <div className="mh-progress" aria-hidden="true">
              <m.span style={{ scaleX: scrollYProgress }} />
            </div>
          </div>
        </header>
        <BottomBar quote={labels.quote} whatsapp={labels.whatsapp} newTab={labels.newTab} />
        <div id="mh-overlays" />
        <MobileMenu
          open={menuOpen && !isDesktop}
          onClose={closeMenu}
          labels={labels}
          nav={mobileNav}
          cv={cv}
        />
        <Cursor label={labels.cursor} />
        <Preloader label={labels.loading} />
      </div>
    </div>
  );
}
