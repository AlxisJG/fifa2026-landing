"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/** Alineado con MAX_SEGMENT_AGE_MS en brightcove-live-status. */
const POLL_INTERVAL_MS = 30_000;

type LiveTransmissionContextValue = {
  available: boolean;
};

const LiveTransmissionContext = createContext<LiveTransmissionContextValue>({
  available: false
});

export function LiveTransmissionProvider({ children }: { children: ReactNode }) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let intervalId: number | undefined;

    async function check() {
      try {
        const res = await fetch("/api/stream/status");
        if (!res.ok) throw new Error("status_unavailable");
        const data = (await res.json()) as { available?: boolean };
        if (!cancelled) setAvailable(Boolean(data.available));
      } catch {
        if (!cancelled) setAvailable(false);
      }
    }

    function stopPolling() {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
    }

    function startPolling() {
      stopPolling();
      void check();
      intervalId = window.setInterval(() => void check(), POLL_INTERVAL_MS);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    }

    if (!document.hidden) {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      stopPolling();
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
