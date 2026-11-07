"use client";

import { useEffect, useState } from "react";
import { Ic } from "@/components/ui/Ic";
import { external } from "@/lib/external";

type BottomBarProps = {
  quote: string;
  whatsapp: string;
  newTab: string;
};

export function BottomBar({ quote, whatsapp, newTab }: BottomBarProps) {
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const form = document.querySelector(".mh-form");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={formVisible ? "mh-bbar-host no-bbar" : "mh-bbar-host"} aria-label={quote}>
      <div className="mh-bbar">
        <a className="mh-btn mh-btn--primary mh-bbar-devis" href="#contact">
          <span>{quote}</span>
          <Ic name="right" />
        </a>
        <a className="mh-btn mh-btn--dark mh-bbar-wa" href={whatsapp} {...external("WhatsApp", newTab)}>
          <Ic name="whatsapp" />
          <span>WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
