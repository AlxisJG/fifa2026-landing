import { NextResponse } from "next/server";
import { getSiteOrigin, isPushNotificationsEnabled } from "@/lib/push/config";
import { isCronAuthorized } from "@/lib/push/cron-auth";
import { sendPushToTokens } from "@/lib/push/firebase-admin";
import { getLiveTransmissionStatusFresh } from "@/lib/live-transmission-status";
import { listPushTokens, markPushSent, removePushToken } from "@/lib/push/token-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (!isPushNotificationsEnabled()) {
    return NextResponse.json({ ok: false, error: "push_disabled" }, { status: 503 });
  }

  const status = await getLiveTransmissionStatusFresh();
  if (!status.available) {
    return NextResponse.json({ ok: true, sent: 0, reason: "no_live_signal" });
  }

  const activeStreams = status.streams.filter((stream) => stream.active);
  if (activeStreams.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, reason: "no_active_streams" });
  }

  const tokens = await listPushTokens();
  if (tokens.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, reason: "no_tokens" });
  }

  const origin = getSiteOrigin();
  const dateKey = new Date().toISOString().slice(0, 10);
  let sent = 0;

  for (const stream of activeStreams) {
    const dedupeKey = `push:sent:live-start:${dateKey}:${stream.id}`;
    const acquired = await markPushSent(dedupeKey, 60 * 60 * 12);
    if (!acquired) continue;

    const result = await sendPushToTokens(
      tokens.map((entry) => entry.token),
      {
        title: "Transmisión en vivo",
        body: `${stream.label} ya está disponible en PIO Deportes.`,
        url: `${origin}/transmision`,
        tag: `live-start-${stream.id}`
      }
    );

    for (const invalid of result.invalidTokens) {
      await removePushToken(invalid);
    }

    sent += 1;
  }

  return NextResponse.json({
    ok: true,
    checked: activeStreams.length,
    sent
  });
}
