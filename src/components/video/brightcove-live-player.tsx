"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import {
  BRIGHTCOVE_LIVE_ACCOUNT_ID,
  type BrightcoveLiveStreamConfig,
  BRIGHTCOVE_LIVE_STREAMS,
  getBrightcoveLivePlayerScript
} from "@/lib/brightcove-live-config";

type BrightcoveLivePlayerProps = {
  stream?: BrightcoveLiveStreamConfig;
  className?: string;
};

export function BrightcoveLivePlayer({
  stream = BRIGHTCOVE_LIVE_STREAMS[0],
  className = ""
}: BrightcoveLivePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerScript = getBrightcoveLivePlayerScript(stream.playerId);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();

    const player = document.createElement("video-js");
    player.setAttribute("id", `brightcove-${stream.id}`);
    player.setAttribute("data-account", BRIGHTCOVE_LIVE_ACCOUNT_ID);
    player.setAttribute("data-player", stream.playerId);
    player.setAttribute("data-embed", "default");
    player.setAttribute("data-video-id", stream.channelId);
    player.setAttribute("data-live-playback-token", stream.playbackToken);
    player.setAttribute("data-application-id", "");
    player.setAttribute("controls", "");
    player.className = `h-full w-full ${className}`.trim();
    container.appendChild(player);

    return () => {
      container.replaceChildren();
    };
  }, [className, stream.channelId, stream.id, stream.playbackToken, stream.playerId]);

  if (!stream.playbackToken.trim()) {
    return (
      <div className="flex h-full min-h-[180px] w-full items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/40 px-4 text-center text-sm text-white/60">
        Token de reproducción no configurado para este canal.
      </div>
    );
  }

  return (
    <>
      <Script src={playerScript} strategy="afterInteractive" />
      <div ref={containerRef} className="h-full w-full" />
    </>
  );
}
