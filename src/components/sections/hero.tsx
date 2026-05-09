"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GlowOrb, Reveal } from "@/components/ui/motion";
import { BRANDING } from "@/lib/branding";

const heroStats = [
  { label: "Live Matches", value: "64" },
  { label: "Studios", value: "3" },
  { label: "Signal", value: "4K HDR" }
];

const heroSlides = [
  "https://images.unsplash.com/photo-1486286701208-1d58e9338013?auto=format&fit=crop&w=2200&q=80",
  "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=2200&q=80",
  "https://images.unsplash.com/photo-1494173853739-c21f58b16055?auto=format&fit=crop&w=2200&q=80",
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=2200&q=80",
  "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=2200&q=80"
];

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((v) => (v + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="theater-dark relative min-h-screen overflow-hidden pt-[calc(env(safe-area-inset-top)+6rem)] sm:pt-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0.2, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.08 }}
          transition={{ duration: 1.3, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={heroSlides[activeSlide]}
            alt="FIFA World Cup cinematic atmosphere"
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,19,44,0.5)_0%,rgba(7,19,44,0.34)_28%,rgba(7,19,44,0.6)_62%,#edf5ff_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/35 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/75 to-transparent sm:w-40" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white/75 to-transparent sm:w-40" />
      <div className="absolute inset-0 bg-stadium" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_88%,rgba(16,45,98,0.75),transparent_56%)]" />
      <GlowOrb className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-electric/20 blur-[120px]" duration={12} />
      <GlowOrb className="absolute right-[-6rem] top-44 h-72 w-72 rounded-full bg-gold/25 blur-[120px]" duration={14} />
      <GlowOrb className="absolute left-[38%] top-[-5rem] h-72 w-72 rounded-full bg-white/10 blur-[130px]" duration={16} />
      <motion.div
        className="absolute inset-x-0 top-[28%] h-56 bg-[linear-gradient(180deg,rgba(125,214,255,0.17),transparent)]"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[-10%] top-[20%] h-[460px] w-[44%] rotate-[-12deg] bg-[linear-gradient(100deg,rgba(124,226,255,0.22),transparent_72%)] blur-2xl"
        animate={{ x: [0, 40, 0], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-12%] top-[16%] h-[440px] w-[42%] rotate-[10deg] bg-[linear-gradient(85deg,rgba(231,190,98,0.18),transparent_74%)] blur-2xl"
        animate={{ x: [0, -32, 0], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="ambient-particles absolute inset-0 opacity-70" />
      </motion.div>

      <div className="section-shell relative flex min-h-[86vh] flex-col justify-center pb-8 pt-4 sm:pt-0">
        <div className="absolute inset-x-0 top-2 z-20 flex justify-center sm:top-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-300/70 bg-white/90 px-4 py-3 backdrop-blur-xl sm:gap-5 sm:px-6">
            <Image
              src={BRANDING.pioLogoCleanA}
              alt="Pio Deportes official logo"
              width={190}
              height={42}
              className="h-7 w-auto object-contain sm:h-8"
            />
            <div className="h-7 w-px bg-slate-300 sm:h-8" />
            <Image
              src={BRANDING.fifaLogoDark}
              alt="FIFA World Cup 2026 official mark"
              width={40}
              height={40}
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            />
          </div>
        </div>
        <Reveal>
          <p className="pt-16 text-[11px] uppercase tracking-[0.28em] text-white/90 [text-shadow:0_2px_8px_rgba(0,0,0,0.45)] sm:pt-14">Pio Deportes | Official Broadcaster DR</p>
          <h1
            className="mt-3 max-w-5xl text-[clamp(2.2rem,9.6vw,5.3rem)] font-semibold leading-[0.96] tracking-[-0.03em] text-white sm:tracking-[-0.04em]"
            style={{ textShadow: "0 8px 30px rgba(0,0,0,0.58), 0 2px 10px rgba(0,0,0,0.5)" }}
          >
            FIFA World Cup 2026
            <span className="mt-3 block text-white">Cinematic <span className="text-[#f2c34c]">Live</span> Broadcasting</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[clamp(0.98rem,3.8vw,1.1rem)] leading-relaxed text-white/90 [text-shadow:0_2px_10px_rgba(0,0,0,0.45)]">
            Una experiencia OTT premium con storytelling editorial, atmosfera de estadio y streaming en vivo protegido para todo el mercado dominicano.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button className="min-h-12 rounded-full bg-electric px-7 py-3 text-sm font-semibold text-midnight transition hover:brightness-110">Watch Live</button>
          <button className="min-h-12 rounded-full border border-slate-300 bg-white/80 px-7 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white">Match Schedule</button>
          <button className="min-h-12 rounded-full border border-slate-300 bg-white/80 px-7 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white">Highlights</button>
        </Reveal>

        <Reveal delay={0.2} className="mt-14 sm:max-w-3xl">
          <div className="flex snap-x gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
          {heroStats.map((item, index) => (
            <motion.div
              key={item.label}
              className="glass relative min-w-[44%] snap-start overflow-hidden rounded-2xl px-5 py-4 sm:min-w-0"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
              <p className="text-xl font-semibold text-slate-900 sm:text-2xl">{item.value}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-blue-800">{item.label}</p>
            </motion.div>
          ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
