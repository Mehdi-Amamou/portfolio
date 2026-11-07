import type { Page } from "@playwright/test";

export const PHONE = { width: 390, height: 844 };
export const DESKTOP = { width: 1440, height: 900 };

// Évite le préloader : ces tests portent sur autre chose.
export async function skipPreloader(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem("mh-pre", "1"));
}

export async function open(page: Page, path = "/") {
  await skipPreloader(page);
  await page.goto(path);
  await page.waitForFunction(() => document.fonts.status === "loaded");
}

export async function jumpTo(page: Page, selector: string, offset = -100) {
  await page.evaluate(
    ([target, delta]) => {
      document.documentElement.style.scrollBehavior = "auto";
      const el = document.querySelector(target as string)!;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + (delta as number));
    },
    [selector, offset],
  );
}

export const isLocked = (page: Page) =>
  page.evaluate(() => document.documentElement.classList.contains("is-locked"));
