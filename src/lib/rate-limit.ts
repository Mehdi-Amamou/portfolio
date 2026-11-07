const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

const hits = new Map<string, number[]>();

// Limite en mémoire : suffisante pour une seule instance PM2.
export function allowRequest(key: string, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  const allowed = recent.length < LIMIT;
  if (allowed) recent.push(now);
  hits.set(key, recent);

  for (const [entry, times] of hits) {
    if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(entry);
  }

  return allowed;
}
