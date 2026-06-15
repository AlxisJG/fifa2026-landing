"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useFootballLiveSectionsVisible } from "@/contexts/football-live-sections-context";
import { fetchMatchPollWindows } from "@/lib/match-schedule-client";
import {
  getNextFootballPollDelayMs,
  shouldPollFootballLive,
  type MatchPollWindow
} from "@/lib/live-transmission-poll-schedule";
import type { FeaturedMatch, LiveFootballBundle, ProviderResponse } from "@/lib/football-api/types";

type LiveFootballContextValue = {
  match: FeaturedMatch;
  ticker: LiveFootballBundle["ticker"];
  loading: boolean;
  error?: string;
  source: "live" | "demo";
};

const LiveFootballContext = createContext<LiveFootballContextValue | null>(null);

type LiveFootballProviderProps = {
  children: ReactNode;
  initialMatch: FeaturedMatch;
  initialTicker: LiveFootballBundle["ticker"];
  initialSource?: "live" | "demo";
};

async function fetchLiveFootball(): Promise<ProviderResponse<LiveFootballBundle>> {
  const res = await fetch("/api/football/live");
  if (!res.ok) throw new Error(`Failed request: ${res.status}`);
  return res.json();
}

export function LiveFootballProvider({
  children,
  initialMatch,
  initialTicker,
  initialSource
}: LiveFootballProviderProps) {
  const visible = useFootballLiveSectionsVisible();
  const hasSsrSource = initialSource !== undefined;
  const [state, setState] = useState<LiveFootballContextValue>({
    match: initialMatch,
    ticker: initialTicker,
    loading: visible && !hasSsrSource,
    source: initialSource ?? "demo"
  });

  useEffect(() => {
    if (!visible) return;

    let active = true;
    let timeoutId: number | undefined;
    let windows: MatchPollWindow[] = [];

    function clearScheduledPoll() {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    }

    function scheduleNextPoll() {
      clearScheduledPoll();
      if (!active || document.hidden) return;
      const delay = getNextFootballPollDelayMs(windows, Date.now());
      timeoutId = window.setTimeout(() => void pollTick(), delay);
    }

    const load = (isPoll = false) => {
      if (!hasSsrSource && !isPoll) {
        setState((prev) => ({ ...prev, loading: true }));
      }

      return fetchLiveFootball()
        .then((payload) => {
          if (!active) return;
          setState({
            match: payload.data.match,
            ticker: payload.data.ticker,
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

    async function pollTick() {
      if (!active || document.hidden) return;

      const now = Date.now();
      if (shouldPollFootballLive(windows, now)) {
        await load(true);
      }

      scheduleNextPoll();
    }

    async function init() {
      try {
        windows = await fetchMatchPollWindows();
      } catch {
        windows = [];
      }

      if (!active) return;

      if (shouldPollFootballLive(windows)) {
        if (!hasSsrSource) {
          await load();
        } else {
          await load(true);
        }
      } else {
        scheduleNextPoll();
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        clearScheduledPoll();
      } else {
        void init();
      }
    }

    if (!document.hidden) {
      void init();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      clearScheduledPoll();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasSsrSource, visible]);

  const value = useMemo(() => state, [state]);

  return <LiveFootballContext.Provider value={value}>{children}</LiveFootballContext.Provider>;
}

export function useLiveFootball(): LiveFootballContextValue {
  const context = useContext(LiveFootballContext);
  if (!context) {
    throw new Error("useLiveFootball must be used within LiveFootballProvider");
  }
  return context;
}
