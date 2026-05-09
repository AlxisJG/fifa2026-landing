"use client";

import { motion } from "framer-motion";

type CompanionAdSlotProps = {
  title: string;
  sizeLabel: string;
  placement: string;
  variant?: "default" | "player";
};

export function CompanionAdSlot({ title, sizeLabel, placement, variant = "player" }: CompanionAdSlotProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="glass relative overflow-hidden rounded-2xl border border-white/20 p-4"
    >
      <div className={`absolute inset-0 ${variant === "player" ? "bg-gradient-to-br from-electric/15 via-transparent to-gold/10" : "bg-gradient-to-r from-white/10 to-transparent"}`} />
      <div className="relative flex min-h-[84px] flex-col justify-between gap-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-blue-800">Companion Ad</p>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-600">
          <span>{sizeLabel}</span>
          <span>{placement}</span>
        </div>
      </div>
    </motion.div>
  );
}
