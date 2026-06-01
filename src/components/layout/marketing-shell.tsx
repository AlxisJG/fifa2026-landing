"use client";

import type { ReactNode } from "react";
import { isFootballLiveSectionsManuallyEnabled } from "@/lib/football-live-sections-gate";
import { FootballLiveSectionsProvider } from "@/contexts/football-live-sections-context";
import { TopNav } from "@/components/sections/top-nav";
import { FooterSection } from "@/components/sections/footer";
import { AmbientBackground } from "@/components/ui/ambient-bg";

export function MarketingShell({ children }: { children: ReactNode }) {
  const manualLiveSectionsEnabled = isFootballLiveSectionsManuallyEnabled();

  return (
    <FootballLiveSectionsProvider manualEnabled={manualLiveSectionsEnabled}>
      <div className="relative min-h-screen overflow-x-hidden">
        <AmbientBackground />
        <TopNav />
        {children}
        <FooterSection />
      </div>
    </FootballLiveSectionsProvider>
  );
}
