"use client";

import { useEffect, useState } from "react";
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
};

async function fetchRoute<T>(url: string, options?: { noCache?: boolean }): Promise<ProviderResponse<T>> {
  const res = await fetch(url, options?.noCache ? { cache: "no-store" } : undefined);
  if (!res.ok) throw new Error(`Failed request: ${res.status}`);
  return res.json();
}

function useFootballRoute<T>(url: string, initialData: T, options?: FetchOptions): HookState<T> {
  const enabled = options?.enabled ?? true;
  const pollIntervalMs = options?.pollIntervalMs;
  const hasSsrSource = options?.initialSource !== undefined;
  const [state, setState] = useState<HookState<T>>({
    data: initialData,
    loading: enabled && !hasSsrSource,
    source: options?.initialSource ?? "demo"
  });

  useEffect(() => {
    if (!enabled) {
      setState({ data: initialData, loading: false, source: options?.initialSource ?? "demo" });
      return;
    }

    let active = true;

    const load = (isPoll = false) => {
      if (!hasSsrSource && !isPoll) {
        setState((prev) => ({ ...prev, loading: true }));
      }

      fetchRoute<T>(url, { noCache: Boolean(pollIntervalMs) })
        .then((payload) => {
          if (!active) return;
          setState({
            data: payload.data,
            loading: false,
            error: payload.error,
            source: payload.source
          });
        })
        .catch((err) => {
          if (!active) return;
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : "Failed to load"
          }));
        });
    };

    load();
    if (!pollIntervalMs) {
      return () => {
        active = false;
      };
    }

    const intervalId = window.setInterval(() => load(true), pollIntervalMs);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [url, enabled, hasSsrSource, initialData, options?.initialSource, pollIntervalMs]);

  return state;
}

export function useFixtures(initialData: Fixture[], options?: FetchOptions) {
  return useFootballRoute<Fixture[]>("/api/football/fixtures", initialData, options);
}

export function useStandings(initialData: StandingsData, options?: FetchOptions) {
  return useFootballRoute<StandingsData>("/api/football/standings", initialData, options);
}

/** Alineado con CACHE_REVALIDATE.livescores (20s) en sportmonks-client. */
const LIVE_FOOTBALL_POLL_MS = 20_000;

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
  return useFootballRoute<SquadTeam[]>("/api/football/squads", initialData, options);
}

export function useTopscorers(initialData: TopscorersData, options?: FetchOptions) {
  return useFootballRoute<TopscorersData>("/api/football/topscorers", initialData, options);
}
