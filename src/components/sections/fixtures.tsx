"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fixtures as initialFixtures } from "@/data/worldcup-widgets";
import { useFixtures } from "@/hooks/useFootballData";
import { FIXTURE_STAGE_LABELS } from "@/lib/football-api/formatters";
import type { Fixture } from "@/lib/football-api/types";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";

const tabs = ["Today", "Tomorrow", "Group Stage", "Knockout"] as const;

export function FixturesSection() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Group Stage");
  const { data, loading, source } = useFixtures(initialFixtures);

  const filtered = useMemo(() => {
    const pool = data.length ? data : initialFixtures;
    return pool.filter((f) =>
      activeTab === "Knockout" ? f.stage === "Knockout" : f.stage === activeTab
    );
  }, [activeTab, data]);

  const display = filtered.length ? filtered : data.slice(0, 6);

  return (
    <section id="fixtures" className="section-shell py-14 sm:py-20">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          kicker="Mundial 2026"
          title="Calendario FIFA World Cup"
          subtitle="Partidos del Mundial desde SportMonks: fase de grupos y eliminatorias."
        />
        <span
          className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${source === "live" ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/50"}`}
        >
          {source === "live" ? "Datos en vivo" : "Demo"}
        </span>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
              activeTab === tab
                ? "bg-electric text-midnight"
                : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
            }`}
          >
            {FIXTURE_STAGE_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {(loading ? Array.from({ length: 6 }).map((_, i) => ({ id: `sk-${i}` })) : display).map(
          (m, index) => (
            <Reveal key={"id" in m ? m.id : `sk-${index}`} delay={index * 0.05}>
              {loading ? (
                <div className="glass-heavy h-48 animate-pulse rounded-3xl" />
              ) : (
                <FixtureCard fixture={m as Fixture} />
              )}
            </Reveal>
          )
        )}
      </div>
    </section>
  );
}

function FixtureCard({ fixture }: { fixture: Fixture }) {
  return (
    <motion.article whileHover={{ y: -6 }} className="glass-heavy rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.22em] text-white/55">
          {FIXTURE_STAGE_LABELS[fixture.stage]}
        </span>
        {fixture.live ? (
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
            En vivo
          </span>
        ) : fixture.isPlaceholder ? (
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-200">
            Por definir
          </span>
        ) : (
          <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/55">
            Próximo
          </span>
        )}
      </div>
      <div className="mt-7 space-y-3">
        <p className="text-2xl font-semibold tracking-[-0.01em] text-white">
          {fixture.home}
          {fixture.homePlaceholder && (
            <span className="ml-2 text-xs font-normal text-white/40">TBD</span>
          )}
        </p>
        <p className="text-sm uppercase tracking-[0.22em] text-white/40">VS</p>
        <p className="text-2xl font-semibold tracking-[-0.01em] text-white">
          {fixture.away}
          {fixture.awayPlaceholder && (
            <span className="ml-2 text-xs font-normal text-white/40">TBD</span>
          )}
        </p>
      </div>
      <div className="mt-8 border-t border-white/10 pt-4">
        <p className="text-sm text-white/72">{fixture.kickoffLabel}</p>
      </div>
    </motion.article>
  );
}
