"use client";

import { useEffect, useMemo, useState } from "react";
import { WORLD_CUP_KICKOFF_MS } from "@/lib/world-cup-kickoff";

type CountdownWidgetProps = {
  targetMs?: number;
};

const COUNTDOWN_BG = "/recursos/COUNTDOWN.jpg";

const countdownUnits = [
  { key: "days", label: "DÍAS" },
  { key: "hours", label: "HORAS" },
  { key: "minutes", label: "MIN." },
  { key: "seconds", label: "SEG." }
] as const;

type CountdownParts = Record<(typeof countdownUnits)[number]["key"], number>;

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-[5.5rem] flex-1 basis-[5.5rem] flex-col items-center justify-center rounded-[18px] bg-white px-4 py-5 sm:min-w-[6.5rem] sm:basis-[6.5rem] sm:px-5 sm:py-6 md:min-w-[7.5rem] md:basis-[7.5rem]">
      <p className="text-[clamp(2.25rem,6vw,3.75rem)] font-normal leading-none tracking-tight text-black tabular-nums">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-2 text-[clamp(0.65rem,1.8vw,0.85rem)] font-normal uppercase leading-none tracking-[0.06em] text-black">
        {label}
      </p>
    </div>
  );
}

export function CountdownWidget({ targetMs = WORLD_CUP_KICKOFF_MS }: CountdownWidgetProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const i = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(i);
  }, []);

  const remainingMs = targetMs - now;

  const parts = useMemo((): CountdownParts => {
    const d = Math.max(remainingMs, 0);
    return {
      days: Math.floor(d / 86400000),
      hours: Math.floor((d / 3600000) % 24),
      minutes: Math.floor((d / 60000) % 60),
      seconds: Math.floor((d / 1000) % 60)
    };
  }, [remainingMs]);

  if (remainingMs <= 0) {
    return null;
  }

  return (
    <section
      id="countdown"
      className="theater-dark relative z-[1] mt-5 w-full font-black"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-black bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${COUNTDOWN_BG}")` }}
        aria-hidden
      />

      <div className="section-shell relative z-10 px-4 py-8 sm:py-10 md:py-12">
        <h3 className="mb-6 text-center text-[clamp(1.35rem,3.5vw,2.5rem)] font-black uppercase leading-[0.95] tracking-[0.02em] text-white sm:mb-8">
          Road to FIFA World Cup 2026
        </h3>

        <div className="mx-auto flex max-w-4xl flex-wrap items-stretch justify-center gap-4 sm:gap-5">
          {countdownUnits.map(({ key, label }) => (
            <CountdownBox key={key} value={parts[key]} label={label} />
          ))}
        </div>
      </div>
    </section>
  );
}
