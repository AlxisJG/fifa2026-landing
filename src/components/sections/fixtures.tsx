"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";
import { fixtures } from "@/data/landing-content";

export function FixturesSection() {
  return (
    <section className="section-shell py-14 sm:py-20">
      <SectionTitle kicker="Fixtures" title="Partidos y horarios" subtitle="Cards con lectura instantanea, badges de estado y jerarquia visual tipo broadcast." />
      <div className="grid gap-4 lg:grid-cols-3">
        {fixtures.map((m, index) => (
          <Reveal key={m.id} delay={index * 0.05}>
            <motion.article whileHover={{ y: -6 }} className="glass-heavy rounded-3xl p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.22em] text-white/55">{m.venue}</span>
                {m.live ? (
                  <span className="rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">Live now</span>
                ) : (
                  <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/55">Upcoming</span>
                )}
              </div>
              <div className="mt-7 space-y-3">
                <p className="text-2xl font-semibold tracking-[-0.01em]">{m.home} <span className="text-sm text-white/45">{m.homeFlag}</span></p>
                <p className="text-sm uppercase tracking-[0.22em] text-white/40">VS</p>
                <p className="text-2xl font-semibold tracking-[-0.01em]">{m.away} <span className="text-sm text-white/45">{m.awayFlag}</span></p>
              </div>
              <div className="mt-8 border-t border-white/10 pt-4">
                <p className="text-sm text-white/72">Kickoff: {new Date(m.kickoff).toLocaleString()}</p>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
