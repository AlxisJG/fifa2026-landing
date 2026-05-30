"use client";

import { useMemo, useState } from "react";
import { FootballDataEmpty } from "@/components/football/football-data-empty";
import { SectionTitle } from "@/components/ui/section-title";
import { useStandings } from "@/hooks/useFootballData";
import { getStandingsSeed } from "@/lib/football-widget-seeds";
import type { StandingsRow } from "@/lib/football-api/types";

export function StandingsWidget() {
  const { data, loading, source } = useStandings(getStandingsSeed());
  const groups = data.groups ?? [];
  const [activeGroup, setActiveGroup] = useState(0);

  const current = useMemo(() => groups[activeGroup] ?? groups[0], [groups, activeGroup]);
  const hasData = groups.length > 0;
  const showSourceBadge = hasData && !loading;

  return (
    <section id="standings" className="section-shell py-12 sm:py-16">
      <div className="mb-2 flex items-center justify-between">
        <SectionTitle
          kicker="Estadísticas"
          title="Equipos, Jugadores y Estadísticas"
          subtitle="Tablas de posiciones del Mundial FIFA 2026 por grupo."
        />
        {showSourceBadge && (
          <span
            className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${source === "live" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
          >
            {source === "live" ? "Live data" : "Demo data"}
          </span>
        )}
      </div>

      {loading ? (
        <div className="glass h-64 animate-pulse rounded-2xl border border-slate-200" />
      ) : !hasData ? (
        <FootballDataEmpty
          message="Las tablas de posiciones estarán disponibles próximamente."
          variant="light"
        />
      ) : (
        <>
          {groups.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {groups.map((g, i) => (
                <button
                  key={g.group}
                  type="button"
                  onClick={() => setActiveGroup(i)}
                  className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] ${
                    activeGroup === i
                      ? "bg-blue-900 text-white"
                      : "border border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {g.group}
                </button>
              ))}
            </div>
          )}

          <div className="glass overflow-hidden rounded-2xl border border-slate-200">
            <div className="bg-slate-100 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-700">
              {current?.group ?? "Grupo"}
            </div>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-white">
                <tr className="text-slate-600">
                  <th className="px-4 py-3 font-medium">Team</th>
                  <th className="px-4 py-3 font-medium">Pts</th>
                  <th className="px-4 py-3 font-medium">GD</th>
                </tr>
              </thead>
              <tbody>
                {(current?.rows ?? []).map((row) => (
                  <tr
                    key={`${current?.group}-${row.team}`}
                    className="border-b border-slate-100 text-slate-800 last:border-b-0"
                  >
                    <td className="px-4 py-3 font-semibold">
                      {row.team}
                      {row.isPlaceholder && (
                        <span className="ml-2 text-[10px] font-normal uppercase tracking-[0.14em] text-slate-400">
                          TBD
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{row.pts}</td>
                    <td className="px-4 py-3">{row.gd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
