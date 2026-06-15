"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BRIGHTCOVE_HIGHLIGHTS_ACCOUNT_ID,
  BRIGHTCOVE_HIGHLIGHTS_PLAYER_ID,
  BRIGHTCOVE_HIGHLIGHTS_PLAYLIST_ID
} from "@/lib/brightcove-highlights-config";
import { loadBrightcovePlayerScript } from "@/lib/brightcove-player-loader";

const PLAYER_ELEMENT_ID = "brightcove-highlights-playlist";

type PlayerStatus = "loading" | "ready" | "error";

type BrightcoveHighlightsPlaylistPlayerProps = {
  className?: string;
};

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

/** Playlist Brightcove con UI de lista — ancho completo hasta 1280px, relación 16:9. */
export function BrightcoveHighlightsPlaylistPlayer({
  className = ""
}: BrightcoveHighlightsPlaylistPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [retryKey, setRetryKey] = useState(0);

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
      disposeBrightcovePlayer(PLAYER_ELEMENT_ID);
      mountTarget.replaceChildren();

      try {
        await loadBrightcovePlayerScript(BRIGHTCOVE_HIGHLIGHTS_PLAYER_ID);
        if (cancelled || !containerRef.current) return;

        const wrapper = document.createElement("div");
        wrapper.className = "mx-auto w-full max-w-[1280px]";

        const playerEl = document.createElement("video-js");
        playerEl.setAttribute("id", PLAYER_ELEMENT_ID);
        playerEl.setAttribute("data-account", BRIGHTCOVE_HIGHLIGHTS_ACCOUNT_ID);
        playerEl.setAttribute("data-player", BRIGHTCOVE_HIGHLIGHTS_PLAYER_ID);
        playerEl.setAttribute("data-embed", "default");
        playerEl.setAttribute("data-video-id", "");
        playerEl.setAttribute("data-playlist-id", BRIGHTCOVE_HIGHLIGHTS_PLAYLIST_ID);
        playerEl.setAttribute("data-application-id", "");
        playerEl.setAttribute("controls", "");
        playerEl.className = "vjs-16-9";

        const playlistEl = document.createElement("div");
        playlistEl.className = "vjs-playlist";

        wrapper.appendChild(playerEl);
        wrapper.appendChild(playlistEl);
        containerRef.current.appendChild(wrapper);

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
      disposeBrightcovePlayer(PLAYER_ELEMENT_ID);
      container.replaceChildren();
    };
  }, [retryKey]);

  return (
    <div className={`relative mx-auto block w-full max-w-[1280px] ${className}`.trim()}>
      {status === "loading" ? (
        <div
          className="relative w-full bg-slate-100"
          style={{ paddingTop: "56.25%" }}
          aria-live="polite"
          aria-busy="true"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-300 border-t-blue-800" />
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Cargando highlights…</p>
            </div>
          </div>
        </div>
      ) : null}

      {status === "error" ? (
        <div
          className="relative w-full bg-slate-100"
          style={{ paddingTop: "56.25%" }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-sm text-slate-700">No se pudo cargar el reproductor.</p>
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-full border border-slate-300 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-50"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : null}

      <div
        ref={containerRef}
        className={status === "loading" || status === "error" ? "sr-only" : undefined}
      />
    </div>
  );
}
