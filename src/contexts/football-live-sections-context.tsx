"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isWorldCupKickoffReached } from "@/lib/world-cup-kickoff";

type FootballLiveSectionsContextValue = {
  /** Whether live football UI blocks should render (and fetch API data). */
  visible: boolean;
  manualEnabled: boolean;
  kickoffReached: boolean;
};

const FootballLiveSectionsContext = createContext<FootballLiveSectionsContextValue>({
  visible: true,
  manualEnabled: false,
  kickoffReached: false
});

export function FootballLiveSectionsProvider({
  manualEnabled,
  children
}: {
  manualEnabled: boolean;
  children: ReactNode;
}) {
  const [kickoffReached, setKickoffReached] = useState(() => isWorldCupKickoffReached());
  const isDevelopment = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (kickoffReached) return;
    const id = window.setInterval(() => {
      if (isWorldCupKickoffReached()) {
        setKickoffReached(true);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [kickoffReached]);

  const visible = useMemo(
    () => isDevelopment || (manualEnabled && kickoffReached),
    [isDevelopment, manualEnabled, kickoffReached]
  );

  const value = useMemo(
    () => ({ visible, manualEnabled, kickoffReached }),
    [visible, manualEnabled, kickoffReached]
  );

  return (
    <FootballLiveSectionsContext.Provider value={value}>
      {children}
    </FootballLiveSectionsContext.Provider>
  );
}

export function useFootballLiveSectionsVisible(): boolean {
  return useContext(FootballLiveSectionsContext).visible;
}

export function useFootballLiveSectionsGate(): FootballLiveSectionsContextValue {
  return useContext(FootballLiveSectionsContext);
}
