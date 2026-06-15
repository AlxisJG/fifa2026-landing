"use client";

import { motion } from "framer-motion";
import { useLiveFootball } from "@/contexts/live-football-context";
import { FootballSourceBadge } from "@/components/football/football-source-badge";
import { TickerMatchChip } from "@/components/widgets/ticker-match-chip";

type LiveMatchTickerProps = {
  embedded?: boolean;
  embeddedTopClassName?: string;
};

export function LiveMatchTicker({ embedded = false, embeddedTopClassName }: LiveMatchTickerProps) {
  const { ticker: data, loading, source } = useLiveFootball();

  const card = (
      <div className="theater-dark relative overflow-hidden rounded-2xl border border-white/15 bg-[#141414]">
        <div
          className="bg-pioRed px-4 py-2.5 text-center text-xs font-bold uppercase tracking-[0.22em] text-white sm:py-3 sm:text-sm sm:tracking-[0.24em]"
          style={{ backgroundColor: "#d71920" }}
        >
          Presentado por AES DOMINICANA
        </div>

        <div className="px-4 py-3 sm:px-5 sm:py-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold leading-tight tracking-[-0.01em] text-white sm:text-lg">
              Resultados de Futbol en Vivo
            </h2>
            <FootballSourceBadge
              live={source === "live"}
              demoLabel="Datos demo"
              compact
            />
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
  );

  if (embedded) {
    return <div className={embeddedTopClassName ?? "mt-6 sm:mt-8"}>{card}</div>;
  }

  return <section className="section-shell py-4 sm:py-5">{card}</section>;
}
