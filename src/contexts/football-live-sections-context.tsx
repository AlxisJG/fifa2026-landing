"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

type FootballLiveSectionsContextValue = {
  /** Whether live football UI blocks should render (and fetch API data). */
  visible: boolean;
  manualEnabled: boolean;
};

const FootballLiveSectionsContext = createContext<FootballLiveSectionsContextValue>({
  visible: true,
  manualEnabled: false
});

export function FootballLiveSectionsProvider({
  manualEnabled,
  visible,
  children
}: {
  manualEnabled: boolean;
  visible: boolean;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ visible, manualEnabled }), [visible, manualEnabled]);

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
