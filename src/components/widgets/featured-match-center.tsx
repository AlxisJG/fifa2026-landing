"use client";

import Link from "next/link";
import { getFeaturedMatchSeed } from "@/lib/football-widget-seeds";
import { useMatchCenter } from "@/hooks/useFootballData";
import { useLiveNavigation } from "@/hooks/use-live-navigation";
import type { FeaturedMatch } from "@/lib/football-api/types";
import { scrollToSection } from "@/lib/scroll-to-section";
import { getFlagCdnUrl } from "@/lib/team-flags";
import { PAGE_SEO } from "@/lib/seo/pages";

const FLAG_W = "w-[5.75rem] sm:w-[6.5rem]";
const MATCH_CENTER_BG = "/recursos/MATCH%20CENTER.jpg";

const ctaClass =
  "rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-black transition sm:text-sm";

type FeaturedMatchCenterProps = {
  /** Home uses live nav + calendario; transmisión scrolls to secciones en la misma página. */
  ctaMode?: "transmision" | "marketing";
};

function hasFeaturedMatch(match: FeaturedMatch) {
  return Boolean(match.homeCode?.trim() && match.awayCode?.trim());
}

function FeaturedFlag({ code, flagUrl }: { code: string; flagUrl?: string }) {
  const src = getFlagCdnUrl(code, 160) ?? flagUrl;

  return (
    <div
      className={`${FLAG_W} h-[3.25rem] shrink-0 overflow-hidden border-2 border-white bg-white/5 sm:h-[3.75rem]`}
      style={{ borderTopLeftRadius: "0.75rem" }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">{code}</span>
      )}
    </div>
  );
}

function FeaturedMatchup({
  homeCode,
  awayCode,
  homeName,
  awayName,
  homeFlagUrl,
  awayFlagUrl
}: Pick<FeaturedMatch, "homeCode" | "awayCode" | "homeName" | "awayName" | "homeFlagUrl" | "awayFlagUrl">) {
  return (
    <div className="grid grid-cols-[5.75rem_auto_5.75rem] items-end gap-x-5 gap-y-3 sm:grid-cols-[6.5rem_auto_6.5rem] sm:gap-x-8 sm:gap-y-3.5">
      <FeaturedFlag code={homeCode} flagUrl={homeFlagUrl} />
      <span className="pb-1 text-2xl font-black uppercase leading-none text-white sm:pb-1.5 sm:text-4xl">VS</span>
      <FeaturedFlag code={awayCode} flagUrl={awayFlagUrl} />

      <p className="text-center text-xs font-semibold uppercase leading-snug text-white sm:text-sm">{homeName}</p>
      <span aria-hidden />
      <p className="text-center text-xs font-semibold uppercase leading-snug text-white sm:text-sm">{awayName}</p>
    </div>
  );
}

function MatchCenterActions({ ctaMode }: { ctaMode: "transmision" | "marketing" }) {
  const navigateLive = useLiveNavigation();

  if (ctaMode === "marketing") {
    return (
      <>
        <button
          type="button"
          onClick={navigateLive}
          className={`${ctaClass} bg-[#c8f542] hover:brightness-105`}
        >
          Ver en vivo
        </button>
        <Link
          href={PAGE_SEO.partidos.path}
          className={`${ctaClass} bg-white hover:bg-white/90`}
        >
          Calendario completo
        </Link>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => scrollToSection("live")}
        className={`${ctaClass} bg-[#c8f542] hover:brightness-105`}
      >
        Ver en vivo
      </button>
      <button
        type="button"
        onClick={() => scrollToSection("match-center")}
        className={`${ctaClass} bg-white hover:bg-white/90`}
      >
        Centro de partido
      </button>
    </>
  );
}

export function FeaturedMatchCenter({ ctaMode = "transmision" }: FeaturedMatchCenterProps) {
  const { data, loading, source } = useMatchCenter(getFeaturedMatchSeed());
  const match: FeaturedMatch = data;

  if (!loading && !hasFeaturedMatch(match)) {
    return null;
  }

  return (
    <section id="match-center" className="theater-dark relative py-6 sm:py-8">
      <div
        className="pointer-events-none absolute inset-0 bg-[#0d3a6e] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${MATCH_CENTER_BG}")` }}
        aria-hidden
      />

      <div className="section-shell relative z-10">
        <div className="mb-2 flex justify-end">
          <span
            className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${
              source === "live" ? "bg-emerald-500/20 text-emerald-200" : "bg-white/10 text-white/70"
            }`}
          >
            {source === "live" ? "Datos en vivo" : "Datos demo"}
          </span>
        </div>

        <div className="mb-6 text-center sm:mb-8">
          {loading ? (
            <div className="mx-auto space-y-2">
              <div className="mx-auto h-8 w-64 animate-pulse rounded bg-white/20 sm:h-9 sm:w-72" />
              <div className="mx-auto h-4 w-40 animate-pulse rounded bg-white/15" />
            </div>
          ) : (
            <>
              <p className="text-lg font-black uppercase tracking-[0.14em] text-white sm:text-xl sm:tracking-[0.18em] md:text-2xl">
                {match.groupLabel}
              </p>
              {match.isPlaceholder && (
                <span className="mt-2 inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-amber-200">
                  Por definir
                </span>
              )}
              {match.kickoff && (
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-[#c8f542] sm:text-base">
                  {match.kickoff}
                </p>
              )}
              <p className="mt-2 text-xs text-white/85 sm:text-sm">{match.venue}</p>
            </>
          )}
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6">
          <div className="hidden lg:block">
            <p className="text-3xl font-black uppercase leading-[0.9] tracking-tight text-white xl:text-4xl">
              Partido
              <br />
              Destacado
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-2xl font-black uppercase leading-none text-white lg:hidden">Partido Destacado</p>
            {loading ? (
              <div className="h-[4.5rem] w-64 animate-pulse rounded-lg bg-white/15" />
            ) : (
              <FeaturedMatchup
                homeCode={match.homeCode}
                awayCode={match.awayCode}
                homeName={match.homeName}
                awayName={match.awayName}
                homeFlagUrl={match.homeFlagUrl}
                awayFlagUrl={match.awayFlagUrl}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-end">
            <MatchCenterActions ctaMode={ctaMode} />
          </div>
        </div>
      </div>
    </section>
  );
}
