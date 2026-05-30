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
};

async function fetchRoute<T>(url: string): Promise<ProviderResponse<T>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed request: ${res.status}`);
  return res.json();
}

function useFootballRoute<T>(url: string, initialData: T, options?: FetchOptions): HookState<T> {
  const enabled = options?.enabled ?? true;
  const [state, setState] = useState<HookState<T>>({
    data: initialData,
    loading: enabled,
    source: "demo"
  });

  useEffect(() => {
    if (!enabled) {
      setState({ data: initialData, loading: false, source: "demo" });
      return;
    }

    let active = true;
    setState((prev) => ({ ...prev, loading: true }));
    fetchRoute<T>(url)
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
    return () => {
      active = false;
    };
  }, [url, enabled, initialData]);

  return state;
}

export function useTicker(initialData: TickerItem[], options?: FetchOptions) {
  return useFootballRoute<TickerItem[]>("/api/football/ticker", initialData, options);
}

export function useFixtures(initialData: Fixture[], options?: FetchOptions) {
  return useFootballRoute<Fixture[]>("/api/football/fixtures", initialData, options);
}

export function useStandings(initialData: StandingsData, options?: FetchOptions) {
  return useFootballRoute<StandingsData>("/api/football/standings", initialData, options);
}

export function useMatchCenter(initialData: FeaturedMatch, options?: FetchOptions) {
  return useFootballRoute<FeaturedMatch>("/api/football/match-center", initialData, options);
}

export function useSquads(initialData: SquadTeam[] = [], options?: FetchOptions) {
  return useFootballRoute<SquadTeam[]>("/api/football/squads", initialData, options);
}

export function useTopscorers(initialData: TopscorersData, options?: FetchOptions) {
  return useFootballRoute<TopscorersData>("/api/football/topscorers", initialData, options);
}
