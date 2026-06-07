"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FootballDataEmpty } from "@/components/football/football-data-empty";
import { FootballSourceBadge } from "@/components/football/football-source-badge";
import { useFixtures } from "@/hooks/useFootballData";
import {
  countFixturesByTab,
  filterFixturesByDate,
  filterFixturesByTab,
  formatFixtureDateLabel,
  getDefaultFixtureTab,
  getFixtureDateOptions,
  getFixtureDisplayStageLabel,
  getVisibleFixtureTabs,
  sortFixturesByKickoff,
  type FixtureTab
} from "@/lib/football-api/fixture-filters";
import { FIXTURE_STAGE_LABELS } from "@/lib/football-api/formatters";
import { getFixturesSeed } from "@/lib/football-widget-seeds";
import { useWorldCupNow } from "@/hooks/useWorldCupNow";
import type { Fixture } from "@/lib/football-api/types";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";
import { ListPagination } from "@/components/ui/list-pagination";

export const FIXTURES_PER_PAGE = 9;

export function FixturesSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<FixtureTab>("Group Stage");
  const [hasInitializedTab, setHasInitializedTab] = useState(false);
  const now = useWorldCupNow();
  const { data, loading, source } = useFixtures(getFixturesSeed());

  const selectedDate = searchParams.get("fecha");
  const rawPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const tabCounts = useMemo(() => countFixturesByTab(data), [data]);
  const visibleTabs = useMemo(() => getVisibleFixtureTabs(tabCounts, now), [tabCounts, now]);
  const dateOptions = useMemo(() => getFixtureDateOptions(data), [data]);

  useEffect(() => {
    if (loading || hasInitializedTab) return;
    setActiveTab(getDefaultFixtureTab(tabCounts, now));
    setHasInitializedTab(true);
  }, [loading, tabCounts, hasInitializedTab, now]);

  useEffect(() => {
    if (loading || visibleTabs.includes(activeTab)) return;
    setActiveTab(getDefaultFixtureTab(tabCounts, now));
  }, [activeTab, loading, tabCounts, now, visibleTabs]);

  const filtered = useMemo(() => {
    const byTab = filterFixturesByTab(data, activeTab);
    const byDate = filterFixturesByDate(byTab, selectedDate);
    return sortFixturesByKickoff(byDate);
  }, [activeTab, data, selectedDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / FIXTURES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageFixtures = useMemo(() => {
    const start = (safePage - 1) * FIXTURES_PER_PAGE;
    return filtered.slice(start, start + FIXTURES_PER_PAGE);
  }, [filtered, safePage]);

  const paginationQueryPrefix = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedDate) params.set("fecha", selectedDate);
    const query = params.toString();
    return query ? `?${query}&` : "?";
  }, [selectedDate]);

  const hasData = data.length > 0;
  const showSourceBadge = hasData && !loading;

  const updateQuery = (nextDate: string | null, nextPage = 1) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextDate) {
      params.set("fecha", nextDate);
    } else {
      params.delete("fecha");
    }
    if (nextPage > 1) {
      params.set("page", String(nextPage));
    } else {
      params.delete("page");
    }
    const query = params.toString();
    router.push(query ? `?${query}` : "?", { scroll: false });
  };

  return (
    <section id="fixtures" className="section-shell py-14 sm:py-20">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          kicker="Mundial 2026"
          title="Calendario FIFA World Cup"
          subtitle="Partidos del Mundial FIFA World Cup 2026."
        />
        {showSourceBadge && <FootballSourceBadge live={source === "live"} />}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="flex min-w-[min(100%,16rem)] flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">Filtrar por fecha</span>
          <select
            value={selectedDate ?? ""}
            onChange={(event) => updateQuery(event.target.value || null, 1)}
            className="fixture-date-select rounded-2xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-electric/50 focus:ring-2 focus:ring-electric/25"
          >
            <option value="">Todas las fechas</option>
            {dateOptions.map((dateKey) => (
              <option key={dateKey} value={dateKey}>
                {formatFixtureDateLabel(dateKey)}
              </option>
            ))}
          </select>
        </label>
        {selectedDate && (
          <p className="text-xs text-white/50 sm:self-end">
            {filtered.length} partido{filtered.length === 1 ? "" : "s"} en {formatFixtureDateLabel(selectedDate)}
          </p>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                updateQuery(selectedDate, 1);
              }}
              className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
                isActive
                  ? "bg-electric text-midnight"
                  : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {FIXTURE_STAGE_LABELS[tab]}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: FIXTURES_PER_PAGE }).map((_, i) => (
            <div key={i} className="glass-heavy h-48 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : !hasData ? (
        <FootballDataEmpty message="El calendario del Mundial estará disponible próximamente." />
      ) : filtered.length === 0 ? (
        <FootballDataEmpty
          message={
            selectedDate
              ? `No hay partidos para ${formatFixtureDateLabel(selectedDate)} en esta categoría.`
              : "No hay partidos en esta categoría por ahora."
          }
        />
      ) : (
        <>
          <Reveal key={`fixtures-${activeTab}-${selectedDate ?? "all"}-${safePage}`}>
            <div className="grid gap-4 lg:grid-cols-3">
              {pageFixtures.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          </Reveal>
          <ListPagination
            currentPage={safePage}
            totalPages={totalPages}
            queryPrefix={paginationQueryPrefix}
          />
        </>
      )}
    </section>
  );
}

function FixtureCard({ fixture }: { fixture: Fixture }) {
  const meta = [fixture.groupLabel, fixture.roundLabel, fixture.matchLabel].filter(Boolean).join(" · ");

  return (
    <motion.article whileHover={{ y: -6 }} className="glass-heavy rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[11px] uppercase tracking-[0.22em] text-white/55">
            {getFixtureDisplayStageLabel(fixture)}
          </span>
          {meta && <p className="mt-1 truncate text-xs text-white/45">{meta}</p>}
        </div>
        {fixture.live ? (
          <span className="shrink-0 rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
            En vivo
          </span>
        ) : fixture.isPlaceholder ? (
          <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-200">
            Por definir
          </span>
        ) : (
          <span className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/55">
            Próximo
          </span>
        )}
      </div>
      <div className="mt-7 space-y-4">
        <TeamRow
          name={fixture.home}
          flagUrl={fixture.homeFlagUrl}
          placeholder={fixture.homePlaceholder}
          score={fixture.homeScore}
        />
        <p className="text-sm uppercase tracking-[0.22em] text-white/40">VS</p>
        <TeamRow
          name={fixture.away}
          flagUrl={fixture.awayFlagUrl}
          placeholder={fixture.awayPlaceholder}
          score={fixture.awayScore}
        />
      </div>
      <div className="mt-8 space-y-1 border-t border-white/10 pt-4">
        <p className="text-sm text-white/72">{fixture.kickoffLabel}</p>
        {fixture.venue && fixture.venue !== "Por confirmar" && (
          <p className="text-xs text-white/45">{fixture.venue}</p>
        )}
      </div>
    </motion.article>
  );
}

function TeamRow({
  name,
  flagUrl,
  placeholder,
  score
}: {
  name: string;
  flagUrl?: string;
  placeholder?: boolean;
  score?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {flagUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={flagUrl} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/40">
            ?
          </span>
        )}
        <p className="truncate text-xl font-semibold tracking-[-0.01em] text-white sm:text-2xl">
          {name}
          {placeholder && <span className="ml-2 text-xs font-normal text-white/40">TBD</span>}
        </p>
      </div>
      {score != null && <span className="text-2xl font-semibold text-gold">{score}</span>}
    </div>
  );
}
