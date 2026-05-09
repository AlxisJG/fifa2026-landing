"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";

export function SocialSection() {
  return (
    <section className="section-shell py-14 sm:py-20">
      <SectionTitle kicker="Momentum" title="Live social pulse" subtitle="Modulo listo para feed en tiempo real, reacciones y encuestas de engagement." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <motion.div whileHover={{ y: -4 }} className="glass-heavy rounded-3xl p-6">Twitter/X live feed placeholder</motion.div>
        </Reveal>
        <Reveal delay={0.08}>
          <motion.div whileHover={{ y: -4 }} className="glass-heavy rounded-3xl p-6">Poll + fan reactions + trending moments placeholder</motion.div>
        </Reveal>
      </div>
    </section>
  );
}
