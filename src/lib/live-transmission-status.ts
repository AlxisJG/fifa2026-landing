import { getBrightcoveLiveStreamStatus } from "@/lib/brightcove-live-status";
import { isLiveTransmissionEnabled } from "@/lib/live-transmission-gate";

export type LiveTransmissionStatus = {
  active: boolean;
  enabled: boolean;
  available: boolean;
  lastSegmentAt: string | null;
  error?: string;
};

export async function getLiveTransmissionStatus(): Promise<LiveTransmissionStatus> {
  const enabled = isLiveTransmissionEnabled();
  const stream = await getBrightcoveLiveStreamStatus();

  return {
    active: stream.active,
    enabled,
    available: enabled && stream.active,
    lastSegmentAt: stream.lastSegmentAt,
    error: stream.error
  };
}
