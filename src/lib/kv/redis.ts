import { Redis } from "@upstash/redis";

let redisClient: Redis | null | undefined;

function resolveRedisCredentials(): { url: string; token: string } | null {
  const candidates: Array<[string | undefined, string | undefined]> = [
    [process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN],
    [process.env.FIFAPIO_KV_REST_API_URL, process.env.FIFAPIO_KV_REST_API_TOKEN],
    [process.env.KV_REST_API_URL, process.env.KV_REST_API_TOKEN]
  ];

  for (const [url, token] of candidates) {
    const trimmedUrl = url?.trim();
    const trimmedToken = token?.trim();
    if (trimmedUrl && trimmedToken) {
      return { url: trimmedUrl, token: trimmedToken };
    }
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
