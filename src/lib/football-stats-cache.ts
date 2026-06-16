import type { SquadTeam, StandingsData, TopscorersData } from "@/lib/football-api/types";

export type FootballStatsCacheKey = "standings" | "squads" | "topscorers";

const STORAGE_PREFIX = "pio-football-stats-v1";

/** Mantener datos visibles entre navegaciones — alineado con cache CDN (5–10 min). */
export const FOOTBALL_STATS_CLIENT_CACHE_MS = 30 * 60 * 1000;

type CachedFootballStats<T> = {
  savedAt: string;
  source: "live" | "demo";
  data: T;
};

function storageKey(key: FootballStatsCacheKey): string {
  return `${STORAGE_PREFIX}:${key}`;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function hasDisplayableStats(
  key: FootballStatsCacheKey,
  data: StandingsData | SquadTeam[] | TopscorersData
): boolean {
  if (key === "standings") {
    return ((data as StandingsData).groups ?? []).some((g) => (g.rows?.length ?? 0) > 0);
  }
  if (key === "squads") {
    return (data as SquadTeam[]).length > 0;
  }
  const tops = data as TopscorersData;
  return tops.goals.length > 0 || tops.assists.length > 0 || tops.cards.length > 0;
}

export function readFootballStatsCache<K extends FootballStatsCacheKey>(
  key: K,
  maxAgeMs = FOOTBALL_STATS_CLIENT_CACHE_MS
): CachedFootballStats<
  K extends "standings" ? StandingsData : K extends "squads" ? SquadTeam[] : TopscorersData
> | null {
  if (!canUseStorage()) return null;

  try {
    const raw = window.sessionStorage.getItem(storageKey(key));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CachedFootballStats<
      StandingsData | SquadTeam[] | TopscorersData
    >;
    if (!parsed?.data || !parsed.savedAt) return null;
    if (!hasDisplayableStats(key, parsed.data)) return null;

    const age = Date.now() - Date.parse(parsed.savedAt);
    if (!Number.isFinite(age) || age > maxAgeMs) return null;

    return parsed as CachedFootballStats<
      K extends "standings" ? StandingsData : K extends "squads" ? SquadTeam[] : TopscorersData
    >;
  } catch {
    return null;
  }
}

export function writeFootballStatsCache<K extends FootballStatsCacheKey>(
  key: K,
  source: "live" | "demo",
  data: K extends "standings"
    ? StandingsData
    : K extends "squads"
      ? SquadTeam[]
      : TopscorersData
): void {
  if (!canUseStorage()) return;

  try {
    const envelope: CachedFootballStats<typeof data> = {
      savedAt: new Date().toISOString(),
      source,
      data
    };
    window.sessionStorage.setItem(storageKey(key), JSON.stringify(envelope));
  } catch {
    // Quota or private mode — ignore.
  }
}
