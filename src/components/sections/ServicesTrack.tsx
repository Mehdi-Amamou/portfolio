"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Ic } from "@/components/ui/Ic";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReveal } from "@/lib/use-reveal";
import { useScrollFocus } from "@/lib/use-scroll-focus";

type ServicesTrackProps = {
  count: number;
  swipe: string;
  children: ReactNode;
};

export function ServicesTrack({ count, swipe, children }: ServicesTrackProps) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const isPhone = useMediaQuery("(max-width: 767px)");

  useReveal(track);
  useScrollFocus(track);

  useEffect(() => {
    const root = track.current;
    if (!root || !isPhone) return;
    const cards = Array.from(root.children) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActive(cards.indexOf(entry.target as HTMLElement));
        });
      },
      { root, threshold: 0.6 },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [isPhone]);

  useEffect(() => {
    const cards = Array.from(track.current?.children ?? []);
    cards.forEach((card, index) => card.classList.toggle("is-center", index === active));
  }, [active]);

  return (
    <>
      <div
        className="mh-svc-track mh-rv mh-rv--desk"
        ref={track}
        role="group"
        aria-labelledby="services-title"
      >
        {children}
      </div>
      <div className="mh-hint" aria-hidden="true">
        <span className="mh-hint-count">{`${active + 1} / ${count}`}</span>
        <span className="mh-hint-bar">
          <span style={{ transform: `scaleX(${(active + 1) / count})` }} />
        </span>
        <span className="mh-hint-txt">
          <Ic name="swipe" size="sm" />
          {swipe}
        </span>
      </div>
    </>
  );
}
