"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/motion";
import { useHighlights } from "@/hooks/useHighlights";

function HighlightsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="aspect-square animate-pulse rounded-3xl bg-slate-200" />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-3xl bg-slate-200 sm:h-52" />
    </div>
  );
}

export function MatchSummariesSection() {
  const { items, loading } = useHighlights();
  const topRow = items.slice(0, 3);
  const featured = items.length >= 4 ? items[3] : null;

  return (
    <section id="summaries" className="section-shell pb-16 sm:pb-20">
      {loading ? (
        <HighlightsSkeleton />
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-600">No hay highlights disponibles por el momento.</p>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            {topRow.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.05}>
                <motion.article whileHover={{ y: -6 }} className="group glass-heavy overflow-hidden rounded-3xl">
                  <div className="relative aspect-square">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {item.duration && (
                      <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                        {item.duration}
                      </span>
                    )}
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
                      sizes="(max-width: 640px) 100vw, 40vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-5 sm:p-8">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-blue-800">Resumen extendido</p>
                    <h3 className="mt-2 text-xl font-bold tracking-[-0.02em] text-slate-900 sm:text-2xl">{featured.title}</h3>
                    {featured.duration && (
                      <p className="mt-2 text-sm text-slate-600">Duración: {featured.duration}</p>
                    )}
                  </div>
                </div>
              </motion.article>
            </Reveal>
          )}
        </>
      )}
    </section>
  );
}
