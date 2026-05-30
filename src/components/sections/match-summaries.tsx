"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";
import { matchSummaries } from "@/data/landing-content";

export function MatchSummariesSection() {
  const topRow = matchSummaries.slice(0, 3);
  const featured = matchSummaries[3];

  return (
    <section id="summaries" className="section-shell py-14 sm:py-20">
      <SectionTitle
        kicker="Destacados"
        as="h3"
        title="Resúmenes de los partidos"
        subtitle="Lo mejor de cada encuentro en formato corto para retención y compartir."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {topRow.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.05}>
            <motion.article whileHover={{ y: -6 }} className="group glass-heavy overflow-hidden rounded-3xl">
              <div className="relative aspect-square">
                <Image src={item.image} alt={item.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  {item.duration}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm font-semibold leading-snug text-white">{item.title}</p>
                </div>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>

      {featured && (
        <Reveal delay={0.12} className="mt-4">
          <motion.article whileHover={{ y: -4 }} className="group glass-heavy overflow-hidden rounded-3xl">
            <div className="relative flex min-h-[180px] flex-col sm:min-h-[200px] sm:flex-row">
              <div className="relative h-48 w-full sm:h-auto sm:w-2/5">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-5 sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-blue-800">Resumen extendido</p>
                <h3 className="mt-2 text-xl font-bold tracking-[-0.02em] text-slate-900 sm:text-2xl">{featured.title}</h3>
                <p className="mt-2 text-sm text-slate-600">Duración: {featured.duration}</p>
              </div>
            </div>
          </motion.article>
        </Reveal>
      )}
    </section>
  );
}
