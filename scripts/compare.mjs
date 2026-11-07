// Compare le site à design/maquette.html : captures côte à côte et écarts de géométrie.
// Usage : node scripts/compare.mjs [url] [sélecteurs séparés par des virgules]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const only = process.argv[3]?.split(",");
const sizes = (process.env.SIZES ?? "390x844,1440x900").split(",").map((s) => s.split("x").map(Number));
const out = path.resolve(".captures");
const maquette = `file://${path.resolve("design/maquette.html")}`;
mkdirSync(out, { recursive: true });

const SELECTORS = only ?? [
  ".mh-hbar", ".mh-logo", ".mh-nav", ".mh-lang", ".mh-cv-btn", ".mh-hdevis", ".mh-burger", ".mh-bbar",
  ".mh-hero", ".mh-pill", ".mh-h1", ".mh-hero-sub", ".mh-hero-ctas", ".mh-hero-chips", ".mh-frag--toast", ".mh-frag--lock", ".mh-frag--admin", ".mh-frag--browser", ".mh-scroll",
  "#services", ".mh-svc-track", ".mh-svc", ".mh-hint",
  "#projets", ".mh-filters", ".mh-proj-track", ".mh-proj", ".mh-pager",
  "#methode", ".mh-steps", ".mh-step",
  "#parcours", ".mh-about", ".mh-path-item", ".mh-cvbox", ".mh-term",
  "#temoignages", ".mh-quote",
  "#contact", ".mh-contact", ".mh-form", ".mh-way",
  ".mh-footer", ".mh-foot-grid", ".mh-wordmark",
];

const measure = (page) =>
  page.evaluate((selectors) => {
    const result = {};
    for (const selector of selectors) {
      const nodes = [...document.querySelectorAll(selector)].slice(0, 6);
      result[selector] = nodes
        .filter((n) => n.getClientRects().length > 0)
        .map((n) => {
          const r = n.getBoundingClientRect();
          return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
        });
    }
    return result;
  }, SELECTORS);

const browser = await chromium.launch();
let total = 0;
for (const [width, height] of sizes) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: "reduce",
    hasTouch: width < 768,
    isMobile: width < 768,
    deviceScaleFactor: 1,
    locale: "fr-FR",
  });
  const reference = await context.newPage();
  await reference.goto(maquette, { waitUntil: "networkidle" });
  await reference.evaluate(() => document.fonts.ready);
  await reference.waitForTimeout(600);
  const site = await context.newPage();
  site.on("console", (m) => { if (["error", "warning"].includes(m.type())) console.log(`  [console ${m.type()}]`, m.text().slice(0, 240)); });
  site.on("pageerror", (e) => console.log("  [pageerror]", e.message.slice(0, 240)));
  await site.goto(base, { waitUntil: "networkidle" });
  await site.evaluate(() => document.fonts.ready);
  await site.waitForTimeout(1500);

  await reference.screenshot({ path: `${out}/maquette-${width}.png` });
  await site.screenshot({ path: `${out}/site-${width}.png` });
  await reference.screenshot({ path: `${out}/maquette-${width}-full.png`, fullPage: true });
  await site.screenshot({ path: `${out}/site-${width}-full.png`, fullPage: true });

  const a = await measure(reference);
  const b = await measure(site);
  console.log(`\n=== ${width}×${height} ===`);
  const offset = (rects) => rects;
  let gaps = 0;
  for (const selector of SELECTORS) {
    const ra = offset(a[selector]);
    const rb = offset(b[selector]);
    if (ra.length !== rb.length) {
      console.log(`  ${selector}: nombre ${ra.length} → ${rb.length}`);
      gaps += 1;
      continue;
    }
    ra.forEach((r, i) => {
      const s = rb[i];
      const dx = s.x - r.x, dy = s.y - r.y, dw = s.w - r.w, dh = s.h - r.h;
      if (Math.abs(dx) > 1 || Math.abs(dw) > 1 || Math.abs(dh) > 1 || Math.abs(dy) > 1) {
        console.log(`  ${selector}[${i}]: maquette ${r.x},${r.y} ${r.w}×${r.h} → site ${s.x},${s.y} ${s.w}×${s.h}`);
        gaps += 1;
      }
    });
  }
  console.log(gaps ? `  ${gaps} écart(s)` : "  aucun écart");
  total += gaps;
  const scroll = await site.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (scroll > 0) console.log(`  SCROLL HORIZONTAL : ${scroll}px`);
  await context.close();
}
await browser.close();
console.log(`\nTotal : ${total} écart(s). Captures dans .captures/`);
