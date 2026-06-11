import { MarketingShell } from "@/components/layout/marketing-shell";
import {
  isFootballLiveSectionsManuallyEnabled,
  shouldShowFootballLiveSections
} from "@/lib/football-live-sections-gate";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const manualEnabled = isFootballLiveSectionsManuallyEnabled();
  const visible = shouldShowFootballLiveSections();

  return (
    <MarketingShell manualLiveSectionsEnabled={manualEnabled} liveSectionsVisible={visible}>
      {children}
    </MarketingShell>
  );
}
