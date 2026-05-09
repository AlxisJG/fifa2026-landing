"use client";

import { useEffect, useMemo, useState } from "react";

const target = new Date("2026-06-11T20:00:00-04:00").getTime();

export function CountdownWidget() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const i = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(i);
  }, []);

  const parts = useMemo(() => {
    const d = Math.max(target - now, 0);
    return {
      days: Math.floor(d / 86400000),
      hours: Math.floor((d / 3600000) % 24),
      minutes: Math.floor((d / 60000) % 60),
      seconds: Math.floor((d / 1000) % 60)
    };
  }, [now]);

  return (
    <section className="section-shell py-8 sm:py-10">
      <div className="glass-heavy rounded-3xl border border-sky-200/70 p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-900">Road to FIFA World Cup 2026</p>
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-700">Presented by Sponsor</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(parts).map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-3xl font-bold text-slate-900">{String(v).padStart(2, "0")}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-600">{k}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
