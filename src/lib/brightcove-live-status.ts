import {
  type BrightcoveLiveStreamConfig,
  getBrightcovePlaybackApiUrl,
  getConfiguredBrightcoveLiveStreams
} from "@/lib/brightcove-live-config";

/** Segmentos HLS de 6s; toleramos ~45s de retraso antes de marcar sin señal. */
const MAX_SEGMENT_AGE_MS = 45_000;

export type BrightcoveLiveStreamStatus = {
  id: string;
  label: string;
  active: boolean;
  lastSegmentAt: string | null;
  error?: string;
};

function parseProgramDateTimes(manifest: string): string[] {
  return [...manifest.matchAll(/#EXT-X-PROGRAM-DATE-TIME:(.+)/g)].map((match) => match[1].trim());
}

async function resolveChunklistUrl(playlistUrl: string): Promise<string | null> {
  const manifestRes = await fetch(playlistUrl, { cache: "no-store" });
  if (!manifestRes.ok) return null;

  const manifest = await manifestRes.text();
  const baseUrl = playlistUrl.replace(/[^/]+$/, "");

  for (const line of manifest.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    if (trimmed.endsWith(".m3u8")) {
      return trimmed.startsWith("http") ? trimmed : `${baseUrl}${trimmed}`;
    }
  }

  return null;
}

function isRecentSegment(timestamp: string, now = Date.now()): boolean {
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) return false;
  const age = now - parsed;
  return age >= 0 && age <= MAX_SEGMENT_AGE_MS;
}

export async function getBrightcoveLiveStreamStatus(
  stream: Pick<BrightcoveLiveStreamConfig, "id" | "label" | "channelId" | "playbackToken">
): Promise<BrightcoveLiveStreamStatus> {
  const base = {
    id: stream.id,
    label: stream.label,
    active: false,
    lastSegmentAt: null as string | null
  };

  try {
    const playbackRes = await fetch(
      getBrightcovePlaybackApiUrl(stream.channelId, stream.playbackToken),
      { cache: "no-store" }
    );

    if (!playbackRes.ok) {
      return { ...base, error: "playback_url_unavailable" };
    }

    const playback = (await playbackRes.json()) as { url?: string };
    if (!playback.url) {
      return { ...base, error: "playback_url_missing" };
    }

    const chunklistUrl = await resolveChunklistUrl(playback.url);
    if (!chunklistUrl) {
      return { ...base, error: "chunklist_unavailable" };
    }

    const chunklistRes = await fetch(chunklistUrl, { cache: "no-store" });
    if (!chunklistRes.ok) {
      return { ...base, error: "chunklist_unavailable" };
    }

    const chunklist = await chunklistRes.text();

    if (chunklist.includes("#EXT-X-ENDLIST")) {
      return base;
    }

    const timestamps = parseProgramDateTimes(chunklist);
    if (timestamps.length === 0) {
      const hasSegments = /#EXTINF:/.test(chunklist);
      return { ...base, active: hasSegments };
    }

    const lastSegmentAt = timestamps[timestamps.length - 1];
    return {
      ...base,
      active: isRecentSegment(lastSegmentAt),
      lastSegmentAt
    };
  } catch {
    return { ...base, error: "status_check_failed" };
  }
}

export async function getAllBrightcoveLiveStreamsStatus(): Promise<BrightcoveLiveStreamStatus[]> {
  const streams = getConfiguredBrightcoveLiveStreams();
  return Promise.all(streams.map((stream) => getBrightcoveLiveStreamStatus(stream)));
}
