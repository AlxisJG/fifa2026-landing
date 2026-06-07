"use client";

import { useState } from "react";
import { FootballDataEmpty } from "@/components/football/football-data-empty";
import { FootballSourceBadge } from "@/components/football/football-source-badge";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";
import { useSquads, useTopscorers } from "@/hooks/useFootballData";
import { getSquadsSeed, getTopscorersSeed } from "@/lib/football-widget-seeds";
import type { TopscorersData } from "@/lib/football-api/types";

export function WorldCupStatsSection({ showHeader = true }: { showHeader?: boolean }) {
  const { data: squads, loading: squadsLoading, source } = useSquads(getSquadsSeed());
  const { data: topscorers, loading: topsLoading, source: topsSource } = useTopscorers(
    getTopscorersSeed()
  );
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  const hasSquads = squads.length > 0;
  const hasTopscorers =
    topscorers.goals.length > 0 || topscorers.assists.length > 0 || topscorers.cards.length > 0;
  const hasAnyData = hasSquads || hasTopscorers;
  const isLoading = squadsLoading || topsLoading;
  const showSourceBadge = hasAnyData && !isLoading;
  const liveSource = source === "live" || topsSource === "live";

  return (
    <section id="world-cup-stats" className="section-shell py-12 sm:py-16">
      <div className="mb-6 flex items-center justify-between">
        {showHeader ? (
          <SectionTitle
            kicker="Mundial 2026"
            title="Plantillas y goleadores"
            subtitle="Equipos participantes y máximos goleadores del Mundial FIFA 2026."
          />
        ) : (
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/55">Selecciones y goleadores</p>
        )}
        {showSourceBadge && <FootballSourceBadge live={liveSource} />}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal>
          <div className="glass-heavy rounded-3xl border border-white/10 p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Selecciones
            </h3>
            {squadsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-xl bg-white/10" />
                ))}
              </div>
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
              <FootballDataEmpty message="Las plantillas de selecciones estarán disponibles próximamente." />
            )}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="glass-heavy rounded-3xl border border-white/10 p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Goleadores
            </h3>
            {topsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 animate-pulse rounded-lg bg-white/10" />
                ))}
              </div>
            ) : hasTopscorers ? (
              <>
                {topscorers.goals.length > 0 && (
                  <TopscorerList title="Goles" entries={topscorers.goals} />
                )}
                {topscorers.assists.length > 0 && (
                  <TopscorerList
                    title="Asistencias"
                    entries={topscorers.assists}
                    className={topscorers.goals.length > 0 ? "mt-6" : undefined}
                  />
                )}
                {topscorers.cards.length > 0 && (
                  <TopscorerList
                    title="Tarjetas"
                    entries={topscorers.cards}
                    className={
                      topscorers.goals.length > 0 || topscorers.assists.length > 0
                        ? "mt-6"
                        : undefined
                    }
                  />
                )}
              </>
            ) : (
              <FootballDataEmpty message="Las estadísticas de goleadores estarán disponibles próximamente." />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TopscorerList({
  title,
  entries,
  className
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
          <li
            key={`${title}-${e.playerName}-${i}`}
            className="flex justify-between text-sm text-white/80"
          >
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
