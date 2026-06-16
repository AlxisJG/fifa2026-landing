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
import { useLiveTransmissionAvailable } from "@/hooks/use-live-stream-status";
import { readFootballLiveCache, writeFootballLiveCache } from "@/lib/football-live-cache";
import { fetchMatchPollWindows } from "@/lib/match-schedule-client";
import {
  getFootballLiveRefreshDelayMs,
  shouldRefreshFootballLive,
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

function hasDisplayableMatch(match: FeaturedMatch): boolean {
  return Boolean(match.homeCode?.trim() && match.awayCode?.trim());
}

function hasDisplayableBundle(match: FeaturedMatch, ticker: LiveFootballBundle["ticker"]): boolean {
  return hasDisplayableMatch(match) || ticker.length > 0;
}

function resolveInitialState(
  initialMatch: FeaturedMatch,
  initialTicker: LiveFootballBundle["ticker"],
  initialSource?: "live" | "demo",
  visible = true
): LiveFootballContextValue {
  const cached = readFootballLiveCache();

  if (cached && hasDisplayableBundle(cached.data.match, cached.data.ticker)) {
    return {
      match: cached.data.match,
      ticker: cached.data.ticker,
      loading: false,
      source: cached.source
    };
  }

  const hasSsrSource = initialSource !== undefined;
  const hasData = hasDisplayableBundle(initialMatch, initialTicker);

  return {
    match: initialMatch,
    ticker: initialTicker,
    loading: visible && !hasSsrSource && !hasData,
    source: initialSource ?? "demo"
  };
}

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
  const streamAvailable = useLiveTransmissionAvailable();
  const hasSsrSource = initialSource !== undefined;
  const [state, setState] = useState<LiveFootballContextValue>(() =>
    resolveInitialState(initialMatch, initialTicker, initialSource, visible)
  );

  useEffect(() => {
    if (
      hasSsrSource &&
      hasDisplayableBundle(initialMatch, initialTicker) &&
      initialSource
    ) {
      writeFootballLiveCache(initialSource, {
        match: initialMatch,
        ticker: initialTicker
      });
    }
  }, [hasSsrSource, initialMatch, initialTicker, initialSource]);

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

      const delay = getFootballLiveRefreshDelayMs(windows, Date.now(), streamAvailable);
      timeoutId = window.setTimeout(() => void pollTick(), delay);
    }

    const applyPayload = (payload: ProviderResponse<LiveFootballBundle>) => {
      writeFootballLiveCache(payload.source, payload.data);
      setState({
        match: payload.data.match,
        ticker: payload.data.ticker,
        loading: false,
        error: payload.error,
        source: payload.source
      });
    };

    const load = async (background = false) => {
      if (!background) {
        setState((prev) => {
          if (hasDisplayableBundle(prev.match, prev.ticker)) return prev;
          return { ...prev, loading: true };
        });
      }

      try {
        const payload = await fetchLiveFootball();
        if (!active) return;
        applyPayload(payload);
      } catch (err) {
        if (!active) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load"
        }));
      }
    };

    async function pollTick() {
      if (!active || document.hidden) return;

      const now = Date.now();
      if (shouldRefreshFootballLive(windows, now, streamAvailable)) {
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

      if (shouldRefreshFootballLive(windows, Date.now(), streamAvailable)) {
        const hasCached = Boolean(readFootballLiveCache());
        const hasInitial = hasSsrSource || hasDisplayableBundle(initialMatch, initialTicker);
        await load(hasCached || hasInitial);
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
  }, [visible, streamAvailable, hasSsrSource, initialMatch, initialTicker]);

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
