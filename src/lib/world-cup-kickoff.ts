/** Same instant as CountdownWidget — opening match kickoff (AST, UTC-4). */
export const WORLD_CUP_KICKOFF_ISO = "2026-06-11T20:00:00-04:00";

export const WORLD_CUP_KICKOFF_MS = new Date(WORLD_CUP_KICKOFF_ISO).getTime();

const CALENDAR_TIMEZONE = "America/Santo_Domingo";

function toCalendarKey(date: Date, timeZone = CALENDAR_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function isWorldCupKickoffReached(at = Date.now()): boolean {
  return at >= WORLD_CUP_KICKOFF_MS;
}

/** True on/after the opening-match calendar day (same date as CountdownWidget). */
export function isWorldCupFirstMatchDayReached(at = Date.now()): boolean {
  return toCalendarKey(new Date(at)) >= toCalendarKey(new Date(WORLD_CUP_KICKOFF_MS));
}
