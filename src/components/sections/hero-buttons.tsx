"use client";

import {
  HeroActionButton,
  IconFixturesCalendar,
  IconHighlightsVideo
} from "@/components/ui/hero-action-button";
import { LiveNavButton } from "@/components/ui/live-nav-button";
import { PAGE_SEO } from "@/lib/seo/pages";

function HeroButtons() {
  return (
    <>
      <LiveNavButton variant="hero" label="Ver en vivo" />
      <HeroActionButton icon={<IconFixturesCalendar />} iconTone="sky" href={PAGE_SEO.partidos.path}>
        Calendario de partidos
      </HeroActionButton>
      <HeroActionButton icon={<IconHighlightsVideo />} iconTone="red" href={PAGE_SEO.highlights.path}>
        Highlights
      </HeroActionButton>
    </>
  );
}

export { HeroButtons };
