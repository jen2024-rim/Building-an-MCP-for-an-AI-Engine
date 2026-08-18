/**
 * Shared helper for fetching JSON from external APIs.
 * Every tool that calls an external API should use this instead of
 * calling fetch() directly, so timeouts and host allowlisting are
 * handled consistently in one place.
 *
 * NOTE: Not used yet in Week 3 (all tools currently read local JSON
 * fixtures via file.ts). This will be used starting Week 4 once
 * real API calls are added — update ALLOWED_HOSTS below when that happens.
 */

// Only these hosts may ever be fetched. Add a hostname here only when a
// tool actually needs to call it — never forward a model- or user-supplied
// URL straight into fetch().
const ALLOWED_HOSTS: readonly string[] = [
  // e.g. "api.open-meteo.com"
];

export async function fetchJson<T = unknown>(
  url: string,
  { timeoutMs = 8000 }: { timeoutMs?: number } = {}
): Promise<T> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid URL: "${url}"`);
  }

  if (parsed.protocol !== "https:") {
    throw new Error(`Refusing non-HTTPS request to "${url}"`);
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    throw new Error(`Refusing request to disallowed host: "${parsed.hostname}"`);
  }

  const response = await fetch(parsed, { signal: AbortSignal.timeout(timeoutMs) });

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
