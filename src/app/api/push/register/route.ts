import { NextResponse } from "next/server";
import { isPushNotificationsEnabled } from "@/lib/push/config";
import { isFirebaseAdminConfigured } from "@/lib/push/firebase-admin";
import { removePushToken, savePushToken } from "@/lib/push/token-store";
import type { PushPlatform } from "@/lib/push/types";
import { isLikelyFcmToken } from "@/lib/push/validate-token";

export const dynamic = "force-dynamic";

function parsePlatform(value: unknown): PushPlatform {
  if (value === "ios" || value === "android" || value === "web") return value;
  return "unknown";
}

export async function POST(request: Request) {
  try {
    if (!isPushNotificationsEnabled()) {
      return NextResponse.json({ ok: false, error: "push_disabled" }, { status: 503 });
    }

    let body: { token?: string; platform?: string };
    try {
      body = (await request.json()) as { token?: string; platform?: string };
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    const token = body.token?.trim();
    if (!token || !isLikelyFcmToken(token)) {
      return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
    }

    const platform = parsePlatform(body.platform);
    const saved = await savePushToken(token, platform);

    if (!saved) {
      return NextResponse.json({ ok: false, error: "kv_unavailable" }, { status: 503 });
    }

    return NextResponse.json({
      ok: true,
      platform,
      firebaseAdmin: isFirebaseAdminConfigured()
    });
  } catch {
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  let body: { token?: string };
  try {
    body = (await request.json()) as { token?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const token = body.token?.trim();
  if (!token) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
  }

  await removePushToken(token);
  return NextResponse.json({ ok: true });
}
