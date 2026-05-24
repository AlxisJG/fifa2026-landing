"use client";

import { tickerItems as initialTicker } from "@/data/worldcup-widgets";
import { useTicker } from "@/hooks/useFootballData";

type LiveNavButtonProps = {
  onClick: () => void;
  variant?: "nav" | "menu";
};

export function LiveNavButton({ onClick, variant = "nav" }: LiveNavButtonProps) {
  const { data } = useTicker(initialTicker);
  const isLive = data.some((item) => item.live);

  const base =
    "inline-flex items-center gap-2 rounded-full bg-white font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-white/90";

  const sizing =
    variant === "nav"
      ? "shrink-0 px-4 py-1.5 text-[10px] sm:text-[11px]"
      : "w-full justify-center px-4 py-3 text-sm";

  return (
    <button type="button" onClick={onClick} className={`${base} ${sizing}`}>
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${isLive ? "live-dot-blink bg-[#d71920]" : "bg-neutral-400"}`}
        aria-hidden
      />
      En vivo
    </button>
  );
}
