"use client";

import { useMemo, useState } from "react";
import { fixtures as initialFixtures } from "@/data/worldcup-widgets";
import { useFixtures } from "@/hooks/useFootballData";
import { SectionTitle } from "@/components/ui/section-title";

const tabs = ["Today", "Tomorrow", "Group Stage", "Knockout"] as const;

export function FixturesWidget() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Today");
  const { data, loading, source } = useFixtures(initialFixtures);

  const filtered = useMemo(() => {
    const pool = data.length ? data : initialFixtures;
    return pool.filter((f) => (activeTab === "Knockout" ? f.stage === "Knockout" : f.stage === activeTab));
  }, [activeTab, data]);

  return (
    <section className="section-shell py-12 sm:py-16">
      <div className="mb-2 flex items-center justify-between">
        <SectionTitle kicker="Calendario" title="Fixtures Widget" subtitle="Demo visual premium con estructura lista para data API real." />
        <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${source === "live" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
          {source === "live" ? "Live data" : "Demo data"}
        </span>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] ${activeTab === tab ? "bg-blue-900 text-white" : "border border-slate-300 bg-white text-slate-700"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {(loading ? Array.from({ length: 4 }).map((_, idx) => ({ id: `s-${idx}` })) : (filtered.length ? filtered : data)).map((fixture: any) => (
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
                  <span className="text-[10px] uppercase tracking-[0.2em] text-blue-800">{fixture.stage}</span>
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
