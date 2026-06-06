"use client";

import { motion } from "framer-motion";
import { MarketingPageMain } from "@/components/layout/page-intro";
import { PageContentAds } from "@/components/layout/page-content-ads";
import { TransmisionLiveBlock } from "@/components/sections/live-blocks";
import { HorizontalAdSlot } from "@/components/ads/horizontal-ad-slot";
import { BrightcoveLivePlayer } from "@/components/video/brightcove-live-player";
import { isAdsEnabled } from "@/lib/ads-gate";

export default function TransmisionPage() {
  const adsEnabled = isAdsEnabled();

  return (
    <MarketingPageMain>
      <PageContentAds page="transmision">
        <section className="section-shell py-8 sm:py-10">
          <TransmisionLiveBlock />

          <div className="theater-dark mt-8 glass-heavy relative overflow-hidden rounded-3xl border border-slate-700/60 bg-[#090f1f] p-4 shadow-[0_25px_80px_rgba(2,6,23,0.55)] sm:p-6">
            <div className="relative mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-400" />
                <span className="rounded-full bg-red-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                  En vivo
                </span>
              </div>
            </div>

            {adsEnabled && (
              <div className="mb-4">
                <HorizontalAdSlot
                  id="transmision-pre-roll"
                  title="Patrocinador en vivo"
                  placement="Transmisión pre-roll"
                  variant="leaderboard"
                />
              </div>
            )}

            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/15 bg-black">
              <BrightcoveLivePlayer />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <p className="text-xs text-white/50">
                Transmisión en vivo del Mundial 2026 — disponible para todos los visitantes.
              </p>
            </motion.div>
          </div>
        </section>
      </PageContentAds>
    </MarketingPageMain>
  );
}
