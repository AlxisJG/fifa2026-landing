import type { Fixture } from "@/lib/football-api/types";

/** Empieza a consultar Brightcove 1 h antes del pitido. */
export const PRE_MATCH_LEAD_MS = 60 * 60 * 1000;

/** Duración estimada del partido + descanso (minutos extra incluidos en margen). */
export const MATCH_DURATION_MS = 120 * 60 * 1000;

/** Últimos 30 min del partido estimado — polling más frecuente. */
export const NEAR_END_LEAD_MS = 30 * 60 * 1000;

/** Tras el fin estimado, seguir comprobando si la señal sigue activa (1 h). */
export const POST_MATCH_BUFFER_MS = 60 * 60 * 1000;

export const POLL_INTERVAL_MS = {
  preMatch: 3 * 60 * 1000,
  postMatch: 3 * 60 * 1000,
  liveMid: 60 * 60 * 1000,
  nearEnd: 5 * 60 * 1000,
  idleRecheck: 60 * 60 * 1000,
  /** Marcador/ticker en vivo — solo durante el partido. */
  footballLive: 5 * 60 * 1000
} as const;

export type MatchPollWindow = {
  kickoffMs: number;
  pollFromMs: number;
  estimatedEndMs: number;
  nearEndFromMs: number;
  pollUntilMs: number;
};

export type PollPhase = "idle" | "pre_match" | "live_mid" | "near_end" | "post_match";

export type SerializedMatchPollWindow = {
  kickoffAt: string;
  pollFromAt: string;
  estimatedEndAt: string;
  nearEndFromAt: string;
  pollUntilAt: string;
};

export function buildMatchPollWindows(
  fixtures: Pick<Fixture, "startsAt">[],
  now = Date.now()
): MatchPollWindow[] {
  return fixtures
    .map((fixture) => {
      const kickoffMs = new Date(fixture.startsAt).getTime();
      if (!Number.isFinite(kickoffMs)) return null;

      const estimatedEndMs = kickoffMs + MATCH_DURATION_MS;
      return {
        kickoffMs,
        pollFromMs: kickoffMs - PRE_MATCH_LEAD_MS,
        estimatedEndMs,
        nearEndFromMs: estimatedEndMs - NEAR_END_LEAD_MS,
        pollUntilMs: estimatedEndMs + POST_MATCH_BUFFER_MS
      };
    })
    .filter((window): window is MatchPollWindow => window !== null)
    .filter((window) => window.pollUntilMs > now)
    .sort((a, b) => a.pollFromMs - b.pollFromMs);
}

export function serializeMatchPollWindow(window: MatchPollWindow): SerializedMatchPollWindow {
  return {
    kickoffAt: new Date(window.kickoffMs).toISOString(),
    pollFromAt: new Date(window.pollFromMs).toISOString(),
    estimatedEndAt: new Date(window.estimatedEndMs).toISOString(),
    nearEndFromAt: new Date(window.nearEndFromMs).toISOString(),
    pollUntilAt: new Date(window.pollUntilMs).toISOString()
  };
}

export function parseMatchPollWindow(serialized: SerializedMatchPollWindow): MatchPollWindow {
  return {
    kickoffMs: Date.parse(serialized.kickoffAt),
    pollFromMs: Date.parse(serialized.pollFromAt),
    estimatedEndMs: Date.parse(serialized.estimatedEndAt),
    nearEndFromMs: Date.parse(serialized.nearEndFromAt),
    pollUntilMs: Date.parse(serialized.pollUntilAt)
  };
}

export function resolveActivePollWindow(
  windows: MatchPollWindow[],
  now = Date.now()
): MatchPollWindow | null {
  return windows.find((window) => now >= window.pollFromMs && now < window.pollUntilMs) ?? null;
}

export function resolvePollPhase(
  window: MatchPollWindow | null,
  now: number,
  streamAvailable: boolean
): PollPhase {
  if (!window) return "idle";
  if (now < window.kickoffMs) return "pre_match";
  if (now >= window.estimatedEndMs) return "post_match";
  if (now < window.nearEndFromMs) {
    return streamAvailable ? "live_mid" : "pre_match";
  }
  return "near_end";
}

export function getPollIntervalMs(phase: PollPhase): number | null {
  switch (phase) {
    case "idle":
      return null;
    case "pre_match":
      return POLL_INTERVAL_MS.preMatch;
    case "post_match":
      return POLL_INTERVAL_MS.postMatch;
    case "live_mid":
      return POLL_INTERVAL_MS.liveMid;
    case "near_end":
      return POLL_INTERVAL_MS.nearEnd;
  }
}

export function getMsUntilNextPollWindow(windows: MatchPollWindow[], now = Date.now()): number | null {
  const next = windows.find((window) => window.pollFromMs > now);
  if (!next) return null;
  return Math.max(0, next.pollFromMs - now);
}

export function getMsUntilPhaseChange(window: MatchPollWindow, now = Date.now()): number | null {
  const boundaries = [
    window.kickoffMs,
    window.nearEndFromMs,
    window.estimatedEndMs,
    window.pollUntilMs
  ].filter((timestamp) => timestamp > now);
  if (boundaries.length === 0) return null;
  return Math.min(...boundaries.map((timestamp) => timestamp - now));
}

export function getNextPollDelayMs(
  windows: MatchPollWindow[],
  now: number,
  streamAvailable: boolean
): number {
  const active = resolveActivePollWindow(windows, now);
  const phase = resolvePollPhase(active, now, streamAvailable);

  if (phase === "idle") {
    return getMsUntilNextPollWindow(windows, now) ?? POLL_INTERVAL_MS.idleRecheck;
  }

  const interval = getPollIntervalMs(phase)!;
  const untilPhaseChange = active ? getMsUntilPhaseChange(active, now) : null;
  if (untilPhaseChange == null) return interval;
  return Math.min(interval, untilPhaseChange);
}

export function shouldPollStreamStatus(
  windows: MatchPollWindow[],
  now = Date.now()
): boolean {
  return resolveActivePollWindow(windows, now) !== null;
}

/** Solo durante el partido (pitido → fin estimado + buffer). */
export function isFootballLivePollActive(window: MatchPollWindow, now = Date.now()): boolean {
  return now >= window.kickoffMs && now < window.pollUntilMs;
}

export function resolveActiveFootballPollWindow(
  windows: MatchPollWindow[],
  now = Date.now()
): MatchPollWindow | null {
  return windows.find((window) => isFootballLivePollActive(window, now)) ?? null;
}

export function shouldPollFootballLive(windows: MatchPollWindow[], now = Date.now()): boolean {
  return resolveActiveFootballPollWindow(windows, now) !== null;
}

export function getMsUntilNextFootballPollWindow(
  windows: MatchPollWindow[],
  now = Date.now()
): number | null {
  const next = windows.find((window) => window.kickoffMs > now);
  if (!next) return null;
  return Math.max(0, next.kickoffMs - now);
}

export function getNextFootballPollDelayMs(windows: MatchPollWindow[], now = Date.now()): number {
  if (shouldPollFootballLive(windows, now)) {
    const active = resolveActiveFootballPollWindow(windows, now)!;
    const untilEnd = active.pollUntilMs - now;
    return Math.min(POLL_INTERVAL_MS.footballLive, untilEnd);
  }

  return getMsUntilNextFootballPollWindow(windows, now) ?? POLL_INTERVAL_MS.idleRecheck;
}

/** Durante transmisión en vivo siempre refrescar marcador (con intervalo de cache). */
export function shouldRefreshFootballLive(
  windows: MatchPollWindow[],
  now: number,
  streamAvailable: boolean
): boolean {
  return streamAvailable || shouldPollFootballLive(windows, now);
}

export function getFootballLiveRefreshDelayMs(
  windows: MatchPollWindow[],
  now: number,
  streamAvailable: boolean
): number {
  if (streamAvailable) {
    return POLL_INTERVAL_MS.footballLive;
  }
  return getNextFootballPollDelayMs(windows, now);
}
