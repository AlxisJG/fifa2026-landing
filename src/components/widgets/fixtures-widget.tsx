"use client";

import { useEffect, useMemo, useState } from "react";
import { FootballSourceBadge } from "@/components/football/football-source-badge";
import { getFixturesSeed } from "@/lib/football-widget-seeds";
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
import { useWorldCupNow } from "@/hooks/useWorldCupNow";
import { SectionTitle } from "@/components/ui/section-title";

export function FixturesWidget() {
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

  return (
    <section className="section-shell py-12 sm:py-16">
      <div className="mb-2 flex items-center justify-between">
        <SectionTitle kicker="Calendario" title="Fixtures Widget" subtitle="Demo visual premium con estructura lista para data API real." />
        <FootballSourceBadge
          live={source === "live"}
          liveLabel="Live data"
          demoLabel="Demo data"
          demoOnLight
        />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {visibleTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] ${
              activeTab === tab
                ? "bg-blue-900 text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            {FIXTURE_STAGE_LABELS[tab]}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {(loading ? Array.from({ length: 4 }).map((_, idx) => ({ id: `s-${idx}` })) : filtered).map((fixture: any) => (
          <article key={fixture.id} className="glass rounded-2xl border border-slate-200 p-4">
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-blue-800">
                    {getFixtureDisplayStageLabel(fixture)}
                  </span>
                  {fixture.live && <span className="rounded-full bg-red-500/15 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-red-600">Live</span>}
                </div>
                <p className="text-sm font-semibold text-slate-900">{fixture.home}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">vs</p>
                <p className="text-sm font-semibold text-slate-900">{fixture.away}</p>
                <p className="mt-3 text-xs text-slate-600">{fixture.kickoffLabel}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">Presented by Sponsor</p>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
