"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  IconFixturesCalendar,
  IconHighlightsVideo
} from "@/components/ui/hero-action-button";
import { getTickerSeed } from "@/lib/football-widget-seeds";
import { useTicker } from "@/hooks/useFootballData";
import { useLiveNavigation } from "@/hooks/use-live-navigation";
import { PAGE_SEO } from "@/lib/seo/pages";
import { isSubscriptionFunnelEnabled } from "@/lib/subscription-funnel-gate";

type HeroActionCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  tone: "live" | "sky" | "red";
  href?: string;
  onClick?: () => void;
  isLive?: boolean;
};

const cardToneClass = {
  live: "border-[#f2c6c8] hover:border-[#d71920]/45",
  sky: "border-sky-200 hover:border-sky-400",
  red: "border-rose-200 hover:border-rose-400"
};

const iconToneClass = {
  live: "border-[#f2c6c8] bg-[#fde8e9] text-[#b51219]",
  sky: "border-sky-200 bg-sky-50 text-[#005fcc]",
  red: "border-rose-200 bg-rose-50 text-[#b51219]"
};

const ctaToneClass = {
  live: "text-[#b51219] group-hover:text-[#8f0e14]",
  sky: "text-[#005fcc] group-hover:text-[#0047a8]",
  red: "text-[#b51219] group-hover:text-[#8f0e14]"
};

const cardClass =
  "group flex h-full flex-col rounded-2xl border bg-white p-4 text-left shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.34)] sm:p-5";

function IconLiveTv({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 3.5 10.5 5.5M16 3.5 13.5 5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="11.5" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="M7.5 18.5h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function HeroActionCard({ title, description, icon, tone, href, onClick, isLive }: HeroActionCardProps) {
  const content = (
    <>
      <div className="mb-3 flex items-start justify-between gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition sm:h-12 sm:w-12 ${iconToneClass[tone]}`}
          aria-hidden
        >
          {icon}
        </span>
        {isLive != null && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
              isLive
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-slate-100 text-slate-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isLive ? "live-dot-blink bg-[#d71920]" : "bg-slate-400"}`}
              aria-hidden
            />
            {isLive ? "En vivo" : "Próximo"}
          </span>
        )}
      </div>
      <h3 className="text-sm font-black uppercase tracking-[0.06em] text-slate-900 sm:text-base">{title}</h3>
      <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{description}</p>
      <span
        className={`mt-4 text-[11px] font-bold uppercase tracking-[0.16em] transition ${ctaToneClass[tone]}`}
      >
        Explorar →
      </span>
    </>
  );

  const composedCardClass = `${cardClass} ${cardToneClass[tone]}`;

  if (href) {
    return (
      <Link href={href} className={composedCardClass}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={composedCardClass}>
      {content}
    </button>
  );
}

function HeroButtons() {
  const funnelEnabled = isSubscriptionFunnelEnabled();
  const navigateLive = useLiveNavigation();
  const { data } = useTicker(getTickerSeed(), { enabled: funnelEnabled });
  const isLive = data.some((item) => item.live);

  const cards: ReactNode[] = [];

  if (funnelEnabled) {
    cards.push(
      <HeroActionCard
        key="live"
        title="Ver en vivo"
        description="Accede a la transmisión del Mundial con marcador y cobertura en tiempo real."
        icon={<IconLiveTv />}
        tone="live"
        onClick={navigateLive}
        isLive={isLive}
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
