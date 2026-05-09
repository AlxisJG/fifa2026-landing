"use client";

import { motion } from "framer-motion";
import { featuredMatch as initialMatch } from "@/data/worldcup-widgets";
import { useMatchCenter } from "@/hooks/useFootballData";

export function FeaturedMatchCenter() {
  const { data, loading, source } = useMatchCenter(initialMatch);

  return (
    <section className="section-shell py-6 sm:py-8">
      <motion.div whileHover={{ y: -4 }} className="glass-heavy rounded-3xl border border-sky-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(235,246,255,0.9))] p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-900">Featured Match Center</p>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-700">{data.sponsor}</span>
            <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${source === "live" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
              {source === "live" ? "Live data" : "Demo data"}
            </span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            {loading ? (
              <div className="h-9 w-64 animate-pulse rounded bg-slate-200" />
            ) : (
              <h3 className="text-3xl font-bold tracking-[-0.02em] text-slate-900">
                {data.home} <span className="text-slate-400">vs</span> {data.away}
              </h3>
            )}
            <p className="mt-2 text-sm text-slate-700">{data.venue}</p>
            <p className="text-sm text-blue-900">{data.stage}</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">Kickoff: {data.kickoff}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-[#22B7FF] px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#061224]">Watch Live</button>
            <button className="rounded-full border border-slate-300 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-800">Match Center</button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
