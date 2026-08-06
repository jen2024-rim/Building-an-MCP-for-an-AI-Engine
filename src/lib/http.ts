/**
 * Shared helper for fetching JSON from external APIs.
 * Every tool that calls an external API should use this instead of
 * calling fetch() directly, so timeouts are handled consistently.
 *
 * NOTE: Not used yet in Week 3 (all tools currently read local JSON
 * fixtures via file.ts). This will be used starting Week 4 once
 * real API calls are added.
 */
export async function fetchJson<T = unknown>(
  url: string,
  { timeoutMs = 8000 }: { timeoutMs?: number } = {}
): Promise<T> {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
