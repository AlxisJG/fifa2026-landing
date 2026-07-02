import { getKvRedis } from "@/lib/kv/redis";
import type { PushPlatform, PushTokenRecord } from "@/lib/push/types";

const TOKEN_INDEX_KEY = "push:tokens:index";

function tokenKey(token: string) {
  return `push:tokens:${token}`;
}

export async function savePushToken(token: string, platform: PushPlatform): Promise<boolean> {
  const redis = getKvRedis();
  if (!redis) return false;

  const record: PushTokenRecord = {
    token,
    platform,
    updatedAt: new Date().toISOString()
  };

  await redis.set(tokenKey(token), record);
  await redis.sadd(TOKEN_INDEX_KEY, token);
  return true;
}

export async function removePushToken(token: string): Promise<boolean> {
  const redis = getKvRedis();
  if (!redis) return false;

  await redis.del(tokenKey(token));
  await redis.srem(TOKEN_INDEX_KEY, token);
  return true;
}

export async function listPushTokens(): Promise<PushTokenRecord[]> {
  const redis = getKvRedis();
  if (!redis) return [];

  const tokenIds = await redis.smembers<string[]>(TOKEN_INDEX_KEY);
  if (!tokenIds?.length) return [];

  const records = await Promise.all(
    tokenIds.map(async (id) => redis.get<PushTokenRecord>(tokenKey(id)))
  );

  return records.filter((record): record is PushTokenRecord => Boolean(record?.token));
}

export async function markPushSent(dedupeKey: string, ttlSeconds: number): Promise<boolean> {
  const redis = getKvRedis();
  if (!redis) return false;

  const result = await redis.set(dedupeKey, "1", { nx: true, ex: ttlSeconds });
  return result === "OK";
}
