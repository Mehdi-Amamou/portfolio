import type { ReactNode } from "react";

const paths = {
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  chev: <path d="m6 9 6 6 6-6" />,
  burger: <path d="M4 8h16M4 16h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  right: <path d="M5 12h14M13 6l6 6-6 6" />,
  left: <path d="M19 12H5M11 6l-6 6 6 6" />,
  up: <path d="M12 19V5M6 11l6-6 6 6" />,
  upRight: <path d="M7 17 17 7M8.5 7H17v8.5" />,
  download: <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  whatsapp: (
    <>
      <path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.6-4.4a8.4 8.4 0 1 1 15.4-4.5Z" />
      <path d="M9 10.5h6M9 13.5h4" />
    </>
  ),
  whatsappFoot: (
    <path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.6-4.4a8.4 8.4 0 1 1 15.4-4.5Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7.5 8 5.5 8-5.5" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <circle cx="9" cy="11" r="2.4" />
      <path d="M5.8 16.5c.7-1.6 1.8-2.4 3.2-2.4s2.5.8 3.2 2.4M15 10h3M15 13.5h3" />
    </>
  ),
  linkedinFoot: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <circle cx="9" cy="11" r="2.4" />
      <path d="M15 10h3M15 13.5h3" />
    </>
  ),
  code: <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5.5l-3 13" />,
  codeFoot: <path d="m8 8-4 4 4 4M16 8l4 4-4 4" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  inbox: (
    <>
      <path d="M4 13.5 6.4 5.5h11.2L20 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18v-4.5Z" />
      <path d="M4 13.5h4.5l1 2h5l1-2H20" />
    </>
  ),
  swipe: <path d="M8 8 4 12l4 4M16 8l4 4-4 4M4 12h16" />,
  site: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 9h18M7 13h5M7 16h3" />
    </>
  ),
  catalog: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <path d="M17 14v6M14 17h6" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3.5 8.5 4.75L12 13 3.5 8.25 12 3.5Z" />
      <path d="m3.5 12.25 8.5 4.75 8.5-4.75M3.5 16.25 12 21l8.5-4.75" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.4 3.2 8.3 7.5 9.5 4.3-1.2 7.5-5.1 7.5-9.5V6L12 3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  chat: (
    <path d="M5 5h14a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 16h-7l-4.5 3.5V16H5a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 5 5Z" />
  ),
  pen: (
    <>
      <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="m14.5 7.5 3 3" />
    </>
  ),
  launch: (
    <>
      <path d="M12 15V4.5m-4 4 4-4 4 4" />
      <path d="M4.5 14.5v3A2.5 2.5 0 0 0 7 20h10a2.5 2.5 0 0 0 2.5-2.5v-3" />
    </>
  ),
  refresh: (
    <>
      <path d="M19.5 12a7.5 7.5 0 0 1-13.3 4.8M4.5 12a7.5 7.5 0 0 1 13.3-4.8" />
      <path d="M18.3 3.5v3.8h-3.8M5.7 20.5v-3.8h3.8" />
    </>
  ),
  grad: (
    <>
      <path d="m12 4 9.5 5L12 14 2.5 9 12 4Z" />
      <path d="M6.5 11.2V16c1.5 1.7 3.4 2.5 5.5 2.5s4-.8 5.5-2.5v-4.8M21.5 9v5.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5S9.7 5.9 12 3.5Z" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="m7.5 9.5 3 2.5-3 2.5M12.5 15h4" />
    </>
  ),
  minimize: <path d="M6 12h12" />,
  maximize: <rect x="6" y="6" width="12" height="12" rx="1.5" />,
  quote: (
    <path d="M10 7.5H6.5A1.5 1.5 0 0 0 5 9v3.5A1.5 1.5 0 0 0 6.5 14H9v.5c0 1.8-1 3-3 3.5M19 7.5h-3.5A1.5 1.5 0 0 0 14 9v3.5a1.5 1.5 0 0 0 1.5 1.5H18v.5c0 1.8-1 3-3 3.5" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5M12 16.2v.1" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;

type IcProps = {
  name: IconName;
  size?: "sm";
  className?: string;
};

export function Ic({ name, size, className }: IcProps) {
  const classes = ["mh-ic", size === "sm" && "mh-ic--sm", className].filter(Boolean).join(" ");
  return (
    <svg className={classes} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
