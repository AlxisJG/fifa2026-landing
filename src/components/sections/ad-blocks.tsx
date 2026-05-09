"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";

const slots = [
  "Leaderboard 970x250 / 728x90",
  "Companion Unit + In-content Video",
  "Rectangle 300x250 / 336x280",
  "Mobile Sticky Smart Banner"
];

export function AdBlocksSection() {
  return (
    <section className="section-shell py-14 sm:py-20">
      <SectionTitle kicker="Ad Inventory" title="Monetization architecture" subtitle="Zonas premium para direct sales, programmatic y branded experiences sin romper UX." />
      <div className="grid gap-4 lg:grid-cols-12">
        {slots.map((slot, index) => (
          <Reveal
            key={slot}
            delay={index * 0.05}
            className={index === 0 || index === 3 ? "lg:col-span-12" : index === 1 ? "lg:col-span-8" : "lg:col-span-4"}
          >
            <motion.div whileHover={{ y: -4 }} className="glass-heavy rounded-3xl p-6">
              <p className="text-[11px] uppercase tracking-[0.22em] text-electric/85">Ad Slot</p>
              <p className="mt-2 text-base text-white/75">{slot}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
