"use client";

import { getTickerSeed } from "@/lib/football-widget-seeds";
import { useFootballLiveSectionsVisible } from "@/contexts/football-live-sections-context";
import { useTicker } from "@/hooks/useFootballData";

type LiveNavButtonProps = {
  onClick: () => void;
  variant?: "nav" | "menu" | "hero";
  label?: string;
  className?: string;
};

export function LiveNavButton({
  onClick,
  variant = "nav",
  label = "En vivo",
  className = ""
}: LiveNavButtonProps) {
  const liveSectionsVisible = useFootballLiveSectionsVisible();
  const { data } = useTicker(getTickerSeed(), { enabled: liveSectionsVisible });
  const isLive = liveSectionsVisible && data.some((item) => item.live);

  if (!liveSectionsVisible) return null;

  const base =
    "inline-flex items-center gap-2 rounded-full bg-white font-semibold uppercase tracking-[0.16em] text-black shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition hover:bg-white/90 hover:shadow-[0_10px_28px_rgba(15,23,42,0.16)]";

  const sizing =
    variant === "nav"
      ? "shrink-0 px-4 py-1.5 text-[10px] sm:text-[11px]"
      : variant === "hero"
        ? "min-h-10 w-full justify-center px-4 py-2.5 text-xs sm:min-h-12 sm:px-7 sm:py-3 sm:text-sm md:w-auto md:shrink-0"
        : "w-full justify-center px-4 py-3 text-sm";

  return (
    <button type="button" onClick={onClick} className={`${base} ${sizing} ${className}`.trim()}>
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${isLive ? "live-dot-blink bg-[#d71920]" : "bg-neutral-400"}`}
        aria-hidden
      />
      {label}
    </button>
  );
}
