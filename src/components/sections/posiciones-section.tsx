"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FootballDataEmpty } from "@/components/football/football-data-empty";
import { useSquads, useStandings, useTopscorers } from "@/hooks/useFootballData";
import { useTeamSquad } from "@/hooks/useTeamSquad";
import { getSquadsSeed, getStandingsSeed, getTopscorersSeed } from "@/lib/football-widget-seeds";
import type { SquadTeam, StandingsGroup, StandingsRow, TopscorersData } from "@/lib/football-api/types";
import { isWorldCupFirstMatchDayReached } from "@/lib/world-cup-kickoff";
import { useWorldCupNow } from "@/hooks/useWorldCupNow";
import { Reveal } from "@/components/ui/motion";

const MAIN_TABS = [
  { id: "standings", label: "Tablas" },
  { id: "teams", label: "Selecciones" },
  { id: "topscorers", label: "Goleadores" }
] as const;

type MainTab = (typeof MAIN_TABS)[number]["id"];

export function PosicionesSection() {
  const now = useWorldCupNow();
  const tournamentStarted = isWorldCupFirstMatchDayReached(now);
  const [activeTab, setActiveTab] = useState<MainTab>("standings");

  const { data: standings, loading: standingsLoading, source: standingsSource } = useStandings(
    getStandingsSeed()
  );
  const { data: squads, loading: squadsLoading, source: squadsSource } = useSquads(
    getSquadsSeed(),
    { enabled: activeTab === "teams" }
  );
  const { data: topscorers, loading: topsLoading, source: topsSource } = useTopscorers(
    getTopscorersSeed()
  );

  const groups = standings.groups ?? [];
  const teams = useMemo(() => squads.filter((t) => !t.placeholder).sort((a, b) => a.name.localeCompare(b.name)), [squads]);
  const hasTopscorers =
    topscorers.goals.length > 0 || topscorers.assists.length > 0 || topscorers.cards.length > 0;

  const visibleTabs = useMemo(
    () => MAIN_TABS.filter((tab) => tab.id !== "topscorers" || hasTopscorers),
    [hasTopscorers]
  );

  const isLoading =
    activeTab === "standings"
      ? standingsLoading
      : activeTab === "teams"
        ? squadsLoading
        : topsLoading;

  const liveSource =
    standingsSource === "live" || squadsSource === "live" || topsSource === "live";
  const showSourceBadge =
    !isLoading &&
    ((activeTab === "standings" && groups.length > 0) ||
      (activeTab === "teams" && teams.length > 0) ||
      (activeTab === "topscorers" && hasTopscorers));

  return (
    <section id="posiciones" className="section-shell py-14 sm:py-20">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
                activeTab === tab.id
                  ? "bg-electric text-midnight"
                  : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {showSourceBadge && (
          <span
            className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${
              liveSource ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/50"
            }`}
          >
            {liveSource ? "Datos en vivo" : "Demo"}
          </span>
        )}
      </div>

      {activeTab === "standings" && (
        <StandingsTab
          groups={groups}
          loading={standingsLoading}
          tournamentStarted={tournamentStarted}
        />
      )}
      {activeTab === "teams" && <TeamsTab teams={teams} loading={squadsLoading} />}
      {activeTab === "topscorers" && hasTopscorers && (
        <TopscorersTab data={topscorers} loading={topsLoading} />
      )}
    </section>
  );
}

function StandingsTab({
  groups,
  loading,
  tournamentStarted
}: {
  groups: StandingsGroup[];
  loading: boolean;
  tournamentStarted: boolean;
}) {
  const [activeGroup, setActiveGroup] = useState(0);
  const current = groups[activeGroup] ?? groups[0];
  const hasData = groups.length > 0;
  const allZeroPts = current?.rows.every((r) => r.pts === 0) ?? true;

  if (loading) {
    return <div className="glass-heavy h-72 animate-pulse rounded-3xl" />;
  }

  if (!hasData) {
    return (
      <FootballDataEmpty message="Las tablas de posiciones estarán disponibles próximamente." />
    );
  }

  return (
    <Reveal key="standings-content">
      {!tournamentStarted && allZeroPts && (
        <p className="mb-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
          Clasificación inicial del Mundial 2026. Las tablas se actualizarán cuando comience la fase
          de grupos.
        </p>
      )}

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {groups.map((g, i) => (
          <button
            key={g.group}
            type="button"
            onClick={() => setActiveGroup(i)}
            className={`shrink-0 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
              activeGroup === i
                ? "bg-electric text-midnight"
                : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
            }`}
          >
            {g.group}
          </button>
        ))}
      </div>

      <div className="glass-heavy overflow-hidden rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/55">{current?.group}</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-300/80">
            Top 2 clasifican
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-white/10 text-[10px] uppercase tracking-[0.16em] text-white/45">
              <tr>
                <th className="px-5 py-3 font-medium">Equipo</th>
                <th className="px-2 py-3 text-center font-medium">PJ</th>
                <th className="px-2 py-3 text-center font-medium">G</th>
                <th className="px-2 py-3 text-center font-medium">E</th>
                <th className="px-2 py-3 text-center font-medium">P</th>
                <th className="px-2 py-3 text-center font-medium">DG</th>
                <th className="px-4 py-3 text-center font-medium">Pts</th>
              </tr>
            </thead>
            <tbody>
              {(current?.rows ?? []).map((row, index) => (
                <StandingsRowItem key={`${current?.group}-${row.team}`} row={row} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Reveal>
  );
}

function StandingsRowItem({ row, index }: { row: StandingsRow; index: number }) {
  const qualifies = index < 2 && !row.isPlaceholder;

  return (
    <tr
      className={`border-b border-white/5 text-white last:border-b-0 ${
        qualifies ? "bg-emerald-500/[0.07]" : ""
      }`}
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="w-5 shrink-0 text-center text-xs tabular-nums text-white/35">
            {row.position || index + 1}
          </span>
          <TeamFlag flagUrl={row.flagUrl} code={row.shortCode} />
          <span className="font-semibold">
            {row.team}
            {row.isPlaceholder && (
              <span className="ml-2 text-[10px] font-normal uppercase tracking-[0.14em] text-amber-200/70">
                TBD
              </span>
            )}
          </span>
        </div>
      </td>
      <td className="px-2 py-3.5 text-center tabular-nums text-white/72">{row.played}</td>
      <td className="px-2 py-3.5 text-center tabular-nums text-white/72">{row.won}</td>
      <td className="px-2 py-3.5 text-center tabular-nums text-white/72">{row.drawn}</td>
      <td className="px-2 py-3.5 text-center tabular-nums text-white/72">{row.lost}</td>
      <td className="px-2 py-3.5 text-center tabular-nums text-white/72">{row.gd}</td>
      <td className="px-4 py-3.5 text-center text-base font-semibold tabular-nums text-gold">
        {row.pts}
      </td>
    </tr>
  );
}

function TeamsTab({ teams, loading }: { teams: SquadTeam[]; loading: boolean }) {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teams;
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortCode?.toLowerCase().includes(q)
    );
  }, [query, teams]);

  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-heavy h-20 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <FootballDataEmpty message="Las selecciones participantes estarán disponibles próximamente." />
    );
  }

  return (
    <Reveal key="teams-content">
      <div className="mb-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar selección…"
          className="w-full max-w-md rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-electric/50 focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <FootballDataEmpty message="No encontramos selecciones con ese nombre." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              expanded={expandedId === team.id}
              onToggle={() => setExpandedId(expandedId === team.id ? null : team.id)}
            />
          ))}
        </div>
      )}
    </Reveal>
  );
}

function TeamCard({
  team,
  expanded,
  onToggle
}: {
  team: SquadTeam;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { players, loading, error } = useTeamSquad(team.id, expanded);

  return (
    <motion.article
      layout
      className="glass-heavy overflow-hidden rounded-2xl border border-white/10"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-white/5"
      >
        <TeamFlag flagUrl={team.flagUrl} code={team.shortCode} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white">{team.name}</p>
          {team.shortCode && (
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">{team.shortCode}</p>
          )}
        </div>
        <span className="shrink-0 text-xs text-white/40">{expanded ? "▲" : "Plantilla"}</span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 px-4 py-3"
          >
            {loading ? (
              <div className="space-y-2 py-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-white/10" />
                ))}
              </div>
            ) : error ? (
              <p className="py-2 text-sm text-amber-200/80">No pudimos cargar la plantilla.</p>
            ) : players.length === 0 ? (
              <p className="py-2 text-sm text-white/45">Plantilla no disponible.</p>
            ) : (
              <ul>
                {players.slice(0, 26).map((player) => (
                  <li
                    key={player.id}
                    className="flex items-center justify-between gap-3 py-1.5 text-sm text-white/65"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {player.jerseyNumber != null && (
                        <span className="w-6 shrink-0 text-right text-xs tabular-nums text-white/35">
                          {player.jerseyNumber}
                        </span>
                      )}
                      <span className="truncate">{player.name}</span>
                    </div>
                    {player.position && (
                      <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-white/40">
                        {player.position}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function TopscorersTab({ data, loading }: { data: TopscorersData; loading: boolean }) {
  const [metric, setMetric] = useState<"goals" | "assists" | "cards">("goals");

  const entries = data[metric];
  const metrics = (
    [
      { id: "goals" as const, label: "Goles", count: data.goals.length },
      { id: "assists" as const, label: "Asistencias", count: data.assists.length },
      { id: "cards" as const, label: "Tarjetas", count: data.cards.length }
    ] as const
  ).filter((m) => m.count > 0);

  if (loading) {
    return <div className="glass-heavy h-64 animate-pulse rounded-3xl" />;
  }

  return (
    <Reveal key="topscorers-content">
      {metrics.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {metrics.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMetric(m.id)}
              className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] ${
                metric === m.id
                  ? "bg-white/15 text-white"
                  : "border border-white/15 text-white/50 hover:text-white/80"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      <div className="glass-heavy rounded-3xl p-5 sm:p-6">
        <ol className="space-y-3">
          {entries.slice(0, 10).map((entry, i) => (
            <li
              key={`${metric}-${entry.playerName}-${i}`}
              className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/60">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{entry.playerName}</p>
                  {entry.teamName && (
                    <p className="truncate text-xs text-white/45">{entry.teamName}</p>
                  )}
                </div>
              </div>
              <span className="shrink-0 text-lg font-semibold tabular-nums text-gold">{entry.value}</span>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}

function TeamFlag({
  flagUrl,
  code,
  size = "md"
}: {
  flagUrl?: string;
  code?: string;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "h-9 w-9 text-xs" : "h-7 w-7 text-[10px]";

  if (flagUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={flagUrl} alt="" className={`${dim} shrink-0 rounded-full object-cover`} />
    );
  }

  return (
    <span
      className={`flex ${dim} shrink-0 items-center justify-center rounded-full bg-white/10 font-semibold uppercase text-white/40`}
    >
      {code?.slice(0, 3) ?? "?"}
    </span>
  );
}
