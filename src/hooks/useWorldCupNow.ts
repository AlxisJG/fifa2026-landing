"use client";

import { useEffect, useState } from "react";

/** Tick the clock so day-based UI (fixture tabs) updates after countdown / midnight. */
export function useWorldCupNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(interval);
  }, [intervalMs]);

  return now;
}
