"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import {
  BRIGHTCOVE_LIVE_ACCOUNT_ID,
  BRIGHTCOVE_LIVE_PLAYER_SCRIPT,
  BRIGHTCOVE_LIVE_PLAYBACK_TOKEN,
  BRIGHTCOVE_LIVE_PLAYER_ID,
  BRIGHTCOVE_LIVE_VIDEO_ID
} from "@/lib/brightcove-live-config";

type BrightcoveLivePlayerProps = {
  className?: string;
};

export function BrightcoveLivePlayer({ className = "" }: BrightcoveLivePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.querySelector("video-js")) return;

    const player = document.createElement("video-js");
    player.setAttribute("data-account", BRIGHTCOVE_LIVE_ACCOUNT_ID);
    player.setAttribute("data-player", BRIGHTCOVE_LIVE_PLAYER_ID);
    player.setAttribute("data-embed", "default");
    player.setAttribute("data-video-id", BRIGHTCOVE_LIVE_VIDEO_ID);
    player.setAttribute("data-live-playback-token", BRIGHTCOVE_LIVE_PLAYBACK_TOKEN);
    player.setAttribute("data-application-id", "");
    player.setAttribute("controls", "");
    player.className = `h-full w-full ${className}`.trim();
    container.appendChild(player);
  }, [className]);

  return (
    <>
      <Script src={BRIGHTCOVE_LIVE_PLAYER_SCRIPT} strategy="afterInteractive" />
      <div ref={containerRef} className="h-full w-full" />
    </>
  );
}
