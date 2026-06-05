"use client";

import { motion } from "framer-motion";
import { getTickerSeed } from "@/lib/football-widget-seeds";
import { useTicker } from "@/hooks/useFootballData";
import { TickerMatchChip } from "@/components/widgets/ticker-match-chip";

export function LiveMatchTicker() {
  const { data, loading, source } = useTicker(getTickerSeed());

  return (
    <section className="section-shell py-4 sm:py-5">
      <div className="theater-dark relative overflow-hidden rounded-2xl border border-white/15 bg-[#141414]">
        <div
          className="bg-pioRed px-4 py-2.5 text-center text-xs font-bold uppercase tracking-[0.22em] text-white sm:py-3 sm:text-sm sm:tracking-[0.24em]"
          style={{ backgroundColor: "#d71920" }}
        >
          Presentado por patrocinador
        </div>

        <div className="px-4 py-3 sm:px-5 sm:py-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold leading-tight tracking-[-0.01em] text-white sm:text-lg">
              Resultados de Futbol en Vivo
            </h2>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${
                source === "live" ? "bg-red-600 text-white" : "bg-white/10 text-white/70"
              }`}
            >
              {source === "live" ? "Datos en vivo" : "Datos demo"}
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-9 min-w-[220px] animate-pulse rounded-full bg-white/10" />
                ))
              : data.map((item) => (
                  <motion.div key={item.id} whileHover={{ y: -2 }}>
                    <TickerMatchChip item={item} />
                  </motion.div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
