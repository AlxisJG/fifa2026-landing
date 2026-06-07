type FootballSourceBadgeProps = {
  live: boolean;
  liveLabel?: string;
  demoLabel?: string;
  /** Demo badge on light panels (e.g. posiciones browser tabs). */
  demoOnLight?: boolean;
  compact?: boolean;
  className?: string;
};

export function FootballSourceBadge({
  live,
  liveLabel = "Datos en vivo",
  demoLabel = "Demo",
  demoOnLight = false,
  compact = false,
  className = ""
}: FootballSourceBadgeProps) {
  const size = compact ? "px-2 py-0.5" : "px-2 py-1";

  return (
    <span
      className={`rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] ${size} ${
        live
          ? "live-data-badge bg-red-600 text-white"
          : demoOnLight
            ? "bg-slate-200/80 text-slate-500"
            : "bg-white/10 text-white/50"
      } ${className}`}
    >
      {live ? liveLabel : demoLabel}
    </span>
  );
}
