"use client";

import { SectionTitle } from "@/components/ui/section-title";
import { standings as initialStandings } from "@/data/worldcup-widgets";
import { useStandings } from "@/hooks/useFootballData";

export function StandingsWidget() {
  const { data, loading, source } = useStandings(initialStandings);

  return (
    <section className="section-shell py-12 sm:py-16">
      <div className="mb-2 flex items-center justify-between">
        <SectionTitle kicker="Table" title="Posiciones" subtitle="Standings presented by Sponsor" />
        <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${source === "live" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
          {source === "live" ? "Live data" : "Demo data"}
        </span>
      </div>
      <div className="glass overflow-hidden rounded-2xl border border-slate-200">
        <div className="bg-slate-100 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-700">{data.group}</div>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-white">
            <tr className="text-slate-600">
              <th className="px-4 py-3 font-medium">Team</th>
              <th className="px-4 py-3 font-medium">Pts</th>
              <th className="px-4 py-3 font-medium">GD</th>
            </tr>
          </thead>
          <tbody>
            {(loading ? Array.from({ length: 4 }).map((_, i) => ({ team: `Loading ${i}`, pts: "-", gd: "-" })) : data.rows).map((row) => (
              <tr key={row.team} className="border-b border-slate-100 text-slate-800 last:border-b-0">
                <td className="px-4 py-3 font-semibold">{row.team}</td>
                <td className="px-4 py-3">{row.pts}</td>
                <td className="px-4 py-3">{row.gd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
