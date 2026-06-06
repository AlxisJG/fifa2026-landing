"use client";

import { useEffect, useState } from "react";

const POLL_INTERVAL_MS = 20_000;

type LiveTransmissionStatusResponse = {
  active: boolean;
  enabled: boolean;
  available: boolean;
  lastSegmentAt: string | null;
  error?: string;
};

export function useLiveTransmissionAvailable() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/stream/status");
        if (!res.ok) throw new Error("status_unavailable");
        const data = (await res.json()) as LiveTransmissionStatusResponse;
        if (!cancelled) setAvailable(Boolean(data.available));
      } catch {
        if (!cancelled) setAvailable(false);
      }
    }

    check();
    const intervalId = window.setInterval(check, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  return available;
}
