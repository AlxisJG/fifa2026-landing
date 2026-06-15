import {
  parseMatchPollWindow,
  type MatchPollWindow,
  type SerializedMatchPollWindow
} from "@/lib/live-transmission-poll-schedule";

export async function fetchMatchPollWindows(): Promise<MatchPollWindow[]> {
  const res = await fetch("/api/stream/schedule");
  if (!res.ok) return [];
  const payload = (await res.json()) as { windows?: SerializedMatchPollWindow[] };
  return (payload.windows ?? [])
    .map(parseMatchPollWindow)
    .filter((window) => Number.isFinite(window.kickoffMs));
}
