"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/motion";
import { HeroButtons } from "@/components/sections/hero-buttons";

const HERO_IMAGE = "/recursos/HEADER1600x668.jpg";
const HERO_ASPECT = "1600 / 668";

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
              <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 px-4 pb-7 text-center sm:gap-2.5 sm:pb-9 md:pb-11">
              <p
                className="text-[clamp(1rem,3.5vw,2rem)] font-black uppercase leading-[1.05] tracking-[0.14em] text-white sm:tracking-[0.18em]"
                style={{ textShadow: heroCopyShadow }}
              >
                TRES PAISES. UNA PASION
              </p>
              <p
                className="text-[clamp(1rem,3.4vw,1.85rem)] font-black uppercase leading-none tracking-[0.2em] text-white sm:tracking-[0.26em]"
                style={{ textShadow: heroCopyShadow }}
              >
                11 DE JUNIO 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="hero-actions"
        aria-label="Acciones del Mundial"
        className="theater-dark border-t border-white/10"
      >
        <div className="section-shell py-6 sm:py-8">
          <Reveal delay={0.1}>
            <HeroButtons />
          </Reveal>
        </div>
      </section>
    </>
  );
}
