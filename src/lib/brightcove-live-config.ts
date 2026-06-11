export const BRIGHTCOVE_LIVE_ACCOUNT_ID =
  process.env.BRIGHTCOVE_LIVE_ACCOUNT_ID ?? "6416149296001";

export type BrightcoveLiveStreamConfig = {
  id: string;
  label: string;
  matchTitle: string;
  matchSubtitle?: string;
  channelId: string;
  playerId: string;
  /** Opcional — solo si el canal Brightcove requiere playback token. */
  playbackToken?: string;
};

const ALL_BRIGHTCOVE_LIVE_STREAMS: BrightcoveLiveStreamConfig[] = [
  {
    id: "live-1",
    label: "Transmisión Live #1",
    matchTitle: process.env.BRIGHTCOVE_LIVE_MATCH_TITLE ?? "Canal principal",
    matchSubtitle: process.env.BRIGHTCOVE_LIVE_MATCH_SUBTITLE ?? "Mundial FIFA 2026",
    channelId: process.env.BRIGHTCOVE_LIVE_VIDEO_ID ?? "6397475321112",
    playerId: process.env.BRIGHTCOVE_LIVE_PLAYER_ID ?? "nJQN4AMQl",
    playbackToken: process.env.BRIGHTCOVE_LIVE_PLAYBACK_TOKEN?.trim() || undefined
  },
  {
    id: "live-2",
    label: "Transmisión Live #2",
    matchTitle: process.env.BRIGHTCOVE_LIVE_2_MATCH_TITLE ?? "Canal alterno",
    matchSubtitle: process.env.BRIGHTCOVE_LIVE_2_MATCH_SUBTITLE ?? "Mundial FIFA 2026",
    channelId: process.env.BRIGHTCOVE_LIVE_2_VIDEO_ID ?? "6397679161112",
    playerId: process.env.BRIGHTCOVE_LIVE_2_PLAYER_ID ?? "nTLJhzrh9",
    playbackToken: process.env.BRIGHTCOVE_LIVE_2_PLAYBACK_TOKEN?.trim() || undefined
  }
];

/** @deprecated Usar getActiveBrightcoveLiveStreams(). */
export const BRIGHTCOVE_LIVE_STREAMS = ALL_BRIGHTCOVE_LIVE_STREAMS;

export function isBrightcoveLiveStream2Enabled(): boolean {
  return process.env.BRIGHTCOVE_LIVE_2_ENABLED === "true";
}

export function getActiveBrightcoveLiveStreams(): BrightcoveLiveStreamConfig[] {
  return ALL_BRIGHTCOVE_LIVE_STREAMS.filter((stream) => {
    if (stream.id === "live-2" && !isBrightcoveLiveStream2Enabled()) {
      return false;
    }
    return stream.channelId.trim().length > 0 && stream.playerId.trim().length > 0;
  });
}

/** Canales activos en UI y en el chequeo de señal (stream 2 desactivado por defecto). */
export const ACTIVE_BRIGHTCOVE_LIVE_STREAMS = getActiveBrightcoveLiveStreams();

/** Compatibilidad con imports existentes (stream principal). */
export const BRIGHTCOVE_LIVE_PLAYER_ID = ACTIVE_BRIGHTCOVE_LIVE_STREAMS[0]?.playerId ?? "nJQN4AMQl";
export const BRIGHTCOVE_LIVE_VIDEO_ID = ACTIVE_BRIGHTCOVE_LIVE_STREAMS[0]?.channelId ?? "6397475321112";
export const BRIGHTCOVE_LIVE_PLAYBACK_TOKEN = ACTIVE_BRIGHTCOVE_LIVE_STREAMS[0]?.playbackToken ?? "";

export function getBrightcoveLivePlayerScript(playerId: string): string {
  return `https://players.brightcove.net/${BRIGHTCOVE_LIVE_ACCOUNT_ID}/${playerId}_default/index.min.js`;
}

export const BRIGHTCOVE_LIVE_PLAYER_SCRIPT = getBrightcoveLivePlayerScript(
  BRIGHTCOVE_LIVE_PLAYER_ID
);

export function getConfiguredBrightcoveLiveStreams(): BrightcoveLiveStreamConfig[] {
  return getActiveBrightcoveLiveStreams();
}

export function getBrightcovePlaybackApiUrl(channelId: string, playbackToken?: string): string {
  const base = `https://api.live.brightcove.com/v2/playback/${channelId}`;
  if (!playbackToken?.trim()) return base;
  return `${base}?pt=${encodeURIComponent(playbackToken)}`;
}
