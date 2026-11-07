"use client";

import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { Ic } from "@/components/ui/Ic";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { usePortalHost } from "@/lib/use-portal-host";
import { useScrollLock } from "@/lib/use-scroll-lock";
import type { Capture, GalleryLabels } from "./types";

// Seules les captures à une position de celle affichée sont chargées.
const NEAR = 1;

const around = (index: number) => Array.from({ length: NEAR * 2 + 1 }, (_, k) => index - NEAR + k);

// Défilement natif en scroll-snap : swipe sur téléphone, flèches et clavier sur ordinateur.
function useSlides(count: number, start = 0) {
  const track = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [index, setIndex] = useState(start);
  const [loaded, setLoaded] = useState(() => new Set(around(start)));

  const reach = useCallback((target: number) => {
    setLoaded((current) => {
      const missing = around(target).filter((i) => !current.has(i));
      return missing.length ? new Set([...current, ...missing]) : current;
    });
  }, []);

  const go = useCallback(
    (target: number) => {
      const el = track.current;
      if (!el) return;
      const next = Math.max(0, Math.min(count - 1, target));
      reach(next);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: next * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
    },
    [count, reach],
  );

  // Placement immédiat, sans animation, puis focus sur la capture affichée (retour du zoom).
  const jump = useCallback(
    (target: number) => {
      const el = track.current;
      if (!el) return;
      el.scrollLeft = target * el.clientWidth;
      setIndex(target);
      reach(target);
      requestAnimationFrame(() => el.querySelectorAll<HTMLElement>(".mh-gal-open")[target]?.focus());
    },
    [reach],
  );

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = track.current;
      if (!el || el.clientWidth === 0) return;
      const current = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(current);
      reach(current);
    });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: count - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    go(moves[event.key]);
  };

  // Le zoom s'ouvre sur la capture affichée, sans animation.
  useLayoutEffect(() => {
    const el = track.current;
    if (el && start > 0) el.scrollLeft = start * el.clientWidth;
  }, [start]);

  return { track, index, loaded, go, jump, onScroll, onKeyDown };
}

type Slides = Omit<ReturnType<typeof useSlides>, "track" | "jump">;

type TrackProps = {
  captures: Capture[];
  trackRef: React.RefObject<HTMLDivElement | null>;
  slides: Slides;
  alt: (index: number) => string;
  sizes: string;
  label: string;
  zoom?: boolean;
  onOpen?: (index: number, event: MouseEvent<HTMLButtonElement>) => void;
  openLabel?: string;
};

function Track({ captures, trackRef, slides, alt, sizes, label, zoom, onOpen, openLabel }: TrackProps) {
  return (
    <div
      ref={trackRef}
      className={zoom ? "mh-gal-track mh-gal-track--zoom" : "mh-gal-track"}
      tabIndex={0}
      role="group"
      aria-label={label}
      onScroll={slides.onScroll}
      onKeyDown={slides.onKeyDown}
    >
      {captures.map((capture, index) => {
        const image = slides.loaded.has(index) && (
          <Image src={capture.src} alt={alt(index)} fill sizes={sizes} loading="eager" />
        );
        return (
          <figure className="mh-gal-slide" key={capture.src} inert={index !== slides.index}>
            {onOpen ? (
              <button
                type="button"
                className="mh-gal-open"
                aria-label={`${openLabel} : ${alt(index)}`}
                onClick={(event) => onOpen(index, event)}
              >
                {image}
              </button>
            ) : (
              image
            )}
          </figure>
        );
      })}
    </div>
  );
}

function Arrows({ slides, count, labels, dark }: { slides: Slides; count: number; labels: GalleryLabels; dark?: boolean }) {
  if (count < 2) return null;
  const tone = dark ? "mh-icon-btn mh-icon-btn--dark mh-gal-nav" : "mh-icon-btn mh-gal-nav";
  return (
    <>
      <button
        type="button"
        className={`${tone} mh-gal-nav--prev`}
        aria-label={labels.shotPrev}
        disabled={slides.index === 0}
        onClick={() => slides.go(slides.index - 1)}
      >
        <Ic name="left" />
      </button>
      <button
        type="button"
        className={`${tone} mh-gal-nav--next`}
        aria-label={labels.shotNext}
        disabled={slides.index === count - 1}
        onClick={() => slides.go(slides.index + 1)}
      >
        <Ic name="right" />
      </button>
    </>
  );
}

type ZoomProps = {
  captures: Capture[];
  start: number;
  alt: (index: number) => string;
  labels: GalleryLabels;
  onClose: (index: number) => void;
};

function Zoom({ captures, start, alt, labels, onClose }: ZoomProps) {
  const root = useRef<HTMLDivElement>(null);
  const host = usePortalHost();
  const { track, ...slides } = useSlides(captures.length, start);
  const close = () => onClose(slides.index);

  useScrollLock(true);
  useFocusTrap(root, true, close);

  if (!host) return null;

  return createPortal(
    <m.div
      ref={root}
      className="mh-zoom"
      role="dialog"
      aria-modal="true"
      aria-label={alt(slides.index)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onKeyDown={slides.onKeyDown}
    >
      <div className="mh-zoom-bar">
        <span className="mh-gal-count">
          {slides.index + 1} / {captures.length}
        </span>
        <button
          type="button"
          className="mh-icon-btn mh-icon-btn--dark"
          aria-label={labels.zoomClose}
          data-autofocus
          onClick={close}
        >
          <Ic name="close" />
        </button>
      </div>
      <div className="mh-zoom-stage">
        <Track
          captures={captures}
          trackRef={track}
          slides={slides}
          alt={alt}
          sizes="100vw"
          label={labels.gallery}
          zoom
        />
        <Arrows slides={slides} count={captures.length} labels={labels} dark />
      </div>
    </m.div>,
    host,
  );
}

type GalleryProps = {
  name: string;
  captures: Capture[];
  labels: GalleryLabels;
};

export function Gallery({ name, captures, labels }: GalleryProps) {
  const { track, jump, ...slides } = useSlides(captures.length);
  const [zoomAt, setZoomAt] = useState<number | null>(null);
  const total = captures.length;

  const alt = (index: number) =>
    labels.shotAlt
      .replace("{name}", name)
      .replace("{n}", String(index + 1))
      .replace("{total}", String(total));

  const open = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    // Safari ne donne pas le focus au bouton cliqué : il doit pouvoir y revenir à la fermeture.
    event.currentTarget.focus();
    setZoomAt(index);
  };

  const close = (index: number) => {
    setZoomAt(null);
    jump(index);
  };

  const head = (
    <div className="mh-gal-head">
      <h3>{labels.gallery}</h3>
      {total > 0 && <p>{labels.galleryHint}</p>}
    </div>
  );

  if (total === 0) {
    return (
      <div className="mh-gal">
        {head}
        <div className="mh-gal-empty">
          <span className="mh-ph">{labels.galleryEmpty}</span>
        </div>
      </div>
    );
  }

  const ratio = { "--ar": `${captures[0].width} / ${captures[0].height}` } as CSSProperties;

  return (
    <div className="mh-gal">
      {head}
      <div className="mh-gal-frame" style={ratio}>
        <Track
          captures={captures}
          trackRef={track}
          slides={slides}
          alt={alt}
          sizes="(min-width: 1080px) 1016px, 100vw"
          label={`${labels.gallery} : ${name}`}
          onOpen={open}
          openLabel={labels.zoom}
        />
        <span className="mh-gal-count" aria-hidden="true">
          {slides.index + 1} / {total}
        </span>
        <Arrows slides={slides} count={total} labels={labels} />
      </div>
      <AnimatePresence>
        {zoomAt !== null && (
          <Zoom key="zoom" captures={captures} start={zoomAt} alt={alt} labels={labels} onClose={close} />
        )}
      </AnimatePresence>
    </div>
  );
}
