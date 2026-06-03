"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/motion";
import { sponsors } from "@/data/landing-content";
import { isSponsorLogosEnabled } from "@/lib/sponsors-gate";

export function SponsorBar() {
  if (!isSponsorLogosEnabled()) return null;

  return (
    <section id="sponsors" className="section-shell py-12 sm:py-16">
      <Reveal>
        <div className="glass-heavy rounded-3xl p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-white/60">
            <span>Logos marcas patrocinadoras</span>
            <span>Broadcast Partner Integration</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {sponsors.map((s) => (
              <motion.a
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                key={s.name}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-5 text-center"
                href="#"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <p className="relative text-sm font-semibold">{s.name}</p>
                <p className="relative mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50">{s.tier}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
