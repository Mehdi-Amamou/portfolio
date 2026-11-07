// Affiche les balises de partage servies par un site lancé : node scripts/og-head.mjs <url de base>
const base = process.argv[2] ?? "http://localhost:3000";
const PATTERN = /<title>.*?<\/title>|<meta[^>]*(?:property="(?:og|twitter):|name="(?:description|twitter:))[^>]*>|<link[^>]*rel="(?:canonical|alternate)"[^>]*>/g;

for (const [label, path] of [["FR", "/"], ["EN", "/en"]]) {
  const html = await (await fetch(base + path, { headers: { "Accept-Language": "fr" }, redirect: "follow" })).text();
  const head = html.slice(0, html.indexOf("</head>"));
  console.log(`\n--- ${label} (${path}) ---`);
  console.log([...new Set(head.match(PATTERN))].join("\n"));
}
