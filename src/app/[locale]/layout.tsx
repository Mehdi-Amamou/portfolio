import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CSSProperties } from "react";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { routing } from "@/i18n/routing";
import { PRELOAD_SCRIPT } from "@/lib/preload-script";
import { localePath, siteUrl } from "@/lib/site-url";
import "../site.css";
import "../extras.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const OG_IMAGE = "/og-image.png";

export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: "#FAFAFC",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as "fr" | "en", namespace: "meta" });
  const title = t("title");
  const description = t("description");
  const url = localePath(locale);

  // OG_IMAGE=sans retire seulement l'image : tout le reste du partage reste identique.
  const withImage = process.env.OG_IMAGE !== "sans";
  const image = { url: OG_IMAGE, width: 1200, height: 630, alt: t("ogAlt"), type: "image/png" };

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        fr: localePath("fr"),
        en: localePath("en"),
        "x-default": localePath("fr"),
      },
    },
    openGraph: {
      type: "website",
      siteName: "Mehdi Amamou",
      title,
      description,
      url,
      locale: locale === "en" ? "en_US" : "fr_FR",
      alternateLocale: locale === "en" ? "fr_FR" : "en_US",
      ...(withImage && { images: [image] }),
    },
    twitter: {
      card: withImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(withImage && { images: [{ url: OG_IMAGE, alt: t("ogAlt") }] }),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${geist.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRELOAD_SCRIPT }} />
      </head>
      <body>
        <MotionProvider>
          <div className="mh is-motion" style={{ "--screen": "100svh" } as CSSProperties}>
            <div className="mh-page">{children}</div>
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
