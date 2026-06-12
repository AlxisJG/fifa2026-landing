import { unstable_cache } from "next/cache";
import { getAllBrightcoveLiveStreamsStatus } from "@/lib/brightcove-live-status";
import { isLiveTransmissionEnabled } from "@/lib/live-transmission-gate";

export type LiveStreamStatus = {
  id: string;
  label: string;
  active: boolean;
  lastSegmentAt: string | null;
  error?: string;
};

export type LiveTransmissionStatus = {
  active: boolean;
  enabled: boolean;
  available: boolean;
  lastSegmentAt: string | null;
  streams: LiveStreamStatus[];
  error?: string;
};

async function computeLiveTransmissionStatus(): Promise<LiveTransmissionStatus> {
  const enabled = isLiveTransmissionEnabled();
  const streams = await getAllBrightcoveLiveStreamsStatus();
  const activeStreams = streams.filter((stream) => stream.active);
  const lastSegmentAt =
    activeStreams
      .map((stream) => stream.lastSegmentAt)
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1) ?? null;

  return {
    active: activeStreams.length > 0,
    enabled,
    available: enabled && activeStreams.length > 0,
    lastSegmentAt,
    streams,
    error: streams.length === 0 ? "no_streams_configured" : undefined
  };
}

const getCachedLiveTransmissionStatus = unstable_cache(
  computeLiveTransmissionStatus,
  ["live-transmission-status"],
  { revalidate: 30 }
);

export async function getLiveTransmissionStatus(): Promise<LiveTransmissionStatus> {
  return getCachedLiveTransmissionStatus();
}
