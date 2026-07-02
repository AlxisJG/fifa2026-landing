import { NextResponse } from "next/server";
import { footballDataProvider } from "@/lib/football-api/provider";
import { getSiteOrigin, isPushNotificationsEnabled } from "@/lib/push/config";
import { isCronAuthorized } from "@/lib/push/cron-auth";
import { sendPushToTokens } from "@/lib/push/firebase-admin";
import { listPushTokens, markPushSent, removePushToken } from "@/lib/push/token-store";

export const dynamic = "force-dynamic";

const REMINDER_LEAD_MS = 60 * 60 * 1000;
const REMINDER_WINDOW_MS = 5 * 60 * 1000;

function formatKickoffEs(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-DO", {
      timeZone: "America/Santo_Domingo",
      hour: "numeric",
      minute: "2-digit"
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (!isPushNotificationsEnabled()) {
    return NextResponse.json({ ok: false, error: "push_disabled" }, { status: 503 });
  }

  const now = Date.now();
  const fixturesRes = await footballDataProvider.getFixtures();
  const dueFixtures = fixturesRes.data.filter((fixture) => {
    const kickoffMs = new Date(fixture.startsAt).getTime();
    if (!Number.isFinite(kickoffMs)) return false;
    const delta = kickoffMs - now;
    return delta >= REMINDER_LEAD_MS - REMINDER_WINDOW_MS && delta <= REMINDER_LEAD_MS + REMINDER_WINDOW_MS;
  });

  const tokens = await listPushTokens();
  if (tokens.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, reason: "no_tokens" });
  }

  const origin = getSiteOrigin();
  let sent = 0;

  for (const fixture of dueFixtures) {
    const dedupeKey = `push:sent:match-reminder:${fixture.id}`;
    const acquired = await markPushSent(dedupeKey, 60 * 60 * 6);
    if (!acquired) continue;

    const kickoffLabel = formatKickoffEs(fixture.startsAt);
    const title = "Partido en 1 hora";
    const body = kickoffLabel
      ? `${fixture.home} vs ${fixture.away} · ${kickoffLabel}`
      : `${fixture.home} vs ${fixture.away}`;

    const result = await sendPushToTokens(
      tokens.map((entry) => entry.token),
      {
        title,
        body,
        url: `${origin}/partidos`,
        tag: `match-reminder-${fixture.id}`
      }
    );

    for (const invalid of result.invalidTokens) {
      await removePushToken(invalid);
    }

    sent += 1;
  }

  return NextResponse.json({
    ok: true,
    checked: dueFixtures.length,
    sent
  });
}
