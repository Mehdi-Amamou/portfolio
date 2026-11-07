"use client";

import { useParams, useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { routing, type Locale } from "@/i18n/routing";
import { localePath } from "@/lib/site-url";

type LangSwitchProps = {
  label: string;
  dark?: boolean;
  style?: React.CSSProperties;
};

// Le proxy lit ce cookie : sans lui, revenir sur / renverrait vers la langue précédente.
const rememberLocale = (locale: Locale) => {
  const { name, maxAge } = routing.localeCookie as { name: string; maxAge: number };
  document.cookie = `${name}=${locale};path=/;max-age=${maxAge};samesite=lax`;
};

export function LangSwitch({ label, dark, style }: LangSwitchProps) {
  const { locale } = useParams<{ locale: Locale }>();
  const router = useRouter();
  const [shown, setShown] = useOptimistic<Locale>(locale);
  const [, startTransition] = useTransition();

  const change = (next: Locale) => {
    if (next === locale) return;
    rememberLocale(next);
    startTransition(() => {
      setShown(next);
      router.replace(`${localePath(next)}${window.location.hash}`, { scroll: false });
    });
  };

  const classes = ["mh-lang", shown === "en" && "is-en", dark && "mh-lang--dark"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="group" aria-label={label} style={style}>
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          className={shown === code ? "mh-lang-btn is-on" : "mh-lang-btn"}
          aria-pressed={shown === code}
          lang={code}
          onClick={() => change(code)}
          onPointerEnter={() => router.prefetch(localePath(code))}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
