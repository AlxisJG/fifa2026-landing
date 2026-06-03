"use client";

import { motion } from "framer-motion";
import { fadeInMotionProps } from "@/components/ui/motion";
import { sponsors } from "@/data/landing-content";
import { SectionTitle } from "@/components/ui/section-title";

export function SponsorGrid() {
  return (
    <section className="section-shell py-14 sm:py-20">
      <SectionTitle kicker="Partners" title="Platinum, Gold & Official Partners" subtitle="Wall de patrocinadores con jerarquia premium y efectos de profundidad controlados." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sponsors.map((s, index) => (
          <motion.a
            key={`${s.name}-${s.tier}`}
            href="#"
            {...fadeInMotionProps(index * 0.04, 12)}
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass-heavy group relative block min-h-[154px] w-full overflow-hidden rounded-3xl p-6 sm:min-h-[168px] sm:p-7"
          >
              <div className="absolute inset-0 bg-gradient-to-br from-electric/10 via-transparent to-gold/10 opacity-0 transition group-hover:opacity-100" />
              <div className="relative flex h-full flex-col justify-between">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">{s.tier}</p>
                <p className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-white">{s.name}</p>
              </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
