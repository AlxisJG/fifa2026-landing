import {
  BRIGHTCOVE_LIVE_PLAYBACK_TOKEN,
  BRIGHTCOVE_LIVE_VIDEO_ID
} from "@/lib/brightcove-live-config";

/** Segmentos HLS de 6s; toleramos ~30s de retraso antes de marcar sin señal. */
const MAX_SEGMENT_AGE_MS = 30_000;

export type BrightcoveLiveStreamStatus = {
  active: boolean;
  lastSegmentAt: string | null;
  error?: string;
};

function parseProgramDateTimes(manifest: string): string[] {
  return [...manifest.matchAll(/#EXT-X-PROGRAM-DATE-TIME:(.+)/g)].map((match) => match[1].trim());
}

function isRecentSegment(timestamp: string, now = Date.now()): boolean {
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) return false;
  const age = now - parsed;
  return age >= 0 && age <= MAX_SEGMENT_AGE_MS;
}

export async function getBrightcoveLiveStreamStatus(): Promise<BrightcoveLiveStreamStatus> {
  try {
    const playbackRes = await fetch(
      `https://api.live.brightcove.com/v2/playback/${BRIGHTCOVE_LIVE_VIDEO_ID}?pt=${encodeURIComponent(BRIGHTCOVE_LIVE_PLAYBACK_TOKEN)}`,
      { cache: "no-store" }
    );

    if (!playbackRes.ok) {
      return { active: false, lastSegmentAt: null, error: "playback_url_unavailable" };
    }

    const playback = (await playbackRes.json()) as { url?: string };
    if (!playback.url) {
      return { active: false, lastSegmentAt: null, error: "playback_url_missing" };
    }

    const manifestBase = playback.url.replace(/\/playlist-hls\.m3u8$/, "");
    const chunklistRes = await fetch(`${manifestBase}/chunklist_hls720p.m3u8`, { cache: "no-store" });

    if (!chunklistRes.ok) {
      return { active: false, lastSegmentAt: null, error: "chunklist_unavailable" };
    }

    const chunklist = await chunklistRes.text();

    if (chunklist.includes("#EXT-X-ENDLIST")) {
      return { active: false, lastSegmentAt: null };
    }

    const timestamps = parseProgramDateTimes(chunklist);
    if (timestamps.length === 0) {
      const hasSegments = /#EXTINF:/.test(chunklist);
      return { active: hasSegments, lastSegmentAt: null };
    }

    const lastSegmentAt = timestamps[timestamps.length - 1];
    return {
      active: isRecentSegment(lastSegmentAt),
      lastSegmentAt
    };
  } catch {
    return { active: false, lastSegmentAt: null, error: "status_check_failed" };
  }
}
