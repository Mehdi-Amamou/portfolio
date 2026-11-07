import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { SiteChrome } from "@/components/chrome/SiteChrome";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Method } from "@/components/sections/Method";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { PersonJsonLd } from "@/components/ui/PersonJsonLd";
import type { Locale } from "@/i18n/routing";

export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);
  const t = useTranslations();

  return (
    <>
      <a className="mh-sr" href="#services">
        {t("skip")}
      </a>
      <PersonJsonLd />
      <SiteChrome />
      <main>
        <Hero />
        <Services />
        <Projects />
        <Method />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
