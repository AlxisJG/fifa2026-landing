"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import {
  BRIGHTCOVE_LIVE_ACCOUNT_ID,
  type BrightcoveLiveStreamConfig,
  ACTIVE_BRIGHTCOVE_LIVE_STREAMS,
  getBrightcoveLivePlayerScript
} from "@/lib/brightcove-live-config";

type BrightcoveLivePlayerProps = {
  stream?: BrightcoveLiveStreamConfig;
  className?: string;
};

export function BrightcoveLivePlayer({
  stream = ACTIVE_BRIGHTCOVE_LIVE_STREAMS[0],
  className = ""
}: BrightcoveLivePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerScript = getBrightcoveLivePlayerScript(stream.playerId);
  const playbackToken = stream.playbackToken?.trim();

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
    if (playbackToken) {
      player.setAttribute("data-live-playback-token", playbackToken);
    }
    player.setAttribute("data-application-id", "");
    player.setAttribute("controls", "");
    player.className = `h-full w-full ${className}`.trim();
    container.appendChild(player);

    return () => {
      container.replaceChildren();
    };
  }, [className, playbackToken, stream.channelId, stream.id, stream.playerId]);

  return (
    <>
      <Script src={playerScript} strategy="afterInteractive" />
      <div ref={containerRef} className="h-full w-full" />
    </>
  );
}
