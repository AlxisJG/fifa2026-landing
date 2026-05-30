"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/motion";
import {
  HeroActionButton,
  IconFixturesCalendar,
  IconHighlightsVideo
} from "@/components/ui/hero-action-button";
import { LiveNavButton } from "@/components/ui/live-nav-button";
import { scrollToSection } from "@/lib/scroll-to-section";

const HERO_IMAGE = "/recursos/HEADER.jpg";
/** Proporción real de HEADER.jpg (1561×1000) para evitar recorte con object-cover */
const HERO_ASPECT = "1561 / 1000";

function HeroButtons() {
  return (
    <>
      <LiveNavButton variant="hero" label="Ver en vivo" onClick={() => scrollToSection("live")} />
      <HeroActionButton
        icon={<IconFixturesCalendar />}
        iconTone="sky"
        onClick={() => scrollToSection("fixtures")}
      >
        Calendario de partidos
      </HeroActionButton>
      <HeroActionButton
        icon={<IconHighlightsVideo />}
        iconTone="red"
        onClick={() => scrollToSection("summaries")}
      >
        Highlights
      </HeroActionButton>
    </>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="theater-dark relative overflow-hidden pt-[calc(env(safe-area-inset-top,0px)+4.5rem)] sm:pt-[calc(env(safe-area-inset-top,0px)+4.75rem)]"
    >
      <div className="relative w-full md:section-shell">
        <div
          className="relative w-full overflow-hidden md:rounded-b-3xl md:border md:border-white/15"
          style={{ aspectRatio: HERO_ASPECT }}
        >
          <Image
            src={HERO_IMAGE}
            alt="PIO Deportes - Mundial FIFA 2026"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1240px"
            className="object-contain object-center"
          />

          <div className="absolute inset-0 z-10 hidden flex-col px-8 py-8 md:flex">
            <Reveal
              delay={0.1}
              className="mt-auto flex w-full flex-col items-center justify-center gap-3 pb-[30px] md:flex-row md:flex-wrap"
            >
              <HeroButtons />
            </Reveal>
          </div>
        </div>
      </div>

      <div className="section-shell pt-3 md:hidden">
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-2 [&>button:last-child]:col-span-2">
            <HeroButtons />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
