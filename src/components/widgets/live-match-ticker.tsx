"use client";

import { motion } from "framer-motion";
import { tickerItems as initialTicker } from "@/data/worldcup-widgets";
import { useTicker } from "@/hooks/useFootballData";

export function LiveMatchTicker() {
  const { data, loading, source } = useTicker(initialTicker);

  return (
    <section className="section-shell py-4 sm:py-5">
      <div className="theater-dark glass-heavy relative overflow-hidden rounded-2xl border border-white/20 bg-[#0a1a33]/85 px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white/85">
            Presented by Sponsor
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${source === "live" ? "bg-emerald-500/20 text-emerald-200" : "bg-white/10 text-white/70"}`}>
            {source === "live" ? "Live data" : "Demo data"}
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 min-w-[180px] animate-pulse rounded-full bg-white/10" />
              ))
            : data.map((item) => (
                <motion.div key={item.id} whileHover={{ y: -2 }} className="flex min-w-max items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/90">
                  {item.live && <span className="h-2 w-2 rounded-full bg-red-400" />}
                  <span>{item.text}</span>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
