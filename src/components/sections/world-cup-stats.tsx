"use client";

import { useState } from "react";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";
import { useSquads, useTopscorers } from "@/hooks/useFootballData";
import type { TopscorersData } from "@/lib/football-api/types";

const emptyTopscorers: TopscorersData = { goals: [], assists: [], cards: [] };

export function WorldCupStatsSection() {
  const { data: squads, loading: squadsLoading, source } = useSquads([]);
  const { data: topscorers, loading: topsLoading } = useTopscorers(emptyTopscorers);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  const hasSquads = squads.length > 0;
  const hasTopscorers =
    topscorers.goals.length > 0 || topscorers.assists.length > 0 || topscorers.cards.length > 0;

  return (
    <section id="world-cup-stats" className="section-shell py-12 sm:py-16">
      <div className="mb-6 flex items-center justify-between">
        <SectionTitle
          kicker="Mundial 2026"
          title="Plantillas y goleadores"
          subtitle="Equipos participantes y máximos goleadores según SportMonks."
        />
        <span
          className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${source === "live" ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/50"}`}
        >
          {source === "live" ? "Live" : "Demo"}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal>
          <div className="glass-heavy rounded-3xl border border-white/10 p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Selecciones
            </h3>
            {squadsLoading ? (
              <p className="text-sm text-white/50">Cargando plantillas...</p>
            ) : hasSquads ? (
              <ul className="max-h-80 space-y-2 overflow-y-auto">
                {squads.slice(0, 12).map((team) => (
                  <li key={team.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTeam(expandedTeam === team.id ? null : team.id)
                      }
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-white/5"
                    >
                      <span>
                        {team.name}
                        {team.placeholder && (
                          <span className="ml-2 text-[10px] text-amber-300/80">TBD</span>
                        )}
                      </span>
                      <span className="text-white/40">{team.players.length} jug.</span>
                    </button>
                    {expandedTeam === team.id && team.players.length > 0 && (
                      <ul className="mb-2 ml-4 border-l border-white/10 pl-3 text-xs text-white/60">
                        {team.players.slice(0, 8).map((p) => (
                          <li key={p.id}>{p.name}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/50">
                Activa USE_REAL_FOOTBALL_DATA para ver plantillas del Mundial.
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="glass-heavy rounded-3xl border border-white/10 p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Goleadores
            </h3>
            {topscorersLoading(topscorers, topsLoading) ? (
              <p className="text-sm text-white/50">Cargando estadísticas...</p>
            ) : hasTopscorers ? (
              <TopscorerList title="Goles" entries={topscorers.goals} />
            ) : (
              <p className="text-sm text-white/50">Sin datos de goleadores en modo demo.</p>
            )}
            {topscorers.assists.length > 0 && (
              <TopscorerList title="Asistencias" entries={topscorers.assists} className="mt-6" />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function topscorersLoading(data: TopscorersData, loading: boolean) {
  return loading && !data.goals.length;
}

function TopscorerList({
  title,
  entries,
  className = ""
}: {
  title: string;
  entries: TopscorersData["goals"];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-white/45">{title}</p>
      <ol className="space-y-2">
        {entries.slice(0, 5).map((e, i) => (
          <li key={`${title}-${e.playerName}-${i}`} className="flex justify-between text-sm text-white/80">
            <span>
              {i + 1}. {e.playerName}
              {e.teamName && <span className="text-white/40"> ({e.teamName})</span>}
            </span>
            <span className="font-semibold text-electric">{e.value}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
