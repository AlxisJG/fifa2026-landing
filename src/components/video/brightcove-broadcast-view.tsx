"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BrightcoveLivePlayer } from "@/components/video/brightcove-live-player";
import { BRIGHTCOVE_LIVE_STREAMS } from "@/lib/brightcove-live-config";

type BrightcoveBroadcastViewProps = {
  className?: string;
};

export function BrightcoveBroadcastView({ className = "" }: BrightcoveBroadcastViewProps) {
  const streams = useMemo(
    () => BRIGHTCOVE_LIVE_STREAMS.filter((stream) => stream.playbackToken.trim().length > 0),
    []
  );
  const [selectedId, setSelectedId] = useState(streams[0]?.id ?? BRIGHTCOVE_LIVE_STREAMS[0].id);

  const selectedStream =
    streams.find((stream) => stream.id === selectedId) ?? streams[0] ?? BRIGHTCOVE_LIVE_STREAMS[0];

  return (
    <div className={`grid gap-5 xl:grid-cols-12 ${className}`.trim()}>
      <div className="space-y-4 xl:col-span-8">
        <div className="theater-dark glass-heavy relative overflow-hidden rounded-3xl border border-slate-700/60 bg-[#090f1f] p-4 shadow-[0_25px_80px_rgba(2,6,23,0.55)] sm:p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(70,210,255,0.18),transparent_40%)]" />

          <div className="relative mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-400" />
              <span className="rounded-full bg-red-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                En vivo
              </span>
            </div>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80">
              {selectedStream.label}
            </span>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/15 bg-black">
            <BrightcoveLivePlayer key={selectedStream.id} stream={selectedStream} />
          </div>

          <div className="relative mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-sm font-semibold text-white">{selectedStream.matchTitle}</p>
            {selectedStream.matchSubtitle ? (
              <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-white/55">
                {selectedStream.matchSubtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <aside className="glass-heavy flex min-h-[280px] flex-col rounded-3xl border border-slate-300 bg-white/95 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.12)] sm:min-h-[420px] sm:p-6 xl:col-span-4 xl:min-h-0">
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-blue-900">Centro de transmisión</h3>
        <p className="mt-2 text-sm text-slate-700">
          Selecciona el partido o canal que deseas ver en este momento.
        </p>

        <div className="mt-5 flex-1 space-y-3">
          {BRIGHTCOVE_LIVE_STREAMS.map((stream) => {
            const isSelected = stream.id === selectedStream.id;
            const isConfigured = stream.playbackToken.trim().length > 0;

            return (
              <motion.button
                key={stream.id}
                type="button"
                disabled={!isConfigured}
                onClick={() => setSelectedId(stream.id)}
                whileHover={isConfigured ? { x: 4 } : undefined}
                className={`w-full rounded-2xl border p-3.5 text-left transition ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-[0_8px_24px_rgba(37,99,235,0.12)]"
                    : "border-slate-300 bg-slate-50 hover:border-slate-400"
                } ${!isConfigured ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{stream.matchTitle}</p>
                    {stream.matchSubtitle ? (
                      <p className="mt-1 text-xs text-slate-600">{stream.matchSubtitle}</p>
                    ) : null}
                  </div>
                  {isSelected && isConfigured ? (
                    <span className="shrink-0 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-600">
                      En vivo
                    </span>
                  ) : null}
                </div>
                {!isConfigured ? (
                  <p className="mt-2 text-xs text-slate-500">Canal no disponible</p>
                ) : null}
              </motion.button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
