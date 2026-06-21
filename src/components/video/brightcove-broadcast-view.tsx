"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BrightcoveLivePlayer } from "@/components/video/brightcove-live-player";
import {
  ACTIVE_BRIGHTCOVE_LIVE_STREAMS,
  isBrightcoveSimultaneousPlayersEnabled,
  type BrightcoveLiveStreamConfig
} from "@/lib/brightcove-live-config";
import type { LiveTransmissionStatus } from "@/lib/live-transmission-status";

type BrightcoveBroadcastViewProps = {
  className?: string;
  initialLiveStatus: LiveTransmissionStatus;
};

type LivePlayerTheaterProps = {
  stream: BrightcoveLiveStreamConfig;
  compact?: boolean;
};

function LivePlayerTheater({ stream, compact = false }: LivePlayerTheaterProps) {
  return (
    <div
      className={`glass-heavy relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(2,6,23,0.12)] ${
        compact ? "p-3 sm:p-4" : "p-4 sm:p-5"
      }`}
    >
      <div className="relative mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" aria-hidden />
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-700">
              En vivo
            </span>
          </div>
          <p className={`font-semibold text-slate-900 ${compact ? "text-sm" : "text-base"}`}>
            {stream.matchTitle}
          </p>
          {stream.matchSubtitle ? (
            <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-slate-700">
              {stream.matchSubtitle}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-800">
          {stream.label}
        </span>
      </div>

      <div className="live-player-frame relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-black">
        <BrightcoveLivePlayer key={stream.id} stream={stream} />
      </div>
    </div>
  );
}

function BroadcastSimultaneousLayout({
  streams,
  className
}: {
  streams: BrightcoveLiveStreamConfig[];
  className: string;
}) {
  const compact = streams.length > 1;

  return (
    <div className={`space-y-4 ${className}`.trim()}>
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm sm:px-5 sm:py-4">
        <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 sm:text-lg">
          Doble transmisión en vivo
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">
          Ambos partidos se reproducen al mismo tiempo. En pantallas pequeñas aparecen uno debajo del
          otro.
        </p>
      </div>

      <div
        className={
          streams.length > 1
            ? "grid gap-4 lg:grid-cols-2 lg:items-start"
            : "max-w-5xl"
        }
      >
        {streams.map((stream) => (
          <LivePlayerTheater key={stream.id} stream={stream} compact={compact} />
        ))}
      </div>
    </div>
  );
}

function BroadcastSwitcherLayout({
  streams,
  className
}: {
  streams: BrightcoveLiveStreamConfig[];
  className: string;
}) {
  const [selectedId, setSelectedId] = useState(streams[0]?.id ?? "live-1");
  const selectedStream = streams.find((stream) => stream.id === selectedId) ?? streams[0];

  if (!selectedStream) {
    return null;
  }

  return (
    <div className={`grid gap-5 xl:grid-cols-12 ${className}`.trim()}>
      <div className="space-y-4 xl:col-span-8">
        <LivePlayerTheater stream={selectedStream} />
      </div>

      <aside className="glass-heavy flex min-h-[280px] flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(2,6,23,0.12)] sm:min-h-[420px] sm:p-6 xl:col-span-4 xl:min-h-0">
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
          Centro de transmisión
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Selecciona el partido o canal que deseas ver en este momento.
        </p>

        <div className="mt-5 flex-1 space-y-3">
          {streams.map((stream) => {
            const isSelected = stream.id === selectedStream.id;

            return (
              <motion.button
                key={stream.id}
                type="button"
                onClick={() => setSelectedId(stream.id)}
                whileHover={{ x: 4 }}
                className={`w-full rounded-2xl border p-3.5 text-left transition ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 shadow-[0_8px_24px_rgba(37,99,235,0.12)]"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{stream.matchTitle}</p>
                    {stream.matchSubtitle ? (
                      <p className="mt-1 text-xs text-slate-700">{stream.matchSubtitle}</p>
                    ) : null}
                  </div>
                  {isSelected ? (
                    <span className="shrink-0 rounded-full bg-red-600/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-700">
                      En vivo
                    </span>
                  ) : null}
                </div>
              </motion.button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

async function fetchLiveTransmissionStatus(): Promise<LiveTransmissionStatus | null> {
  const res = await fetch("/api/stream/status", { cache: "no-store" });
  if (!res.ok) return null;
  return res.json() as Promise<LiveTransmissionStatus>;
}

export function BrightcoveBroadcastView({
  className = "",
  initialLiveStatus
}: BrightcoveBroadcastViewProps) {
  const [liveStatus, setLiveStatus] = useState(initialLiveStatus);
  const streams = useMemo(() => {
    const activeStreamIds = new Set(
      liveStatus.streams.filter((stream) => stream.active).map((stream) => stream.id)
    );
    return ACTIVE_BRIGHTCOVE_LIVE_STREAMS.filter((stream) => activeStreamIds.has(stream.id));
  }, [liveStatus.streams]);
  const primaryStream = streams[0];

  useEffect(() => {
    let cancelled = false;

    async function refreshStatus() {
      const nextStatus = await fetchLiveTransmissionStatus();
      if (!cancelled && nextStatus) {
        setLiveStatus(nextStatus);
      }
    }

    const intervalId = window.setInterval(() => void refreshStatus(), 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  if (!primaryStream) {
    return null;
  }

  if (streams.length <= 1) {
    return (
      <div className={className}>
        <LivePlayerTheater stream={primaryStream} />
      </div>
    );
  }

  if (isBrightcoveSimultaneousPlayersEnabled()) {
    return <BroadcastSimultaneousLayout streams={streams} className={className} />;
  }

  return <BroadcastSwitcherLayout streams={streams} className={className} />;
}
