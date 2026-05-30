/** Same instant as CountdownWidget — opening match kickoff (AST, UTC-4). */
export const WORLD_CUP_KICKOFF_ISO = "2026-06-11T20:00:00-04:00";

export const WORLD_CUP_KICKOFF_MS = new Date(WORLD_CUP_KICKOFF_ISO).getTime();

export function isWorldCupKickoffReached(at = Date.now()): boolean {
  return at >= WORLD_CUP_KICKOFF_MS;
}
