"use client";

import { motion } from "framer-motion";
import { fadeInMotionProps } from "@/components/ui/motion";
import type { AdFormat } from "@/lib/ad-sizes";
import { AD_SIZES } from "@/lib/ad-sizes";
import { isAdsEnabled } from "@/lib/ads-gate";

type AdSlotFrameProps = {
  format: AdFormat;
  id?: string;
  title: string;
  placement: string;
  activeSizeLabel?: string;
  variant?: "default" | "leaderboard" | "matchday" | "theater";
  className?: string;
};

const variantGradients: Record<NonNullable<AdSlotFrameProps["variant"]>, string> = {
  default: "from-electric/15 via-white/5 to-transparent",
  leaderboard: "from-gold/15 via-white/5 to-transparent",
  matchday: "from-[#7ce2ff]/15 via-white/5 to-transparent",
  theater: "from-electric/10 via-transparent to-gold/10"
};

export function AdSlotFrame({
  format,
  id,
  title,
  placement,
  activeSizeLabel,
  variant = "default",
  className = ""
}: AdSlotFrameProps) {
  if (!isAdsEnabled()) return null;

  const spec = AD_SIZES[format];
  const sizeLabel = activeSizeLabel ?? spec.label;

  return (
    <motion.div
      {...fadeInMotionProps(0, 12)}
      data-ad-slot={id}
      data-ad-format={format}
      data-ad-width={spec.width}
      data-ad-height={spec.height}
      style={{
        width: spec.width,
        height: spec.height,
        maxWidth: "100%"
      }}
      className={`glass-heavy relative mx-auto shrink-0 overflow-hidden rounded-xl border border-slate-300/80 ${spec.visibilityClass} ${className}`}
    >
      <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-[#d71920] via-[#0ea5e9] to-[#d4a017]" />
      <div className={`absolute inset-0 bg-gradient-to-br ${variantGradients[variant]}`} />
      <div className="relative flex h-full flex-col items-center justify-center gap-1 px-3 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">AD / SPONSOR</p>
        <p className="max-w-full truncate text-sm font-semibold text-slate-900">{title}</p>
        <p className="rounded-full border border-slate-300 bg-white/90 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-700">
          {sizeLabel}
        </p>
        <p className="max-w-full truncate text-[9px] uppercase tracking-[0.14em] text-slate-500">{placement}</p>
      </div>
    </motion.div>
  );
}
