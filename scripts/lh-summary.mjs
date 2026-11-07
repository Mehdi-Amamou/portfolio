// Résume un rapport Lighthouse : scores, métriques et audits à corriger.
import { readFileSync } from "node:fs";

for (const file of process.argv.slice(2)) {
  const report = JSON.parse(readFileSync(file, "utf8"));
  const scores = Object.values(report.categories).map((c) => `${c.title}: ${Math.round(c.score * 100)}`);
  console.log(`\n${file}\n  ${scores.join(" · ")}`);
  const metric = (id) => report.audits[id]?.displayValue ?? "?";
  console.log(`  FCP ${metric("first-contentful-paint")} · LCP ${metric("largest-contentful-paint")} · TBT ${metric("total-blocking-time")} · CLS ${metric("cumulative-layout-shift")} · SI ${metric("speed-index")}`);
  const lcp = report.audits["largest-contentful-paint-element"] ?? report.audits["lcp-breakdown-insight"];
  if (lcp?.details?.items?.[0]) console.log("  LCP :", JSON.stringify(lcp.details.items[0]).slice(0, 300));
  const failing = Object.values(report.audits)
    .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== "informative" && a.scoreDisplayMode !== "notApplicable")
    .map((a) => `${a.id} (${a.score}) ${a.displayValue ?? ""}`);
  if (failing.length) console.log("  À revoir :\n   - " + failing.join("\n   - "));
}
