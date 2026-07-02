"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BRIGHTCOVE_LIVE_ACCOUNT_ID,
  type BrightcoveLiveStreamConfig,
  ACTIVE_BRIGHTCOVE_LIVE_STREAMS
} from "@/lib/brightcove-live-config";
import { isNativeApp } from "@/lib/native-app";
import { loadBrightcovePlayerScript } from "@/lib/brightcove-player-loader";

type BrightcoveLivePlayerProps = {
  stream?: BrightcoveLiveStreamConfig;
  className?: string;
  /** En app nativa: botón de fullscreen debajo del video, sin tapar controles. */
  variant?: "embedded" | "stacked";
};

type PlayerStatus = "loading" | "ready" | "error";

function getPlayerElementId(streamId: string): string {
  return `brightcove-${streamId}`;
}

function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/i.test(navigator.userAgent);
}

function requestNativeVideoFullscreen(container: HTMLElement | null): boolean {
  const video = container?.querySelector("video");
  if (!video) return false;

  const webkitVideo = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
  if (typeof webkitVideo.webkitEnterFullscreen === "function") {
    webkitVideo.webkitEnterFullscreen();
    return true;
  }

  if (typeof video.requestFullscreen === "function") {
    void video.requestFullscreen();
    return true;
  }

  return false;
}

function wireIosFullscreenFallback(elementId: string, container: HTMLElement | null): void {
  if (!isNativeApp() || !isIosDevice()) return;

  const player = window.videojs?.getPlayer(elementId);
  if (!player?.ready) return;

  player.ready(() => {
    const fullscreenButton = container?.querySelector(".vjs-fullscreen-control");
    if (fullscreenButton && !fullscreenButton.getAttribute("data-ios-fullscreen-wired")) {
      fullscreenButton.setAttribute("data-ios-fullscreen-wired", "true");
      fullscreenButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        requestNativeVideoFullscreen(container);
      });
    }
  });
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

function attachPlayerDiagnostics(player: BrightcoveVideoJsPlayer | undefined, streamId: string): void {
  if (!player?.on) return;

  player.on("error", () => {
    // Leave this visible in production: it is the fastest way to diagnose Brightcove geo/policy issues.
    console.warn("[Brightcove live] player error", {
      streamId,
      error: player.error?.(),
      currentSrc: player.currentSrc?.()
    });
  });

  player.on("stalled", () => {
    console.warn("[Brightcove live] playback stalled", {
      streamId,
      currentSrc: player.currentSrc?.()
    });
  });
}

export function BrightcoveLivePlayer({
  stream = ACTIVE_BRIGHTCOVE_LIVE_STREAMS[0],
  className = "",
  variant = "embedded"
}: BrightcoveLivePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [retryKey, setRetryKey] = useState(0);

  const playbackToken = stream.playbackToken?.trim();
  const elementId = getPlayerElementId(stream.id);
  const showNativeFullscreen = isNativeApp() && isIosDevice();

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
        playerEl.setAttribute("playsinline", "");
        playerEl.setAttribute("webkit-playsinline", "");
        playerEl.className = `vjs-fluid h-full w-full ${className}`.trim();

        containerRef.current.appendChild(playerEl);

        if (typeof window.bc === "function") {
          window.bc(playerEl);
        }

        const player = window.videojs?.getPlayer(elementId);
        attachPlayerDiagnostics(player, stream.id);
        wireIosFullscreenFallback(elementId, containerRef.current);

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
  }, [
    className,
    elementId,
    playbackToken,
    retryKey,
    stream.channelId,
    stream.id,
    stream.playerId
  ]);

  const stackedLayout = variant === "stacked";

  const playerViewport = (
    <>
      {status === "loading" ? (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/80"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/25 border-t-white" />
            <p className="text-xs uppercase tracking-[0.16em] text-white/80">Cargando transmisión…</p>
          </div>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/90 px-4 text-center">
          <p className="text-sm text-white">No se pudo cargar el reproductor.</p>
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
        className={`absolute inset-0 h-full w-full ${status === "loading" ? "opacity-0" : "opacity-100"}`}
      />
    </>
  );

  const fullscreenButton =
    showNativeFullscreen && status === "ready" ? (
      <button
        type="button"
        onClick={() => requestNativeVideoFullscreen(containerRef.current)}
        className={
          stackedLayout
            ? "live-player-fullscreen-btn mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-900 shadow-sm"
            : "absolute bottom-3 right-3 z-20 rounded-full border border-white/30 bg-black/75 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm"
        }
        aria-label="Pantalla completa"
      >
        Pantalla completa
      </button>
    ) : null;

  if (stackedLayout) {
    return (
      <div className="live-player-stack w-full">
        <div
          data-live-player-frame
          className="live-player-frame-native relative aspect-video w-full overflow-hidden bg-black"
        >
          {playerViewport}
        </div>
        {fullscreenButton}
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {playerViewport}
      {fullscreenButton}
    </div>
  );
}
