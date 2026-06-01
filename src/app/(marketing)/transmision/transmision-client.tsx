"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { usePlan } from "@/hooks/use-plan";
import { BRANDING } from "@/lib/branding";
import { hasStreamAccess, planShowsAds } from "@/lib/plan-storage";
import { MarketingPageMain } from "@/components/layout/page-intro";
import { TransmisionLiveBlock } from "@/components/sections/live-blocks";
import { HorizontalAdSlot } from "@/components/ads/horizontal-ad-slot";
import { isAdsEnabled } from "@/lib/ads-gate";
import { isSubscriptionFunnelEnabled } from "@/lib/subscription-funnel-gate";

export default function TransmisionPage() {
  const { user, loading } = useAuth();
  const { plan, ready } = usePlan();
  const router = useRouter();
  const adsEnabled = isAdsEnabled();
  const showAds = adsEnabled && planShowsAds(plan);

  useEffect(() => {
    if (!isSubscriptionFunnelEnabled()) {
      router.replace("/");
      return;
    }
    if (!loading && !user) {
      router.replace("/suscribete");
      return;
    }
    if (!loading && user && ready && !hasStreamAccess()) {
      router.replace("/suscribete");
    }
  }, [user, loading, ready, router]);

  if (loading || !ready) {
    return (
      <MarketingPageMain>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-white/50">Cargando transmisión...</p>
        </div>
      </MarketingPageMain>
    );
  }

  if (!user || !hasStreamAccess()) return null;

  return (
    <MarketingPageMain>
      <section className="section-shell py-8 sm:py-10">
        <TransmisionLiveBlock />

        <div className="theater-dark mt-8 glass-heavy relative overflow-hidden rounded-3xl border border-slate-700/60 bg-[#090f1f] p-4 shadow-[0_25px_80px_rgba(2,6,23,0.55)] sm:p-6">
          <div className="relative mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-400" />
              <span className="rounded-full bg-red-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                Live PPV
              </span>
            </div>
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-blue-900">
              {showAds ? "Con anuncios" : "Sin anuncios"}
            </span>
          </div>

          {showAds && (
            <div className="mb-4">
              <HorizontalAdSlot
                id="transmision-pre-roll"
                title="Patrocinador en vivo"
                placement="Transmisión pre-roll"
                variant="leaderboard"
              />
            </div>
          )}

          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#0c1c3d] via-[#0a1225] to-[#070b16]">
            <div className="pointer-events-none absolute bottom-4 right-4 opacity-10">
              <Image
                src={BRANDING.fifaLogoWhite}
                alt="FIFA World Cup 2026 watermark"
                width={120}
                height={120}
                className="h-16 w-16 object-contain sm:h-24 sm:w-24"
              />
            </div>
            <div className="relative grid h-full place-items-center">
              <div className="text-center">
                <p className="text-6xl">📺</p>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  Transmisión en vivo — {plan?.name ?? "Plan activo"}
                </p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <p className="text-xs text-white/50">
              {showAds ? (
                <>
                  <span className="text-electric">Plan gratis activo</span> — Puedes mejorar a premium en{" "}
                  <a href="/planes" className="underline">
                    Planes
                  </a>{" "}
                  para quitar anuncios.
                </>
              ) : (
                <>
                  <span className="text-electric">Plan premium activo</span> — Disfruta la transmisión sin anuncios.
                </>
              )}
            </p>
          </motion.div>
        </div>
      </section>
    </MarketingPageMain>
  );
}
