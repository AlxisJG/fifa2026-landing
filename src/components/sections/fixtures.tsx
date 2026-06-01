"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FootballDataEmpty } from "@/components/football/football-data-empty";
import { useFixtures } from "@/hooks/useFootballData";
import {
  countFixturesByTab,
  filterFixturesByTab,
  getDefaultFixtureTab,
  getFixtureDisplayStageLabel,
  getVisibleFixtureTabs,
  type FixtureTab
} from "@/lib/football-api/fixture-filters";
import { FIXTURE_STAGE_LABELS } from "@/lib/football-api/formatters";
import { getFixturesSeed } from "@/lib/football-widget-seeds";
import { useWorldCupNow } from "@/hooks/useWorldCupNow";
import type { Fixture } from "@/lib/football-api/types";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";

export function FixturesSection() {
  const [activeTab, setActiveTab] = useState<FixtureTab>("Group Stage");
  const [hasInitializedTab, setHasInitializedTab] = useState(false);
  const now = useWorldCupNow();
  const { data, loading, source } = useFixtures(getFixturesSeed());

  const tabCounts = useMemo(() => countFixturesByTab(data), [data]);
  const visibleTabs = useMemo(() => getVisibleFixtureTabs(tabCounts, now), [tabCounts, now]);

  useEffect(() => {
    if (loading || hasInitializedTab) return;
    setActiveTab(getDefaultFixtureTab(tabCounts, now));
    setHasInitializedTab(true);
  }, [loading, tabCounts, hasInitializedTab, now]);

  useEffect(() => {
    if (loading || visibleTabs.includes(activeTab)) return;
    setActiveTab(getDefaultFixtureTab(tabCounts, now));
  }, [activeTab, loading, tabCounts, now, visibleTabs]);

  const filtered = useMemo(() => filterFixturesByTab(data, activeTab), [activeTab, data]);
  const hasData = data.length > 0;
  const showSourceBadge = hasData && !loading;

  return (
    <section id="fixtures" className="section-shell py-14 sm:py-20">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          kicker="Mundial 2026"
          title="Calendario FIFA World Cup"
          subtitle="Partidos del Mundial FIFA World Cup 2026."
        />
        {showSourceBadge && (
          <span
            className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${source === "live" ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/50"}`}
          >
            {source === "live" ? "Datos en vivo" : "Demo"}
          </span>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
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
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-heavy h-48 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : !hasData ? (
        <FootballDataEmpty message="El calendario del Mundial estará disponible próximamente." />
      ) : filtered.length === 0 ? (
        <FootballDataEmpty message="No hay partidos en esta categoría por ahora." />
      ) : (
        <Reveal key={`fixtures-${activeTab}`}>
          <div className="grid gap-4 lg:grid-cols-3">
            {filtered.map((m) => (
              <FixtureCard key={m.id} fixture={m} />
            ))}
          </div>
        </Reveal>
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
      <div className="mt-8 border-t border-white/10 pt-4 space-y-1">
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
