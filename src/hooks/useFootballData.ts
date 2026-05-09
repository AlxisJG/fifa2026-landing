"use client";

import { useEffect, useState } from "react";
import type { FeaturedMatch, Fixture, ProviderResponse, StandingsData, TickerItem } from "@/lib/football-api/types";

type HookState<T> = {
  data: T;
  loading: boolean;
  error?: string;
  source: "live" | "demo";
};

async function fetchRoute<T>(url: string): Promise<ProviderResponse<T>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed request: ${res.status}`);
  return res.json();
}

function useFootballRoute<T>(url: string, initialData: T): HookState<T> {
  const [state, setState] = useState<HookState<T>>({
    data: initialData,
    loading: true,
    source: "demo"
  });

  useEffect(() => {
    let active = true;
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
        setState((prev) => ({ ...prev, loading: false, error: err instanceof Error ? err.message : "Failed to load" }));
      });
    return () => {
      active = false;
    };
  }, [url]);

  return state;
}

export function useTicker(initialData: TickerItem[]) {
  return useFootballRoute<TickerItem[]>("/api/football/ticker", initialData);
}

export function useFixtures(initialData: Fixture[]) {
  return useFootballRoute<Fixture[]>("/api/football/fixtures", initialData);
}

export function useStandings(initialData: StandingsData) {
  return useFootballRoute<StandingsData>("/api/football/standings", initialData);
}

export function useMatchCenter(initialData: FeaturedMatch) {
  return useFootballRoute<FeaturedMatch>("/api/football/match-center", initialData);
}
