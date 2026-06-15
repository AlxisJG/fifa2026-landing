"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { fetchMatchPollWindows } from "@/lib/match-schedule-client";
import {
  getNextPollDelayMs,
  shouldPollStreamStatus,
  type MatchPollWindow
} from "@/lib/live-transmission-poll-schedule";
import { isLiveTransmissionEnabledOnClient } from "@/lib/live-transmission-gate";

type LiveTransmissionContextValue = {
  available: boolean;
};

const LiveTransmissionContext = createContext<LiveTransmissionContextValue>({
  available: false
});

async function fetchStreamAvailable(): Promise<boolean> {
  const res = await fetch("/api/stream/status");
  if (!res.ok) return false;
  const data = (await res.json()) as { available?: boolean };
  return Boolean(data.available);
}

export function LiveTransmissionProvider({ children }: { children: ReactNode }) {
  const [available, setAvailable] = useState(false);
  const availableRef = useRef(false);

  useEffect(() => {
    availableRef.current = available;
  }, [available]);

  useEffect(() => {
    if (!isLiveTransmissionEnabledOnClient()) {
      setAvailable(false);
      return;
    }

    let cancelled = false;
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
      if (cancelled || document.hidden) return;

      const delay = getNextPollDelayMs(windows, Date.now(), availableRef.current);
      timeoutId = window.setTimeout(() => void pollTick(), delay);
    }

    async function pollTick() {
      if (cancelled || document.hidden) return;

      const now = Date.now();
      if (!shouldPollStreamStatus(windows, now)) {
        setAvailable(false);
        scheduleNextPoll();
        return;
      }

      try {
        const isAvailable = await fetchStreamAvailable();
        if (!cancelled) {
          setAvailable(isAvailable);
          availableRef.current = isAvailable;
        }
      } catch {
        if (!cancelled) {
          setAvailable(false);
          availableRef.current = false;
        }
      }

      scheduleNextPoll();
    }

    async function refreshSchedule() {
      try {
        windows = await fetchMatchPollWindows();
      } catch {
        windows = [];
      }
    }

    async function init() {
      await refreshSchedule();
      if (cancelled) return;

      if (shouldPollStreamStatus(windows)) {
        await pollTick();
      } else {
        setAvailable(false);
        availableRef.current = false;
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

    void init();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      clearScheduledPoll();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const value = useMemo(() => ({ available }), [available]);

  return (
    <LiveTransmissionContext.Provider value={value}>{children}</LiveTransmissionContext.Provider>
  );
}

export function useLiveTransmissionAvailable(): boolean {
  return useContext(LiveTransmissionContext).available;
}
