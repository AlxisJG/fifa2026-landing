"use client";

import { useMemo, useState } from "react";
import { FootballDataEmpty } from "@/components/football/football-data-empty";
import { SectionTitle } from "@/components/ui/section-title";
import { useStandings } from "@/hooks/useFootballData";
import { getStandingsSeed } from "@/lib/football-widget-seeds";

export function StandingsWidget({ showHeader = false }: { showHeader?: boolean }) {
  const { data, loading, source } = useStandings(getStandingsSeed());
  const groups = data.groups ?? [];
  const [activeGroup, setActiveGroup] = useState(0);

  const current = useMemo(() => groups[activeGroup] ?? groups[0], [groups, activeGroup]);
  const hasData = groups.length > 0;
  const showSourceBadge = hasData && !loading;

  return (
    <section id="standings" className="section-shell py-12 sm:py-16">
      {(showHeader || showSourceBadge) && (
        <div className="mb-2 flex items-center justify-between">
          {showHeader ? (
            <SectionTitle
              kicker="Estadísticas"
              title="Equipos, Jugadores y Estadísticas"
              subtitle="Tablas de posiciones del Mundial FIFA 2026 por grupo."
            />
          ) : (
            <div />
          )}
          {showSourceBadge && (
            <span
              className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${source === "live" ? "bg-red-600 text-white" : "bg-white/10 text-white/50"}`}
            >
              {source === "live" ? "Datos en vivo" : "Demo"}
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="glass-heavy h-64 animate-pulse rounded-3xl" />
      ) : !hasData ? (
        <FootballDataEmpty message="Las tablas de posiciones estarán disponibles próximamente." />
      ) : (
        <>
          {groups.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {groups.map((g, i) => (
                <button
                  key={g.group}
                  type="button"
                  onClick={() => setActiveGroup(i)}
                  className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
                    activeGroup === i
                      ? "bg-electric text-midnight"
                      : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {g.group}
                </button>
              ))}
            </div>
          )}

          <div className="glass-heavy overflow-hidden rounded-3xl">
            <div className="border-b border-white/10 px-5 py-4 text-[11px] uppercase tracking-[0.22em] text-white/55">
              {current?.group ?? "Grupo"}
            </div>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10">
                <tr className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                  <th className="px-5 py-3 font-medium">Equipo</th>
                  <th className="px-4 py-3 font-medium">Pts</th>
                  <th className="px-4 py-3 font-medium">DG</th>
                </tr>
              </thead>
              <tbody>
                {(current?.rows ?? []).map((row, index) => (
                  <tr
                    key={`${current?.group}-${row.team}`}
                    className={`border-b border-white/5 text-white last:border-b-0 ${
                      index < 2 ? "bg-emerald-500/5" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5 font-semibold">
                      <span className="mr-3 inline-block w-5 text-white/35">{index + 1}</span>
                      {row.team}
                      {row.isPlaceholder && (
                        <span className="ml-2 text-[10px] font-normal uppercase tracking-[0.14em] text-amber-200/70">
                          TBD
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 tabular-nums">{row.pts}</td>
                    <td className="px-4 py-3.5 tabular-nums text-white/72">{row.gd}</td>
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
