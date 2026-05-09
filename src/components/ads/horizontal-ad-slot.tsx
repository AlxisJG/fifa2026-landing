"use client";

import { motion } from "framer-motion";

type HorizontalAdSlotProps = {
  title: string;
  sizeLabel: string;
  placement: string;
  variant?: "default" | "leaderboard" | "matchday";
};

const variantStyles: Record<NonNullable<HorizontalAdSlotProps["variant"]>, string> = {
  default: "from-electric/15 via-white/5 to-transparent",
  leaderboard: "from-gold/15 via-white/5 to-transparent",
  matchday: "from-[#7ce2ff]/15 via-white/5 to-transparent"
};

export function HorizontalAdSlot({ title, sizeLabel, placement, variant = "default" }: HorizontalAdSlotProps) {
  return (
    <section className="section-shell py-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="glass-heavy relative overflow-hidden rounded-2xl border border-slate-300/80"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#d71920] via-[#0ea5e9] to-[#d4a017]" />
        <div className={`absolute inset-0 bg-gradient-to-r ${variantStyles[variant]}`} />
        <div className="relative flex min-h-[78px] flex-col justify-between gap-3 p-4 sm:min-h-[90px] sm:flex-row sm:items-center sm:p-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">AD / SPONSOR</p>
            <p className="mt-2 text-base font-semibold tracking-[-0.01em] text-slate-900 sm:text-lg">{title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{placement}</p>
          </div>
          <div className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-700">
            {sizeLabel}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
