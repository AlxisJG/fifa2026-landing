"use client";

import type { ReactNode } from "react";
import { FootballLiveSectionsProvider } from "@/contexts/football-live-sections-context";
import { LiveTransmissionProvider } from "@/contexts/live-transmission-context";
import { AppDownloadBanner } from "@/components/layout/app-download-banner";
import { NativeScrollTopButton } from "@/components/layout/native-scroll-top-button";
import { FixedSkyscraperAds } from "@/components/ads/fixed-skyscraper-ads";
import { TopNav } from "@/components/sections/top-nav";
import { FooterSection } from "@/components/sections/footer";
import { AmbientBackground } from "@/components/ui/ambient-bg";

type MarketingShellProps = {
  children: ReactNode;
  manualLiveSectionsEnabled: boolean;
  liveSectionsVisible: boolean;
};

export function MarketingShell({
  children,
  manualLiveSectionsEnabled,
  liveSectionsVisible
}: MarketingShellProps) {
  return (
    <LiveTransmissionProvider>
      <FootballLiveSectionsProvider
        manualEnabled={manualLiveSectionsEnabled}
        visible={liveSectionsVisible}
      >
        <div className="relative min-h-screen overflow-x-hidden">
          <AmbientBackground />
          <FixedSkyscraperAds />
          <TopNav />
          {children}
          <FooterSection />
          <NativeScrollTopButton />
          <AppDownloadBanner />
        </div>
      </FootballLiveSectionsProvider>
    </LiveTransmissionProvider>
  );
}
