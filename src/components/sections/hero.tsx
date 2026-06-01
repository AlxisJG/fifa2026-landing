"use client";

import Image from "next/image";
import { Archivo_Black } from "next/font/google";
import { Reveal } from "@/components/ui/motion";
import { HeroButtons } from "@/components/sections/hero-buttons";

const HERO_IMAGE = "/recursos/HEADER(hero).jpg";
const HERO_ASPECT = "1561 / 1000";

const heroDisplayFont = Archivo_Black({
  subsets: ["latin"],
  weight: "400"
});

const heroCopyShadow =
  "0 2px 4px rgba(0,0,0,0.9), 0 8px 32px rgba(0,0,0,0.65), 0 0 1px rgba(0,0,0,1)";

export function Hero() {
  return (
    <>
      <section id="hero" aria-label="Mundial FIFA 2026" className="theater-dark relative overflow-hidden">
        <div className="relative w-full md:section-shell">
          <div
            className="relative w-full overflow-hidden md:rounded-b-3xl md:border md:border-white/15"
            style={{ aspectRatio: HERO_ASPECT }}
          >
            <Image
              src={HERO_IMAGE}
              alt="PIO Deportes - Mundial FIFA 2026: Tres países, una pasión"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1240px"
              className="object-cover object-center"
            />

            <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
              <div className="absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-black/75 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            <p
              className={`${heroDisplayFont.className} absolute inset-x-0 top-0 z-10 px-4 pt-6 text-center text-[clamp(1.15rem,4.2vw,2.35rem)] font-normal uppercase leading-[1.05] tracking-[0.14em] text-white sm:pt-8 sm:tracking-[0.18em] md:pt-10`}
              style={{ textShadow: heroCopyShadow }}
            >
              TRES PAISES. UNA PASION
            </p>

            <p
              className={`${heroDisplayFont.className} absolute inset-x-0 bottom-0 z-10 px-4 pb-7 text-center text-[clamp(1rem,3.4vw,1.85rem)] font-normal uppercase leading-none tracking-[0.2em] text-white sm:pb-9 sm:tracking-[0.26em] md:pb-11`}
              style={{ textShadow: heroCopyShadow }}
            >
              11 DE JUNIO 2026
            </p>
          </div>
        </div>
      </section>

      <section
        id="hero-actions"
        aria-label="Acciones del Mundial"
        className="theater-dark border-t border-white/10"
      >
        <div className="section-shell py-4 sm:py-6">
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center md:justify-center md:gap-3 [&>*:last-child]:col-span-2 md:[&>*:last-child]:col-span-auto">
              <HeroButtons />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
