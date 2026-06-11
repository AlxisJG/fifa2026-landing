"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SectionTitle } from "@/components/ui/section-title";
import { fadeInMotionProps } from "@/components/ui/motion";

import { WORLD_CUP_KICKOFF_MS } from "@/lib/world-cup-kickoff";

const OPENING_MATCH = WORLD_CUP_KICKOFF_MS;

export function CountdownSection() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = useMemo(() => {
    const diff = Math.max(OPENING_MATCH - now, 0);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  }, [now]);

  return (
    <section className="section-shell py-14 sm:py-20">
      <SectionTitle kicker="Countdown" title="Road to the Opening Match" subtitle="Una cuenta regresiva cinematica con tension visual para potenciar expectacion pre-stream." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {Object.entries(parts).map(([k, v], index) => (
          <motion.div
            key={k}
            {...fadeInMotionProps(index * 0.05, 12)}
            className="glass-heavy relative overflow-hidden rounded-2xl p-5 text-center sm:p-7"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/80 to-transparent" />
            <p className="text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">{v.toString().padStart(2, "0")}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-white/55">{k}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
