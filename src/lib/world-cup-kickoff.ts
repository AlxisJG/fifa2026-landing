import { parseSportmonksStartingAt } from "@/lib/football-api/datetime";
import type { Fixture } from "@/lib/football-api/types";
import { DOMINICAN_TIMEZONE } from "@/lib/datetime-rd";

/**
 * Opening match kickoff fallback — Mexico vs South Africa, 7:00 p.m. AST (19:00 -04:00).
 * Prefer resolveCountdownTargetMs() from live fixtures when available.
 */
export const WORLD_CUP_KICKOFF_ISO = "2026-06-11T19:00:00-04:00";

export const WORLD_CUP_KICKOFF_MS = new Date(WORLD_CUP_KICKOFF_ISO).getTime();

function toCalendarKey(date: Date, timeZone = DOMINICAN_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function resolveCountdownTargetMs(
  fixtures: Fixture[],
  kickoffAt?: string | null
): number {
  const candidates: number[] = [];

  if (kickoffAt) {
    const featuredMs = parseSportmonksStartingAt(kickoffAt).getTime();
    if (Number.isFinite(featuredMs)) candidates.push(featuredMs);
  }

  for (const fixture of fixtures) {
    const ms = new Date(fixture.startsAt).getTime();
    if (Number.isFinite(ms)) candidates.push(ms);
  }

  if (candidates.length === 0) {
    return WORLD_CUP_KICKOFF_MS;
  }

  const now = Date.now();
  const sorted = [...new Set(candidates)].sort((a, b) => a - b);
  return sorted.find((ms) => ms >= now) ?? sorted[0];
}

export function isWorldCupKickoffReached(at = Date.now()): boolean {
  return at >= WORLD_CUP_KICKOFF_MS;
}

/** True on/after the opening-match calendar day (same date as CountdownWidget). */
export function isWorldCupFirstMatchDayReached(at = Date.now()): boolean {
  return toCalendarKey(new Date(at)) >= toCalendarKey(new Date(WORLD_CUP_KICKOFF_MS));
}
