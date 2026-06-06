"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  IconFixturesCalendar,
  IconHighlightsVideo
} from "@/components/ui/hero-action-button";
import { useLiveNavigation } from "@/hooks/use-live-navigation";
import { useLiveTransmissionAvailable } from "@/hooks/use-live-stream-status";
import { PAGE_SEO } from "@/lib/seo/pages";

type HeroActionCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  tone: "live" | "sky" | "red";
  href?: string;
  onClick?: () => void;
  isLive?: boolean;
};

/** Backgrounds sampled from hero action reference (red → blue → green). */
const HERO_CARD_BACKGROUNDS = {
  live: "#C32D21",
  sky: "#3257F3",
  red: "#5AC161"
} as const;

type CardTheme = {
  background: string;
  border: string;
  icon: string;
  cta: string;
  liveBadgeLive: string;
  liveBadgeIdle: string;
};

const sharedLightTheme = {
  border: "border-white/20 hover:border-white/35",
  icon: "border-white/35 bg-white/15 text-white",
  cta: "text-white group-hover:text-white/90",
  liveBadgeLive: "border-white/35 bg-black/20 text-white",
  liveBadgeIdle: "border-white/25 bg-black/10 text-white/85"
} as const;

const cardThemes: Record<HeroActionCardProps["tone"], CardTheme> = {
  live: { background: HERO_CARD_BACKGROUNDS.live, ...sharedLightTheme },
  sky: { background: HERO_CARD_BACKGROUNDS.sky, ...sharedLightTheme },
  red: { background: HERO_CARD_BACKGROUNDS.red, ...sharedLightTheme }
};

const cardClass =
  "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-4 text-left shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.28)] sm:p-5";

function IconLiveTv({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="2.25" />
      <path d="M8 3.5 10.5 5.5M16 3.5 13.5 5.5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      <circle cx="12" cy="11.5" r="2.25" stroke="currentColor" strokeWidth="2.25" />
      <path d="M7.5 18.5h9" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  );
}

function HeroActionCard({ title, description, icon, tone, href, onClick, isLive }: HeroActionCardProps) {
  const theme = cardThemes[tone];

  const content = (
    <div className="relative z-10 flex h-full flex-col">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition sm:h-12 sm:w-12 ${theme.icon}`}
          aria-hidden
        >
          {icon}
        </span>
        {isLive != null && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
              isLive ? theme.liveBadgeLive : theme.liveBadgeIdle
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isLive ? "live-dot-blink bg-[#d71920]" : "bg-neutral-500"}`}
              aria-hidden
            />
            {isLive ? "En vivo" : "Próximo"}
          </span>
        )}
      </div>
      <h3 className="text-sm font-black uppercase tracking-[0.06em] text-white sm:text-base">{title}</h3>
      <p className="mt-1.5 flex-1 text-xs leading-relaxed text-white/85 sm:text-sm">{description}</p>
      <span className={`mt-4 text-[11px] font-bold uppercase tracking-[0.16em] transition ${theme.cta}`}>
        Explorar →
      </span>
    </div>
  );

  const composedCardClass = `${cardClass} ${theme.border}`;
  const cardStyle = { backgroundColor: theme.background };

  if (href) {
    return (
      <Link href={href} className={composedCardClass} style={cardStyle}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={composedCardClass} style={cardStyle}>
      {content}
    </button>
  );
}

function HeroButtons() {
  const navigateLive = useLiveNavigation();
  const liveAvailable = useLiveTransmissionAvailable();

  const cards: ReactNode[] = [];

  if (liveAvailable) {
    cards.push(
      <HeroActionCard
        key="live"
        title="Ver en vivo"
        description="Accede a la transmisión del Mundial con marcador y cobertura en tiempo real."
        icon={<IconLiveTv />}
        tone="live"
        onClick={navigateLive}
        isLive
      />
    );
  }

  cards.push(
    <HeroActionCard
      key="fixtures"
      title="Calendario de partidos"
      description="Consulta horarios, sedes y la programación completa del torneo."
      icon={<IconFixturesCalendar className="h-5 w-5" />}
      tone="sky"
      href={PAGE_SEO.partidos.path}
    />,
    <HeroActionCard
      key="highlights"
      title="Highlights"
      description="Revive los mejores momentos y resúmenes de cada encuentro."
      icon={<IconHighlightsVideo className="h-5 w-5" />}
      tone="red"
      href={PAGE_SEO.highlights.path}
    />
  );

  return (
    <div className={`grid gap-3 sm:gap-4 ${cards.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
      {cards}
    </div>
  );
}

export { HeroButtons };
