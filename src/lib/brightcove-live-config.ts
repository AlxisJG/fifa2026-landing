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

export const BRIGHTCOVE_LIVE_STREAMS: BrightcoveLiveStreamConfig[] = [
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

/** Compatibilidad con imports existentes (stream principal). */
export const BRIGHTCOVE_LIVE_PLAYER_ID = BRIGHTCOVE_LIVE_STREAMS[0].playerId;
export const BRIGHTCOVE_LIVE_VIDEO_ID = BRIGHTCOVE_LIVE_STREAMS[0].channelId;
export const BRIGHTCOVE_LIVE_PLAYBACK_TOKEN = BRIGHTCOVE_LIVE_STREAMS[0].playbackToken ?? "";

export function getBrightcoveLivePlayerScript(playerId: string): string {
  return `https://players.brightcove.net/${BRIGHTCOVE_LIVE_ACCOUNT_ID}/${playerId}_default/index.min.js`;
}

export const BRIGHTCOVE_LIVE_PLAYER_SCRIPT = getBrightcoveLivePlayerScript(
  BRIGHTCOVE_LIVE_PLAYER_ID
);

export function getConfiguredBrightcoveLiveStreams(): BrightcoveLiveStreamConfig[] {
  return BRIGHTCOVE_LIVE_STREAMS.filter(
    (stream) => stream.channelId.trim().length > 0 && stream.playerId.trim().length > 0
  );
}

export function getBrightcovePlaybackApiUrl(channelId: string, playbackToken?: string): string {
  const base = `https://api.live.brightcove.com/v2/playback/${channelId}`;
  if (!playbackToken?.trim()) return base;
  return `${base}?pt=${encodeURIComponent(playbackToken)}`;
}
