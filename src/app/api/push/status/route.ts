import { NextResponse } from "next/server";
import { getKvRedis } from "@/lib/kv/redis";
import { getKvEnvDiagnostics, hasKvCredentialsConfigured } from "@/lib/kv/redis-diagnostics";
import { isPushNotificationsEnabled } from "@/lib/push/config";
import { isFirebaseAdminConfigured } from "@/lib/push/firebase-admin";
import { listPushTokens } from "@/lib/push/token-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = getKvEnvDiagnostics();
  const redis = getKvRedis();
  let redisPing: "ok" | "fail" | "skipped" = "skipped";

  if (redis) {
    try {
      const result = await redis.ping();
      redisPing = result === "PONG" ? "ok" : "fail";
    } catch {
      redisPing = "fail";
    }
  }

  let tokenCount = 0;
  if (redisPing === "ok") {
    try {
      tokenCount = (await listPushTokens()).length;
    } catch {
      tokenCount = -1;
    }
  }

  return NextResponse.json({
    ok: true,
    pushEnabled: isPushNotificationsEnabled(),
    firebaseAdmin: isFirebaseAdminConfigured(),
    redisConfigured: hasKvCredentialsConfigured(),
    redisClient: Boolean(redis),
    redisPing,
    tokenCount: tokenCount >= 0 ? tokenCount : null,
    env
  });
}
