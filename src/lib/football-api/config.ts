export type FootballDataMode = "live" | "demo";

const DEFAULT_HOST = "v3.football.api-sports.io";
const DEFAULT_SEASON = "2026";

export function getFootballApiConfig() {
  return {
    host: process.env.API_FOOTBALL_HOST ?? DEFAULT_HOST,
    key: process.env.API_FOOTBALL_KEY,
    leagueId: process.env.API_FOOTBALL_WORLD_CUP_LEAGUE_ID,
    season: process.env.API_FOOTBALL_SEASON ?? DEFAULT_SEASON
  };
}

/** Variables requeridas para activar API-Football en producción. */
export function getMissingFootballEnvVars(): string[] {
  const { key, leagueId } = getFootballApiConfig();
  const missing: string[] = [];
  if (!key) missing.push("API_FOOTBALL_KEY");
  if (!leagueId) missing.push("API_FOOTBALL_WORLD_CUP_LEAGUE_ID");
  return missing;
}

/**
 * Activa datos reales cuando USE_REAL_FOOTBALL_DATA=true y existen key + league id.
 * USE_REAL_FOOTBALL_DATA es server-only (cambiable en runtime sin rebuild).
 * NEXT_PUBLIC_USE_REAL_FOOTBALL_DATA se mantiene como alias legacy.
 */
export function isLiveFootballDataEnabled(): boolean {
  const flag = process.env.USE_REAL_FOOTBALL_DATA ?? process.env.NEXT_PUBLIC_USE_REAL_FOOTBALL_DATA;
  return flag === "true" && getMissingFootballEnvVars().length === 0;
}

export function getFootballDataMode(): FootballDataMode {
  return isLiveFootballDataEnabled() ? "live" : "demo";
}

export function getFootballDataStatus() {
  const config = getFootballApiConfig();
  const missing = getMissingFootballEnvVars();
  const mode = getFootballDataMode();
  const toggle =
    process.env.USE_REAL_FOOTBALL_DATA ?? process.env.NEXT_PUBLIC_USE_REAL_FOOTBALL_DATA ?? "false";

  return {
    mode,
    toggle,
    configured: missing.length === 0,
    missing,
    leagueId: config.leagueId ? "set" : "missing",
    season: config.season,
    host: config.host
  };
}
