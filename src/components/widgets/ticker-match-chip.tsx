import type { TickerItem } from "@/lib/football-api/types";
import { getFlagCdnUrl } from "@/lib/team-flags";

type TeamFlagProps = {
  code: string;
  flagUrl?: string;
  label: string;
};

function TeamFlag({ code, flagUrl, label }: TeamFlagProps) {
  const src = flagUrl ?? getFlagCdnUrl(code);

  return (
    <span className="flex items-center gap-1.5">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={20}
          height={15}
          className="h-4 w-5 shrink-0 rounded-[2px] object-cover shadow-sm"
        />
      ) : (
        <span className="flex h-4 w-5 shrink-0 items-center justify-center rounded-[2px] bg-white/20 text-[8px] font-bold">
          {code.slice(0, 2)}
        </span>
      )}
      <span>{label}</span>
    </span>
  );
}

type TickerMatchChipProps = {
  item: TickerItem;
};

export function TickerMatchChip({ item }: TickerMatchChipProps) {
  const hasScore = item.homeScore != null && item.awayScore != null;

  return (
    <div className="flex min-w-max items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white">
      {item.live && <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden />}
      <TeamFlag code={item.homeCode} flagUrl={item.homeFlagUrl} label={item.homeLabel} />
      {hasScore ? (
        <span className="font-bold tabular-nums">
          {item.homeScore} - {item.awayScore}
        </span>
      ) : (
        <span className="text-white/50">vs</span>
      )}
      <TeamFlag code={item.awayCode} flagUrl={item.awayFlagUrl} label={item.awayLabel} />
      <span className="text-white/60">•</span>
      <span className="text-white/85">{item.detail}</span>
    </div>
  );
}
