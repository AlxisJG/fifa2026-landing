"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/motion";
import { scrollToSection } from "@/lib/scroll-to-section";

const HERO_IMAGE = "/recursos/HEADER.jpg";
/** Proporción real de HEADER.jpg (1561×1000) para evitar recorte con object-cover */
const HERO_ASPECT = "1561 / 1000";

export function Hero() {
  return (
    <section
      id="hero"
      className="theater-dark relative overflow-hidden pt-[calc(env(safe-area-inset-top,0px)+4.5rem+20px)] sm:pt-[calc(env(safe-area-inset-top,0px)+4.75rem+20px)]"
    >
      <div className="section-shell relative w-full">
        <div
          className="relative w-full overflow-hidden rounded-b-3xl border border-white/15"
          style={{ aspectRatio: HERO_ASPECT }}
        >
          <Image
            src={HERO_IMAGE}
            alt="FIFA World Cup 2026"
            fill
            priority
            sizes="(max-width: 1240px) 100vw, 1240px"
            className="object-contain object-center"
          />

          <div className="absolute inset-0 z-10 flex flex-col px-5 py-6 sm:px-8 sm:py-8">
            <Reveal
              delay={0.1}
              className="mt-auto flex w-full flex-col items-center justify-center gap-3 pb-[30px] sm:flex-row sm:flex-wrap"
            >
              <button
                type="button"
                onClick={() => scrollToSection("live")}
                className="min-h-12 rounded-full bg-electric px-7 py-3 text-sm font-semibold text-midnight transition hover:brightness-110"
              >
                Ver en vivo
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("fixtures")}
                className="min-h-12 rounded-full border border-slate-300 bg-white/80 px-7 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white"
              >
                Calendario de partidos
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("summaries")}
                className="min-h-12 rounded-full border border-slate-300 bg-white/80 px-7 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white"
              >
                Highlights
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
