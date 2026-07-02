import { Redis } from "@upstash/redis";

let redisClient: Redis | null | undefined;

function resolveRedisCredentials(): { url: string; token: string } | null {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (upstashUrl && upstashToken) {
    return { url: upstashUrl, token: upstashToken };
  }

  const kvUrl = process.env.FIFAPIO_KV_REST_API_URL?.trim();
  const kvToken = process.env.FIFAPIO_KV_REST_API_TOKEN?.trim();
  if (kvUrl && kvToken) {
    return { url: kvUrl, token: kvToken };
  }

  return null;
}

/** Shared Upstash / Vercel KV client (null if not configured). */
export function getKvRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;

  const credentials = resolveRedisCredentials();
  if (!credentials) {
    redisClient = null;
    return null;
  }

  try {
    const { url, token } = credentials;
    const usesStandardUpstashEnv =
      url === process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      token === process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

    redisClient = usesStandardUpstashEnv ? Redis.fromEnv() : new Redis({ url, token });
    return redisClient;
  } catch {
    redisClient = null;
    return null;
  }
}
