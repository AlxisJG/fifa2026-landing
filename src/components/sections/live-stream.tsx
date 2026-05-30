"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AdSlotFrame } from "@/components/ads/ad-slot-frame";
import { RectangleAdSlot } from "@/components/ads/rectangle-ad-slot";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";
import { rectanglePlacements } from "@/data/ad-placements";
import { AD_SIZES } from "@/lib/ad-sizes";
import { isAdsEnabled } from "@/lib/ads-gate";
import { BRANDING } from "@/lib/branding";

export function LiveStreamSection() {
  const adsEnabled = isAdsEnabled();

  return (
    <section id="live" className="section-shell pt-16 sm:pt-24">
      <SectionTitle
        kicker="Transmisión"
        as="h3"
        title="Juego en vivo"
        subtitle="Transmisión principal con panel lateral y banner rectángulo integrado."
      />
      <div className="grid gap-5 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <Reveal>
            <div className="theater-dark glass-heavy relative overflow-hidden rounded-3xl border border-slate-700/60 bg-[#090f1f] p-4 shadow-[0_25px_80px_rgba(2,6,23,0.55)] sm:p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(70,210,255,0.18),transparent_40%)]" />
              <div className="pointer-events-none absolute bottom-4 right-4 opacity-10">
                <Image
                  src={BRANDING.fifaLogoWhite}
                  alt="FIFA World Cup 2026 watermark"
                  width={120}
                  height={120}
                  className="h-16 w-16 object-contain sm:h-24 sm:w-24"
                />
              </div>
              <div className="relative mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-400" />
                  <span className="rounded-full bg-red-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">En vivo</span>
                </div>
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-blue-900">DRM Secured</span>
              </div>

              <div className="relative h-[250px] overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#0c1c3d] via-[#0a1225] to-[#070b16] sm:h-[420px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_100%,rgba(70,210,255,0.22),transparent_45%)]" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">Main Feed</div>
                <div className="relative grid h-full place-items-center">
                  <p className="text-center text-sm leading-relaxed text-white/70">
                    JW Player Embed Placeholder
                    <br />
                    Tokenized AWS DRM stream + live SSAI hooks
                  </p>
                </div>
              </div>

              <div className="relative mt-4 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="rounded-xl border border-slate-300 bg-white/90 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-900">USA vs Mexico</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-blue-800">SoFi Stadium | Group Stage</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Auto", "1080p", "EN", "Fullscreen"].map((btn) => (
                    <button
                      key={btn}
                      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-blue-900 transition hover:bg-slate-100"
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {adsEnabled && (
            <Reveal delay={0.08}>
              <div className="flex justify-center">
                <AdSlotFrame
                  format="leaderboard"
                  id={rectanglePlacements.liveStreamPlayer.id}
                  title={rectanglePlacements.liveStreamPlayer.title}
                  placement={rectanglePlacements.liveStreamPlayer.placement}
                  activeSizeLabel={AD_SIZES.leaderboard.label}
                  className="mx-auto hidden md:block lg:block"
                />
                <AdSlotFrame
                  format="mobile-banner"
                  id={`${rectanglePlacements.liveStreamPlayer.id}-mobile`}
                  title={rectanglePlacements.liveStreamPlayer.title}
                  placement={rectanglePlacements.liveStreamPlayer.placement}
                  activeSizeLabel={AD_SIZES["mobile-banner"].label}
                  variant="matchday"
                  className="mx-auto md:hidden"
                />
              </div>
            </Reveal>
          )}
        </div>

        <div className="flex flex-col gap-4 xl:col-span-4">
          <Reveal delay={0.12}>
            <aside className="glass-heavy flex min-h-[250px] flex-col rounded-3xl border border-slate-300 bg-white/95 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.12)] sm:min-h-[420px] sm:p-6 xl:min-h-0">
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-blue-900">Broadcast Center</h3>
              <p className="mt-2 text-sm text-slate-700">Lineup, next feeds and real-time production notes.</p>
              <div className="mt-5 flex-1 space-y-3">
                {["Next: Spain vs France", "After: Argentina vs Brazil", "Pre-game show in 18m"].map((item) => (
                  <motion.div key={item} whileHover={{ x: 4 }} className="rounded-2xl border border-slate-300 bg-slate-50 p-3.5 text-sm text-slate-800">
                    {item}
                  </motion.div>
                ))}
              </div>
            </aside>
          </Reveal>

          {adsEnabled && (
            <Reveal delay={0.16}>
              <RectangleAdSlot placement={rectanglePlacements.liveStream} className="mx-auto" />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
