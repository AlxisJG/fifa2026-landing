"use client";

import { motion } from "framer-motion";

type FloatingSideAdsProps = {
  title: string;
  sizeLabel: string;
  placement: string;
  variant?: "left" | "right";
};

function SideUnit({ title, sizeLabel, placement, variant = "left" }: FloatingSideAdsProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: variant === "left" ? -16 : 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="glass-heavy relative w-[160px] min-h-[600px] rounded-2xl border border-slate-300/80 p-4"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#d71920] via-[#0ea5e9] to-[#d4a017]" />
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Sponsor</p>
      <p className="mt-3 text-sm font-semibold leading-tight text-slate-900">{title}</p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-slate-500">{sizeLabel}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">{placement}</p>
    </motion.aside>
  );
}

export function FloatingSideAds() {
  return (
    <>
      <div className="pointer-events-none fixed left-4 top-28 z-20 hidden 2xl:block">
        <div className="pointer-events-auto sticky top-28">
          <SideUnit title="Vertical Sponsor" sizeLabel="160x600" placement="Left Rail" variant="left" />
        </div>
      </div>
      <div className="pointer-events-none fixed right-4 top-28 z-20 hidden 2xl:block">
        <div className="pointer-events-auto sticky top-28">
          <SideUnit title="Vertical Sponsor" sizeLabel="160x600" placement="Right Rail" variant="right" />
        </div>
      </div>
    </>
  );
}
