import { isWorldCupKickoffReached } from "./world-cup-kickoff";

function parseEnvFlag(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
  if (normalized === "false" || normalized === "0" || normalized === "no") return false;
  return undefined;
}

/** Manual production toggle — operador activa secciones en vivo en prod. */
export function isFootballLiveSectionsManuallyEnabled(): boolean {
  const fromServer = parseEnvFlag(process.env.ENABLE_FOOTBALL_LIVE_SECTIONS);
  if (fromServer !== undefined) return fromServer;

  const fromPublic = parseEnvFlag(process.env.NEXT_PUBLIC_ENABLE_FOOTBALL_LIVE_SECTIONS);
  if (fromPublic !== undefined) return fromPublic;

  return false;
}

/**
 * Production: ENABLE_FOOTBALL_LIVE_SECTIONS=true (o NEXT_PUBLIC_*).
 * Development: always visible (SportMonks / design preview).
 */
export function shouldShowFootballLiveSections(at = Date.now()): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return isFootballLiveSectionsManuallyEnabled();
}

export function getFootballLiveSectionsGateStatus(at = Date.now()) {
  const manualEnabled = isFootballLiveSectionsManuallyEnabled();
  const kickoffReached = isWorldCupKickoffReached(at);
  const isDevelopment = process.env.NODE_ENV === "development";

  return {
    visible: shouldShowFootballLiveSections(at),
    isDevelopment,
    manualEnabled,
    kickoffReached,
    requiresManualFlag: !isDevelopment && !manualEnabled,
    requiresKickoff: false
  };
}
