"use client";

import { useEffect, useState } from "react";
import {
  hasDisplayableStats,
  readFootballStatsCache,
  writeFootballStatsCache,
  type FootballStatsCacheKey
} from "@/lib/football-stats-cache";
import type {
  FeaturedMatch,
  Fixture,
  ProviderResponse,
  SquadTeam,
  StandingsData,
  TickerItem,
  TopscorersData
} from "@/lib/football-api/types";

type HookState<T> = {
  data: T;
  loading: boolean;
  error?: string;
  source: "live" | "demo";
};

type FetchOptions = {
  enabled?: boolean;
  /** When set, skip initial loading state (SSR-hydrated data). */
  initialSource?: "live" | "demo";
  /** Refetch interval in ms (e.g. live match center). */
  pollIntervalMs?: number;
  /** sessionStorage key for instant display on client navigation. */
  cacheKey?: FootballStatsCacheKey;
};

/** Alineado con CACHE_REVALIDATE.livescores (20s) y poll de stream status (30s). */
export const LIVE_FOOTBALL_POLL_MS = 30_000;

async function fetchRoute<T>(url: string): Promise<ProviderResponse<T>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed request: ${res.status}`);
  return res.json();
}

function resolveFootballRouteState<T>(
  initialData: T,
  options?: FetchOptions
): { state: HookState<T>; hasDisplayableData: boolean } {
  const enabled = options?.enabled ?? true;
  const hasSsrSource = options?.initialSource !== undefined;
  const cacheKey = options?.cacheKey;

  if (cacheKey) {
    const cached = readFootballStatsCache(cacheKey);
    if (cached) {
      return {
        state: {
          data: cached.data as T,
          loading: false,
          source: cached.source
        },
        hasDisplayableData: true
      };
    }
  }

  if (hasSsrSource) {
    const hasData = cacheKey
      ? hasDisplayableStats(cacheKey, initialData as never)
      : true;
    return {
      state: {
        data: initialData,
        loading: false,
        source: options!.initialSource!
      },
      hasDisplayableData: hasData
    };
  }

  return {
    state: {
      data: initialData,
      loading: enabled,
      source: "demo"
    },
    hasDisplayableData: false
  };
}

function useFootballRoute<T>(url: string, initialData: T, options?: FetchOptions): HookState<T> {
  const enabled = options?.enabled ?? true;
  const pollIntervalMs = options?.pollIntervalMs;
  const hasSsrSource = options?.initialSource !== undefined;
  const cacheKey = options?.cacheKey;

  const [{ state, hasDisplayableData }, setResolved] = useState(() =>
    resolveFootballRouteState(initialData, options)
  );

  useEffect(() => {
    if (
      hasSsrSource &&
      cacheKey &&
      options?.initialSource &&
      hasDisplayableStats(cacheKey, initialData as never)
    ) {
      writeFootballStatsCache(cacheKey, options.initialSource, initialData as never);
    }
  }, [hasSsrSource, cacheKey, options?.initialSource, initialData]);

  useEffect(() => {
    if (!enabled) {
      setResolved((prev) => ({
        ...prev,
        state: { ...prev.state, loading: false }
      }));
      return;
    }

    let active = true;
    let intervalId: number | undefined;

    const applyPayload = (payload: ProviderResponse<T>) => {
      const displayable = cacheKey
        ? hasDisplayableStats(cacheKey, payload.data as never)
        : true;
      if (cacheKey && displayable) {
        writeFootballStatsCache(cacheKey, payload.source, payload.data as never);
      }
      setResolved({
        hasDisplayableData: displayable,
        state: {
          data: payload.data,
          loading: false,
          error: payload.error,
          source: payload.source
        }
      });
    };

    const load = (background = false) => {
      if (!background) {
        setResolved((prev) => ({
          ...prev,
          state: { ...prev.state, loading: true }
        }));
      }

      fetchRoute<T>(url)
        .then((payload) => {
          if (!active) return;
          applyPayload(payload);
        })
        .catch((err) => {
          if (!active) return;
          setResolved((prev) => ({
            ...prev,
            state: {
              ...prev.state,
              loading: false,
              error: err instanceof Error ? err.message : "Failed to load"
            }
          }));
        });
    };

    function stopPolling() {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
    }

    function startPolling() {
      stopPolling();
      if (!pollIntervalMs) {
        load(hasDisplayableData);
        return;
      }

      if (!hasDisplayableData) {
        load(false);
      }

      intervalId = window.setInterval(() => load(true), pollIntervalMs);
    }

    function handleVisibilityChange() {
      if (!pollIntervalMs) return;

      if (document.hidden) {
        stopPolling();
      } else {
        load(true);
        startPolling();
      }
    }

    if (!pollIntervalMs) {
      load(hasDisplayableData);
      return () => {
        active = false;
      };
    }

    if (!document.hidden) {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [url, enabled, hasDisplayableData, options?.initialSource, pollIntervalMs, cacheKey]);

  return state;
}

export function useFixtures(initialData: Fixture[], options?: FetchOptions) {
  return useFootballRoute<Fixture[]>("/api/football/fixtures", initialData, options);
}

export function useStandings(initialData: StandingsData, options?: FetchOptions) {
  return useFootballRoute<StandingsData>("/api/football/standings", initialData, {
    cacheKey: "standings",
    ...options
  });
}

export function useMatchCenter(initialData: FeaturedMatch, options?: FetchOptions) {
  return useFootballRoute<FeaturedMatch>("/api/football/match-center", initialData, {
    pollIntervalMs: LIVE_FOOTBALL_POLL_MS,
    ...options
  });
}

export function useTicker(initialData: TickerItem[], options?: FetchOptions) {
  return useFootballRoute<TickerItem[]>("/api/football/ticker", initialData, {
    pollIntervalMs: LIVE_FOOTBALL_POLL_MS,
    ...options
  });
}

export function useSquads(initialData: SquadTeam[] = [], options?: FetchOptions) {
  return useFootballRoute<SquadTeam[]>("/api/football/squads", initialData, {
    cacheKey: "squads",
    ...options
  });
}

export function useTopscorers(initialData: TopscorersData, options?: FetchOptions) {
  return useFootballRoute<TopscorersData>("/api/football/topscorers", initialData, {
    cacheKey: "topscorers",
    ...options
  });
}
