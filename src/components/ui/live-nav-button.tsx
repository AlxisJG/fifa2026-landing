"use client";

import { useLiveNavigation } from "@/hooks/use-live-navigation";
import { useLiveTransmissionAvailable } from "@/hooks/use-live-stream-status";

type LiveNavButtonProps = {
  onClick?: () => void;
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
  const navigateLive = useLiveNavigation();
  const available = useLiveTransmissionAvailable();

  if (!available) {
    return null;
  }

  const handleClick = () => {
    onClick?.();
    navigateLive();
  };

  const base =
    "inline-flex items-center gap-2 rounded-full bg-white font-semibold uppercase tracking-[0.16em] text-black shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition hover:bg-white/90 hover:shadow-[0_10px_28px_rgba(15,23,42,0.16)]";

  const sizing =
    variant === "nav"
      ? "ml-1 shrink-0 px-4 py-1.5 text-[10px] sm:text-[11px]"
      : variant === "hero"
        ? "min-h-10 w-full justify-center px-4 py-2.5 text-xs sm:min-h-12 sm:px-7 sm:py-3 sm:text-sm md:w-auto md:shrink-0"
        : "w-full justify-center px-4 py-3 text-sm";

  return (
    <button type="button" onClick={handleClick} className={`${base} ${sizing} ${className}`.trim()}>
      <span className="live-dot-blink h-2 w-2 shrink-0 rounded-full bg-[#d71920]" aria-hidden />
      {label}
    </button>
  );
}
