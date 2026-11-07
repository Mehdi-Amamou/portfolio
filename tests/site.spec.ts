import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { DESKTOP, isLocked, jumpTo, open, PHONE, skipPreloader } from "./helpers";

const WIDTHS = [390, 768, 1024, 1440, 1920];

test.describe("mise en page", () => {
  for (const width of WIDTHS) {
    for (const path of ["/", "/en"]) {
      test(`aucun scroll horizontal à ${width} px sur ${path}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await open(page, path);
        const overflow = () =>
          page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(await overflow()).toBeLessThanOrEqual(0);
        await jumpTo(page, "footer", 0);
        expect(await overflow()).toBeLessThanOrEqual(0);
      });
    }
  }

  test("zones tactiles d'au moins 44 px et texte courant lisible sur téléphone", async ({ page }) => {
    await page.setViewportSize(PHONE);
    await open(page);
    const small = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>("a[href], button, input, textarea"))
        .filter((el) => el.getClientRects().length > 0 && !el.classList.contains("mh-sr"))
        .filter((el) => getComputedStyle(el).opacity !== "0" && el.tabIndex !== -1)
        .filter((el) => el.getBoundingClientRect().height < 44)
        .map((el) => el.className || el.tagName),
    );
    expect(small).toEqual([]);
    expect(await page.locator("#f-name").evaluate((el) => getComputedStyle(el).fontSize)).toBe("16px");
  });

  test("la section témoignages est masquée en production", async ({ page }) => {
    await open(page);
    await expect(page.locator("#temoignages")).toHaveCount(0);
  });
});

test.describe("menu mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(PHONE);
    await open(page);
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await expect(page.locator(".mh-menu")).toBeVisible();
  });

  test("bloque le scroll, piège le focus et se ferme avec Échap", async ({ page }) => {
    expect(await isLocked(page)).toBe(true);
    await expect(page.getByRole("button", { name: "Fermer le menu" })).toBeFocused();

    for (let press = 0; press < 20; press += 1) await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest(".mh-menu"))).toBe(true);

    await page.keyboard.press("Escape");
    await expect(page.locator(".mh-menu")).toHaveCount(0);
    expect(await isLocked(page)).toBe(false);
    await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toBeFocused();
  });

  test("n'affiche pas Avis tant qu'il n'y a pas d'avis, et un lien mène à sa section", async ({ page }) => {
    const items = page.locator(".mh-menu-link");
    await expect(items).toHaveCount(5);
    await expect(items.filter({ hasText: "Avis" })).toHaveCount(0);

    await items.filter({ hasText: "Parcours" }).click();
    await expect(page.locator(".mh-menu")).toHaveCount(0);
    await expect
      .poll(() => page.evaluate(() => Math.abs(document.querySelector("#parcours")!.getBoundingClientRect().top)))
      .toBeLessThan(120);
  });
});

test.describe("menu CV", () => {
  test("popover sur ordinateur : Échap et clic à l'extérieur", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    const button = page.getByRole("button", { name: "Télécharger mon CV" });

    await button.click();
    await expect(page.locator(".mh-cv-pop")).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(page.locator(".mh-cv-pop")).toHaveCount(0);
    await expect(button).toBeFocused();

    await button.click();
    await page.mouse.click(200, 500);
    await expect(page.locator(".mh-cv-pop")).toHaveCount(0);
  });

  test("feuille basse sur téléphone", async ({ page }) => {
    await page.setViewportSize(PHONE);
    await open(page);
    await page.getByRole("button", { name: "Télécharger mon CV" }).click();
    await expect(page.locator(".mh-sheet")).toBeVisible();
    await expect(page.locator(".mh-sheet .mh-cv-item")).toHaveCount(2);
    expect(await isLocked(page)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(page.locator(".mh-sheet")).toHaveCount(0);
    expect(await isLocked(page)).toBe(false);
  });
});

test.describe("projets", () => {
  test("filtres avec compteurs", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await expect(page.locator(".mh-proj")).toHaveCount(5);
    await page.getByRole("button", { name: /Sites vitrines/ }).click();
    await expect(page.locator(".mh-proj")).toHaveCount(3);
    await page.getByRole("button", { name: /Plateformes/ }).click();
    await expect(page.locator(".mh-proj")).toHaveCount(1);
    await page.getByRole("button", { name: /^Tous/ }).click();
    await expect(page.locator(".mh-proj")).toHaveCount(5);
  });

  test("modale : Échap, ✕, clic sur le fond, précédent et suivant", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await jumpTo(page, ".mh-filters");
    const trigger = page.getByRole("button", { name: "Voir le projet : Lanergy" });

    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator("#project-title")).toHaveText("Lanergy");
    expect(await isLocked(page)).toBe(true);

    await page.locator(".mh-modal-foot .mh-btn--primary").click();
    await expect(page.locator("#project-title")).toHaveText("Etadames Art");
    await page.locator(".mh-modal-foot .mh-btn--secondary").click();
    await expect(page.locator("#project-title")).toHaveText("Lanergy");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(await isLocked(page)).toBe(false);
    await expect(trigger).toBeFocused();

    await trigger.click();
    await page.locator(".mh-modal-head").getByRole("button", { name: "Fermer" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await trigger.click();
    await page.mouse.click(40, 450);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("galerie : compteur, clavier, chargement progressif et zoom plein écran", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await expect(page.locator(".mh-proj").last().locator(".mh-laptop .mh-ph")).toHaveText("[capture à fournir]");
    await expect(page.locator(".mh-proj").first().locator(".mh-laptop img")).toHaveCount(1);

    await jumpTo(page, ".mh-filters");
    await page.getByRole("button", { name: "Voir le projet : Lanergy" }).click();
    const gallery = page.locator(".mh-modal .mh-gal-frame");
    const total = await gallery.locator(".mh-gal-slide").count();
    expect(total).toBeGreaterThan(2);
    await expect(gallery.locator(".mh-gal-count")).toHaveText(`1 / ${total}`);
    expect(await gallery.locator("img").count()).toBeLessThanOrEqual(2);

    await gallery.locator(".mh-gal-track").focus();
    await page.keyboard.press("ArrowRight");
    await expect(gallery.locator(".mh-gal-count")).toHaveText(`2 / ${total}`);
    await page.getByRole("button", { name: "Capture suivante" }).click();
    await expect(gallery.locator(".mh-gal-count")).toHaveText(`3 / ${total}`);
    expect(await gallery.locator("img").count()).toBeLessThan(total);

    await gallery.locator(".mh-gal-slide:not([inert]) .mh-gal-open").click();
    const zoom = page.locator(".mh-zoom");
    await expect(zoom).toBeVisible();
    await expect(zoom.locator(".mh-gal-count")).toHaveText(`3 / ${total}`);
    await page.keyboard.press("Escape");
    await expect(zoom).toHaveCount(0);
    await expect(page.getByRole("dialog")).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("« Voir le site » : actif si le projet est en ligne, « Bientôt en ligne » sinon", async ({ page }) => {
    await open(page);
    const live = page.locator(".mh-proj a.mh-site-link");
    await expect(live).toHaveCount(2);
    for (const link of await live.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      await expect(link).toHaveAttribute("aria-label", /^Voir le site .+ \(nouvel onglet\)$/);
    }
    await expect(page.locator('.mh-proj a.mh-site-link[href="https://securinets-eps.vercel.app"]')).toHaveCount(1);
    const soon = page.locator(".mh-proj .mh-site-link.is-disabled");
    await expect(soon).toHaveCount(2);
    await expect(soon.first()).toHaveText("Bientôt en ligne");
    await expect(soon.first()).toHaveAttribute("aria-disabled", "true");
  });

  test("slider sur téléphone", async ({ page }) => {
    await page.setViewportSize(PHONE);
    await open(page);
    await jumpTo(page, ".mh-filters");
    await expect(page.locator(".mh-pager-count")).toContainText("01");
    await page.getByRole("button", { name: "Projet suivant" }).click();
    await expect(page.locator(".mh-pager-count")).toContainText("02");
    await page.getByRole("button", { name: "Projet précédent" }).click();
    await expect(page.locator(".mh-pager-count")).toContainText("01");
  });
});

async function fillForm(page: Page) {
  await page.locator("#f-name").fill("Sami");
  await page.locator("#f-email").fill("sami@example.com");
  await page.locator("#f-project").fill("Un site vitrine pour mon atelier de céramique.");
}

test.describe("formulaire", () => {
  test("erreurs, correction en direct, puis succès avec SMTP simulé", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await jumpTo(page, ".mh-form");

    await page.locator(".mh-submit").click();
    const summary = page.locator(".mh-errsum");
    await expect(summary).toHaveText("3 champs à corriger");
    await expect(summary).toHaveAttribute("role", "alert");
    await expect(page.locator(".mh-err")).toHaveCount(3);
    await expect(page.locator("#f-name")).toHaveAttribute("aria-invalid", "true");

    await page.locator("#f-email").fill("sami@exa");
    await page.locator("#f-email").blur();
    await expect(page.locator(".mh-err").filter({ hasText: "incomplète" })).toBeVisible();

    await fillForm(page);
    await expect(page.locator(".mh-err")).toHaveCount(0);

    await page.locator(".mh-submit").click();
    await expect(page.locator(".mh-sent h3")).toHaveText("Message envoyé !");
    await expect(page.locator(".mh-sent")).toContainText("Merci Sami");
    await expect(page.locator(".mh-sent-recap")).toContainText("atelier de céramique");

    await page.getByRole("button", { name: "Nouveau message" }).click();
    await expect(page.locator("#f-name")).toHaveValue("");
  });

  test("répond dans la langue du visiteur", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page, "/en");
    await jumpTo(page, ".mh-form");
    await page.locator(".mh-submit").click();
    await expect(page.locator(".mh-errsum")).toHaveText("3 fields to fix");
    await fillForm(page);
    await page.locator(".mh-submit").click();
    await expect(page.locator(".mh-sent h3")).toHaveText("Message sent!");
  });

  test("le champ piège ne bloque pas le visiteur humain et reste hors du parcours clavier", async ({ page }) => {
    await open(page);
    const trap = page.locator('input[name="website"]');
    await expect(trap).toHaveAttribute("tabindex", "-1");
    await expect(trap).not.toBeInViewport();
  });

  test("la barre basse se masque quand le formulaire est visible", async ({ page }) => {
    await page.setViewportSize(PHONE);
    await open(page);
    const bar = page.locator(".mh-bbar");
    await expect(bar).toBeVisible();
    await jumpTo(page, ".mh-form");
    await expect(bar).toHaveCSS("opacity", "0");
  });
});

test.describe("langues", () => {
  test("bascule FR / EN sans recharger la page", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await page.evaluate(() => {
      (window as unknown as { marker: boolean }).marker = true;
    });

    await page.locator(".mh-hactions").getByRole("button", { name: "EN" }).click();
    await page.waitForURL("**/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator(".mh-h1 .mh-sr")).toHaveText("I build websites that bring in clients");
    await expect(page).toHaveTitle(/Freelance web developer/);
    expect(await page.evaluate(() => (window as unknown as { marker?: boolean }).marker)).toBe(true);

    await page.locator(".mh-hactions").getByRole("button", { name: "FR" }).click();
    await page.waitForURL((url) => url.pathname === "/");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    expect(await page.evaluate(() => (window as unknown as { marker?: boolean }).marker)).toBe(true);
  });

  test("le cookie NEXT_LOCALE prend le pas au retour", async ({ page, context }) => {
    await open(page, "/en");
    await page.locator(".mh-hactions").getByRole("button", { name: "FR" }).click();
    await page.waitForURL((url) => url.pathname === "/");
    await expect
      .poll(async () => (await context.cookies()).find((c) => c.name === "NEXT_LOCALE")?.value)
      .toBe("fr");
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  });

  test("détecte Accept-Language au premier passage", async ({ browser, baseURL }) => {
    const context = await browser.newContext({ locale: "en-US", baseURL });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await context.close();
  });

  test("404 traduite", async ({ page }) => {
    const response = await page.goto("/en/rien-ici");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText("Page not found.");
  });
});

test.describe("préloader", () => {
  test("une seule fois par session et en 800 ms au plus", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-pre", "");
    await page.waitForTimeout(850);
    await expect(page.locator("html")).not.toHaveAttribute("data-pre", "");
    await page.reload();
    await expect(page.locator("html")).not.toHaveAttribute("data-pre", "");
  });
});

test.describe("reduced-motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("aucune animation et tout le contenu visible tout de suite", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-pre", "");

    const state = await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, document.body.scrollHeight);
      return {
        armed: document.querySelectorAll(".is-armed").length,
        running: document.getAnimations().filter((a) => a.playState === "running").length,
        hidden: Array.from(
          document.querySelectorAll<HTMLElement>(".mh-w, .mh-svc, .mh-path-item, .mh-step, .mh-tl, .mh-wl"),
        ).filter((el) => getComputedStyle(el).opacity !== "1").length,
        done: document.querySelectorAll(".mh-step.is-done").length,
      };
    });
    expect(state).toEqual({ armed: 0, running: 0, hidden: 0, done: 5 });

    await expect(page.locator("#methode > .mh-wrap")).toHaveCSS("position", "static");
  });
});

test.describe("accessibilité", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "axe tourne une fois, sur Chromium");

  const audit = async (page: Page) => {
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
  };

  for (const [name, size] of [["téléphone", PHONE], ["ordinateur", DESKTOP]] as const) {
    for (const path of ["/", "/en"]) {
      test(`axe sans erreur sur ${path} (${name})`, async ({ page }) => {
        await page.setViewportSize(size);
        await page.emulateMedia({ reducedMotion: "reduce" });
        await open(page, path);
        await audit(page);
      });
    }
  }

  test("axe sans erreur : menu mobile ouvert", async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page);
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await audit(page);
  });

  test("axe sans erreur : modale ouverte", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page);
    await jumpTo(page, ".mh-filters");
    await page.getByRole("button", { name: "Voir le projet : Lanergy" }).click();
    await audit(page);
  });

  test("axe sans erreur : formulaire en erreur", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page);
    await jumpTo(page, ".mh-form");
    await page.locator(".mh-submit").click();
    await audit(page);
  });

  test("navigation clavier : lien d'évitement puis header, focus toujours visible", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Aller au contenu" });
    await expect(skip).toBeFocused();
    expect((await skip.boundingBox())!.width).toBeGreaterThan(40);

    await page.keyboard.press("Tab");
    await expect(page.locator(".mh-header .mh-logo")).toBeFocused();

    const seen = new Set<string>();
    for (let press = 0; press < 90; press += 1) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const style = getComputedStyle(el);
        return {
          name: el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 30) ?? el.tagName,
          ring: style.outlineStyle !== "none" || style.boxShadow !== "none",
          inPage: !!el.closest(".mh"),
        };
      });
      if (!info.inPage) break;
      expect(info.ring, info.name).toBe(true);
      seen.add(info.name);
    }
    expect([...seen]).toEqual(expect.arrayContaining(["Voir le projet : Lanergy", "Envoyer ma demande"]));
  });
});

test.describe("tactile", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: PHONE });
  test.skip(({ browserName }) => browserName === "webkit", "isMobile n'existe pas sur ce profil");

  test("aucun curseur personnalisé ni tilt sur écran tactile", async ({ page }) => {
    await open(page);
    await expect(page.locator(".mh-cursor")).toHaveCount(0);
    await expect(page.locator(".mh-cursor-dot")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.classList.contains("has-cursor"))).toBe(false);
  });
});

test.describe("curseur personnalisé", () => {
  test("disque « Voir » au survol d'un projet", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "pointer: fine non émulé");
    await page.setViewportSize(DESKTOP);
    await open(page);
    await jumpTo(page, ".mh-filters");
    await page.locator(".mh-proj").first().hover({ position: { x: 200, y: 200 } });
    const disc = page.locator(".mh-cursor");
    await expect(disc).toHaveText("Voir");
    await expect(disc).toHaveCSS("opacity", "1");
  });
});

test.describe("coordonnées et terminal", () => {
  for (const [path, text] of [
    ["/", "Bonjour Mehdi, je souhaite un devis pour un site web"],
    ["/en", "Hello Mehdi, I'd like a quote for a website"],
  ]) {
    test(`liens externes et WhatsApp pré-rempli sur ${path}`, async ({ page }) => {
      await open(page, path);
      const unsafe = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]'))
          .filter((a) => a.target !== "_blank" || a.rel !== "noopener noreferrer" || !a.getAttribute("aria-label"))
          .map((a) => a.href),
      );
      expect(unsafe).toEqual([]);
      const whatsapp = await page.locator('a[href*="wa.me"]').evaluateAll((links) =>
        links.map((a) => new URL((a as HTMLAnchorElement).href).searchParams.get("text")),
      );
      expect(whatsapp.length).toBeGreaterThan(2);
      expect(new Set(whatsapp)).toEqual(new Set([text]));
      await expect(page.locator('a[href="https://github.com/Mehdi-Amamou"]').first()).toBeAttached();
      await expect(page.locator('a[href="https://www.linkedin.com/in/mehdi-amamou/"]').first()).toBeAttached();
    });

    test(`aucun « root » et une invite neutre sur ${path}`, async ({ page }) => {
      await open(page, path);
      expect(await page.evaluate(() => /root/i.test(document.body.innerText))).toBe(false);
      expect(new Set(await page.locator(".mh-term .mh-tl > .mh-p-path").allInnerTexts())).toEqual(new Set(["$"]));
    });
  }
});

test.describe("balises de partage", () => {
  test("hreflang, canonical et JSON-LD", async ({ page }) => {
    await skipPreloader(page);
    await page.goto("/en");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en$/);
    await expect(page.locator('link[hreflang="fr"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="x-default"]')).toHaveCount(1);
    const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    expect(data).toMatchObject({ "@type": "Person", name: "Mehdi Amamou" });
    expect(data.sameAs).toEqual(["https://www.linkedin.com/in/mehdi-amamou/", "https://github.com/Mehdi-Amamou"]);
    expect(data.telephone).toBe("+21652250949");
  });
});
