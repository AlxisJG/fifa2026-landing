export type FootballDataMode = "live" | "demo";

/** FIFA World Cup — SportMonks league id (docs WC 2026 guide). */
export const SPORTMONKS_WC_LEAGUE_ID = 732;

/** Example season id from SportMonks WC 2026 guide; set SPORTMONKS_SEASON_ID in env. */
export const SPORTMONKS_WC_SEASON_ID_EXAMPLE = "26618";

const DEFAULT_BASE_URL = "https://api.sportmonks.com/v3/football";

export function getSportmonksConfig() {
  return {
    baseUrl: process.env.SPORTMONKS_BASE_URL ?? DEFAULT_BASE_URL,
    token: process.env.SPORTMONKS_API_TOKEN,
    seasonId: process.env.SPORTMONKS_SEASON_ID
  };
}

/** @deprecated Use getSportmonksConfig */
export function getFootballApiConfig() {
  const c = getSportmonksConfig();
  return {
    host: c.baseUrl.replace(/^https?:\/\//, ""),
    key: c.token,
    leagueId: c.seasonId,
    season: c.seasonId
  };
}

/** Variables requeridas para activar SportMonks en producción. */
export function getMissingFootballEnvVars(): string[] {
  const { token, seasonId } = getSportmonksConfig();
  const missing: string[] = [];
  if (!token) missing.push("SPORTMONKS_API_TOKEN");
  if (!seasonId) missing.push("SPORTMONKS_SEASON_ID");
  return missing;
}

/**
 * Activa datos reales cuando USE_REAL_FOOTBALL_DATA=true y existen token + season id.
 */
export function isLiveFootballDataEnabled(): boolean {
  const flag = process.env.USE_REAL_FOOTBALL_DATA ?? process.env.NEXT_PUBLIC_USE_REAL_FOOTBALL_DATA;
  return flag === "true" && getMissingFootballEnvVars().length === 0;
}

export function getFootballDataMode(): FootballDataMode {
  return isLiveFootballDataEnabled() ? "live" : "demo";
}

export function getFootballDataStatus() {
  const config = getSportmonksConfig();
  const missing = getMissingFootballEnvVars();
  const mode = getFootballDataMode();
  const toggle =
    process.env.USE_REAL_FOOTBALL_DATA ?? process.env.NEXT_PUBLIC_USE_REAL_FOOTBALL_DATA ?? "false";

  return {
    provider: "sportmonks" as const,
    mode,
    toggle,
    configured: missing.length === 0,
    missing,
    seasonId: config.seasonId ? "set" : "missing",
    seasonIdExample: SPORTMONKS_WC_SEASON_ID_EXAMPLE,
    leagueId: SPORTMONKS_WC_LEAGUE_ID,
    baseUrl: config.baseUrl,
    docsUrl:
      "https://docs.sportmonks.com/v3/world-cup-2026/how-to-build-your-world-cup-application",
    placeholderDocs:
      "placeholder es un campo en fixture/participant (TBD), no un query param. Ver GET /api/football/status con mode=live."
  };
}
