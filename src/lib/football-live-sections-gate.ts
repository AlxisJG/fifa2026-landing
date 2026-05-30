import { isWorldCupKickoffReached } from "./world-cup-kickoff";

/** Manual production toggle — must be true together with kickoff to show live sections. */
export function isFootballLiveSectionsManuallyEnabled(): boolean {
  return process.env.ENABLE_FOOTBALL_LIVE_SECTIONS === "true";
}

/**
 * Production: ENABLE_FOOTBALL_LIVE_SECTIONS=true AND countdown finished.
 * Development: always visible (SportMonks / design preview).
 */
export function shouldShowFootballLiveSections(at = Date.now()): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return isFootballLiveSectionsManuallyEnabled() && isWorldCupKickoffReached(at);
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
    requiresKickoff: !isDevelopment && manualEnabled && !kickoffReached
  };
}
