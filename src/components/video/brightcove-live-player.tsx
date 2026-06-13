"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BRIGHTCOVE_LIVE_ACCOUNT_ID,
  type BrightcoveLiveStreamConfig,
  ACTIVE_BRIGHTCOVE_LIVE_STREAMS
} from "@/lib/brightcove-live-config";
import { loadBrightcovePlayerScript } from "@/lib/brightcove-player-loader";

type BrightcoveLivePlayerProps = {
  stream?: BrightcoveLiveStreamConfig;
  className?: string;
};

type PlayerStatus = "loading" | "ready" | "error";

function getPlayerElementId(streamId: string): string {
  return `brightcove-${streamId}`;
}

function disposeBrightcovePlayer(elementId: string): void {
  const player = window.videojs?.getPlayer(elementId);
  if (player && typeof player.dispose === "function") {
    try {
      player.dispose();
    } catch {
      // Player may already be disposed during Strict Mode remounts.
    }
  }
}

export function BrightcoveLivePlayer({
  stream = ACTIVE_BRIGHTCOVE_LIVE_STREAMS[0],
  className = ""
}: BrightcoveLivePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [retryKey, setRetryKey] = useState(0);

  const playbackToken = stream.playbackToken?.trim();
  const elementId = getPlayerElementId(stream.id);

  const handleRetry = useCallback(() => {
    setStatus("loading");
    setRetryKey((value) => value + 1);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    async function mountPlayer() {
      const mountTarget = containerRef.current;
      if (!mountTarget) return;

      setStatus("loading");
      disposeBrightcovePlayer(elementId);
      mountTarget.replaceChildren();

      try {
        await loadBrightcovePlayerScript(stream.playerId);
        if (cancelled || !containerRef.current) return;

        const playerEl = document.createElement("video-js");
        playerEl.setAttribute("id", elementId);
        playerEl.setAttribute("data-account", BRIGHTCOVE_LIVE_ACCOUNT_ID);
        playerEl.setAttribute("data-player", stream.playerId);
        playerEl.setAttribute("data-embed", "default");
        playerEl.setAttribute("data-video-id", stream.channelId);
        if (playbackToken) {
          playerEl.setAttribute("data-live-playback-token", playbackToken);
        }
        playerEl.setAttribute("data-application-id", "");
        playerEl.setAttribute("controls", "");
        playerEl.className = `h-full w-full ${className}`.trim();

        containerRef.current.appendChild(playerEl);

        if (typeof window.bc === "function") {
          window.bc(playerEl);
        }

        if (!cancelled) {
          setStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    void mountPlayer();

    return () => {
      cancelled = true;
      disposeBrightcovePlayer(elementId);
      container.replaceChildren();
    };
  }, [className, elementId, playbackToken, retryKey, stream.channelId, stream.id, stream.playerId]);

  return (
    <div className="relative h-full w-full">
      {status === "loading" ? (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/80"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/25 border-t-white" />
            <p className="text-xs uppercase tracking-[0.16em] text-white/60">Cargando transmisión…</p>
          </div>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/90 px-4 text-center">
          <p className="text-sm text-white/85">No se pudo cargar el reproductor.</p>
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-full border border-white/25 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/20"
          >
            Reintentar
          </button>
        </div>
      ) : null}

      <div
        ref={containerRef}
        className={`h-full w-full ${status === "loading" ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  );
}
