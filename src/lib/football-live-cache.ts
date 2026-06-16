import type { LiveFootballBundle } from "@/lib/football-api/types";

const STORAGE_KEY = "pio-football-live-v1";

/** Mantener datos visibles aunque el poll espere — alineado con cache servidor (5 min). */
export const FOOTBALL_LIVE_CLIENT_CACHE_MS = 30 * 60 * 1000;

type CachedFootballLive = {
  savedAt: string;
  source: "live" | "demo";
  data: LiveFootballBundle;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function readFootballLiveCache(
  maxAgeMs = FOOTBALL_LIVE_CLIENT_CACHE_MS
): CachedFootballLive | null {
  if (!canUseStorage()) return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedFootballLive;
    if (!parsed?.data?.match || !Array.isArray(parsed.data.ticker)) return null;

    const age = Date.now() - Date.parse(parsed.savedAt);
    if (!Number.isFinite(age) || age > maxAgeMs) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function writeFootballLiveCache(
  source: "live" | "demo",
  data: LiveFootballBundle
): void {
  if (!canUseStorage()) return;

  try {
    const envelope: CachedFootballLive = {
      savedAt: new Date().toISOString(),
      source,
      data
    };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  } catch {
    // Quota or private mode — ignore.
  }
}
