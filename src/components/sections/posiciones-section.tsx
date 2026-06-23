"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FootballDataEmpty } from "@/components/football/football-data-empty";
import { FootballSourceBadge } from "@/components/football/football-source-badge";
import { BrowserTabShell } from "@/components/ui/browser-tab-shell";
import { useSquads, useStandings, useTopscorers } from "@/hooks/useFootballData";
import { normalizeTopscorersData } from "@/lib/football-api/topscorers";
import { useTeamSquad } from "@/hooks/useTeamSquad";
import { getSquadsSeed, getStandingsSeed, getTopscorersSeed } from "@/lib/football-widget-seeds";
import type {
  SquadTeam,
  StandingsData,
  StandingsGroup,
  StandingsRow,
  TopscorersData
} from "@/lib/football-api/types";
import { Reveal } from "@/components/ui/motion";

const MAIN_TABS = [
  { id: "standings", label: "Tablas" },
  { id: "teams", label: "Selecciones" },
  { id: "topscorers", label: "Goleadores" }
] as const;

type MainTab = (typeof MAIN_TABS)[number]["id"];

const TOPSCORER_METRICS = [
  {
    id: "goals",
    label: "Goles",
    totalLabel: "Goles",
    valueLabel: "goles",
    description: "Jugadores con más goles anotados."
  },
  {
    id: "assists",
    label: "Asistencias",
    totalLabel: "Asist.",
    valueLabel: "asistencias",
    description: "Jugadores con más asistencias registradas."
  },
  {
    id: "yellowCards",
    label: "Amarillas",
    totalLabel: "TA",
    valueLabel: "amarillas",
    description: "Jugadores con más tarjetas amarillas."
  },
  {
    id: "redCards",
    label: "Rojas",
    totalLabel: "TR",
    valueLabel: "rojas",
    description: "Jugadores con más tarjetas rojas."
  },
  {
    id: "cards",
    label: "Tarjetas",
    totalLabel: "Tarj.",
    valueLabel: "tarjetas",
    description: "Tarjetas agregadas cuando SportMonks no separa el tipo."
  }
] as const;

type TopscorerMetricId = (typeof TOPSCORER_METRICS)[number]["id"];

const TOPSCORERS_PAGE_SIZE = 12;

type PosicionesSectionProps = {
  initialStandings?: StandingsData;
  initialStandingsSource?: "live" | "demo";
  initialSquads?: SquadTeam[];
  initialSquadsSource?: "live" | "demo";
  initialTopscorers?: TopscorersData;
  initialTopscorersSource?: "live" | "demo";
};

export function PosicionesSection({
  initialStandings,
  initialStandingsSource,
  initialSquads,
  initialSquadsSource,
  initialTopscorers,
  initialTopscorersSource
}: PosicionesSectionProps = {}) {
  const [activeTab, setActiveTab] = useState<MainTab>("standings");

  const { data: standings, loading: standingsLoading, source: standingsSource } = useStandings(
    initialStandings ?? getStandingsSeed(),
    { initialSource: initialStandingsSource }
  );
  const { data: squads, loading: squadsLoading, source: squadsSource } = useSquads(
    initialSquads ?? getSquadsSeed(),
    { initialSource: initialSquadsSource, enabled: activeTab === "teams" }
  );
  const { data: topscorers, loading: topsLoading, source: topsSource } = useTopscorers(
    initialTopscorers ?? getTopscorersSeed(),
    { initialSource: initialTopscorersSource, enabled: activeTab === "topscorers" }
  );

  const groups = standings.groups ?? [];
  const teams = useMemo(() => squads.filter((t) => !t.placeholder).sort((a, b) => a.name.localeCompare(b.name)), [squads]);
  const topStats = normalizeTopscorersData(topscorers);
  const hasTopscorers =
    topStats.goals.length > 0 ||
    topStats.assists.length > 0 ||
    topStats.yellowCards.length > 0 ||
    topStats.redCards.length > 0 ||
    topStats.cards.length > 0;

  const visibleTabs = MAIN_TABS;

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
      <BrowserTabShell
        tabs={[...visibleTabs]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as MainTab)}
        badge={
          showSourceBadge ? (
            <FootballSourceBadge live={liveSource} demoOnLight />
          ) : undefined
        }
      >
        {activeTab === "standings" && (
          <StandingsTab groups={groups} loading={standingsLoading} />
        )}
        {activeTab === "teams" && <TeamsTab teams={teams} loading={squadsLoading} />}
        {activeTab === "topscorers" && (
          <TopscorersTab data={topStats} loading={topsLoading} />
        )}
      </BrowserTabShell>
    </section>
  );
}

function StandingsTab({ groups, loading }: { groups: StandingsGroup[]; loading: boolean }) {
  const [activeGroup, setActiveGroup] = useState(0);
  const current = groups[activeGroup] ?? groups[0];
  const hasData = groups.length > 0;

  if (loading) {
    return <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />;
  }

  if (!hasData) {
    return (
      <FootballDataEmpty
        variant="light"
        message="Las tablas de posiciones estarán disponibles próximamente."
      />
    );
  }

  return (
    <Reveal key="standings-content">
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {groups.map((g, i) => (
          <button
            key={g.group}
            type="button"
            onClick={() => setActiveGroup(i)}
            className={`shrink-0 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
              activeGroup === i
                ? "bg-electric text-midnight"
                : "border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            {g.group}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/50">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 px-5 py-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{current?.group}</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-700/80">
            Top 2 clasifican
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200/80 text-[10px] uppercase tracking-[0.16em] text-slate-400">
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
      className={`border-b border-slate-100 text-slate-900 last:border-b-0 ${
        qualifies ? "bg-emerald-500/[0.07]" : ""
      }`}
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="w-5 shrink-0 text-center text-xs tabular-nums text-slate-400">
            {row.position || index + 1}
          </span>
          <TeamFlag flagUrl={row.flagUrl} code={row.shortCode} />
          <span className="font-semibold">
            {row.team}
            {row.isPlaceholder && (
              <span className="ml-2 text-[10px] font-normal uppercase tracking-[0.14em] text-amber-600/80">
                TBD
              </span>
            )}
          </span>
        </div>
      </td>
      <td className="px-2 py-3.5 text-center tabular-nums text-slate-600">{row.played}</td>
      <td className="px-2 py-3.5 text-center tabular-nums text-slate-600">{row.won}</td>
      <td className="px-2 py-3.5 text-center tabular-nums text-slate-600">{row.drawn}</td>
      <td className="px-2 py-3.5 text-center tabular-nums text-slate-600">{row.lost}</td>
      <td className="px-2 py-3.5 text-center tabular-nums text-slate-600">{row.gd}</td>
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
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <FootballDataEmpty
        variant="light"
        message="Las selecciones participantes estarán disponibles próximamente."
      />
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
          className="w-full max-w-md rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-electric/50 focus:outline-none focus:ring-2 focus:ring-electric/20"
        />
      </div>

      {filtered.length === 0 ? (
        <FootballDataEmpty variant="light" message="No encontramos selecciones con ese nombre." />
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
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/60"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-100/80"
      >
        <TeamFlag flagUrl={team.flagUrl} code={team.shortCode} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900">{team.name}</p>
          {team.shortCode && (
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{team.shortCode}</p>
          )}
        </div>
        <span className="shrink-0 text-xs text-slate-400">{expanded ? "▲" : "Plantilla"}</span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200/80 px-4 py-3"
          >
            {loading ? (
              <div className="space-y-2 py-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-slate-200/70" />
                ))}
              </div>
            ) : error ? (
              <p className="py-2 text-sm text-amber-700/90">No pudimos cargar la plantilla.</p>
            ) : players.length === 0 ? (
              <p className="py-2 text-sm text-slate-400">Plantilla no disponible.</p>
            ) : (
              <ul>
                {players.slice(0, 26).map((player) => (
                  <li
                    key={player.id}
                    className="flex items-center justify-between gap-3 py-1.5 text-sm text-slate-600"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {player.jerseyNumber != null && (
                        <span className="w-6 shrink-0 text-right text-xs tabular-nums text-slate-400">
                          {player.jerseyNumber}
                        </span>
                      )}
                      <span className="truncate">{player.name}</span>
                    </div>
                    {player.position && (
                      <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-slate-400">
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
  const metrics = TOPSCORER_METRICS.map((m) => ({
    ...m,
    count: data[m.id].length
  })).filter((m) => m.count > 0);

  const [metric, setMetric] = useState<TopscorerMetricId>("goals");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const activeMetric = metrics.find((m) => m.id === metric) ?? metrics[0] ?? TOPSCORER_METRICS[0];
  const entries = data[activeMetric.id];
  const teamOptions = useMemo(() => {
    const map = new Map<string, { value: string; label: string; count: number }>();
    for (const entry of entries) {
      const label = entry.teamName ?? "No disponible";
      const value = entry.teamId != null ? String(entry.teamId) : label;
      const current = map.get(value);
      map.set(value, {
        value,
        label,
        count: (current?.count ?? 0) + 1
      });
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (selectedTeam === "all") return entries;
    return entries.filter((entry) => {
      const value = entry.teamId != null ? String(entry.teamId) : (entry.teamName ?? "No disponible");
      return value === selectedTeam;
    });
  }, [entries, selectedTeam]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / TOPSCORERS_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageEntries = useMemo(() => {
    const start = (safePage - 1) * TOPSCORERS_PAGE_SIZE;
    return filteredEntries.slice(start, start + TOPSCORERS_PAGE_SIZE);
  }, [filteredEntries, safePage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeMetric.id, selectedTeam]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (selectedTeam === "all") return;
    if (!teamOptions.some((team) => team.value === selectedTeam)) {
      setSelectedTeam("all");
    }
  }, [selectedTeam, teamOptions]);

  if (loading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />;
  }

  if (metrics.length === 0) {
    return (
      <FootballDataEmpty
        variant="light"
        message="Las estadísticas de goleadores estarán disponibles próximamente."
      />
    );
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
              className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                activeMetric.id === m.id
                  ? "topscorers-metric-active"
                  : "border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Ranking por {activeMetric.label.toLowerCase()}
            </p>
            <p className="mt-1 text-sm text-slate-600">{activeMetric.description}</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {filteredEntries.length} resultados
          </span>
        </div>

        <div className="mb-4 flex flex-col gap-2 sm:max-w-xs">
          <label htmlFor="topscorers-team-filter" className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Filtrar por selección
          </label>
          <select
            id="topscorers-team-filter"
            value={selectedTeam}
            onChange={(event) => setSelectedTeam(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-electric/50 focus:outline-none focus:ring-2 focus:ring-electric/20"
          >
            <option value="all">Todas las selecciones</option>
            {teamOptions.map((team) => (
              <option key={team.value} value={team.value}>
                {team.label} ({team.count})
              </option>
            ))}
          </select>
        </div>

        {pageEntries.length === 0 ? (
          <FootballDataEmpty
            variant="light"
            message="No hay jugadores de esa selección para esta estadística."
          />
        ) : (
          <>
            <ol className="space-y-3">
              {pageEntries.map((entry, i) => {
                const rank = (safePage - 1) * TOPSCORERS_PAGE_SIZE + i + 1;
                return (
                  <li
                    key={`${activeMetric.id}-${entry.playerName}-${entry.teamId ?? entry.teamName ?? "team"}-${rank}`}
                    className="grid gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[1fr_auto]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-xs font-semibold text-slate-600">
                        {rank}
                      </span>
                      <TeamFlag flagUrl={entry.teamFlagUrl} code={entry.teamCode ?? entry.teamName} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">{entry.playerName}</p>
                        <p className="truncate text-xs text-slate-500">
                          Selección: {entry.teamName ?? "No disponible"}
                        </p>
                        {activeMetric.id === "cards" && entry.typeLabel && (
                          <p className="truncate text-[11px] text-slate-400">Tipo: {entry.typeLabel}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between gap-2 sm:block sm:text-right">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        {activeMetric.totalLabel}
                      </span>
                      <p className="text-lg font-semibold tabular-nums text-gold">
                        {entry.value}
                        <span className="ml-1 text-xs font-medium text-slate-400">
                          {activeMetric.valueLabel}
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <TopscorersPagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </Reveal>
  );
}

function getVisibleTopscorerPages(currentPage: number, totalPages: number) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const normalizedStart = Math.max(1, end - 4);
  return Array.from({ length: end - normalizedStart + 1 }, (_, index) => normalizedStart + index);
}

function TopscorersPagination({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = getVisibleTopscorerPages(currentPage, totalPages);
  const buttonBase =
    "inline-flex min-w-10 items-center justify-center rounded-full px-3 py-2 text-sm font-semibold transition";

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación de goleadores">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className={`${buttonBase} border border-slate-300 text-slate-700 hover:bg-white disabled:pointer-events-none disabled:opacity-40`}
      >
        Anterior
      </button>
      {pages[0] > 1 && (
        <>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className={`${buttonBase} border border-slate-300 text-slate-700 hover:bg-white`}
          >
            1
          </button>
          {pages[0] > 2 && <span className="px-1 text-sm text-slate-400">...</span>}
        </>
      )}
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`${buttonBase} ${
            page === currentPage
              ? "bg-electric text-midnight"
              : "border border-slate-300 text-slate-700 hover:bg-white"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 text-sm text-slate-400">...</span>
          )}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className={`${buttonBase} border border-slate-300 text-slate-700 hover:bg-white`}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className={`${buttonBase} border border-slate-300 text-slate-700 hover:bg-white disabled:pointer-events-none disabled:opacity-40`}
      >
        Siguiente
      </button>
    </nav>
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
      <img src={flagUrl} alt={code ? `Bandera de ${code}` : "Bandera del equipo"} className={`${dim} shrink-0 rounded-full object-cover`} />
    );
  }

  return (
    <span
      className={`flex ${dim} shrink-0 items-center justify-center rounded-full bg-slate-200/80 font-semibold uppercase text-slate-500`}
    >
      {code?.slice(0, 3) ?? "?"}
    </span>
  );
}
