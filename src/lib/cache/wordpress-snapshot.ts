import { Redis } from "@upstash/redis";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type SnapshotEnvelope<T> = {
  savedAt: string;
  data: T;
};

const SNAPSHOT_DIR =
  process.env.WP_SNAPSHOT_DIR?.trim() ||
  path.join(process.cwd(), ".wp-cache");

let redisClient: Redis | null | undefined;

function resolveRedisCredentials(): { url: string; token: string } | null {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (upstashUrl && upstashToken) {
    return { url: upstashUrl, token: upstashToken };
  }

  // Vercel Storage integration (database name prefix, e.g. FIFAPIO_KV_*).
  const kvUrl = process.env.FIFAPIO_KV_REST_API_URL?.trim();
  const kvToken = process.env.FIFAPIO_KV_REST_API_TOKEN?.trim();
  if (kvUrl && kvToken) {
    return { url: kvUrl, token: kvToken };
  }

  return null;
}

function getRedis(): Redis | null {
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

function snapshotKey(namespace: string) {
  return `wp:snapshot:${namespace}`;
}

async function readFileSnapshot<T>(namespace: string): Promise<T | null> {
  try {
    const filePath = path.join(SNAPSHOT_DIR, `${namespace}.json`);
    const raw = await readFile(filePath, "utf8");
    const envelope = JSON.parse(raw) as SnapshotEnvelope<T>;
    return envelope?.data ?? null;
  } catch {
    return null;
  }
}

async function writeFileSnapshot<T>(namespace: string, data: T): Promise<void> {
  try {
    await mkdir(SNAPSHOT_DIR, { recursive: true });
    const envelope: SnapshotEnvelope<T> = { savedAt: new Date().toISOString(), data };
    await writeFile(path.join(SNAPSHOT_DIR, `${namespace}.json`), JSON.stringify(envelope), "utf8");
  } catch {
    // Best-effort; on Vercel the filesystem is ephemeral.
  }
}

async function readRedisSnapshot<T>(namespace: string): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const envelope = await redis.get<SnapshotEnvelope<T>>(snapshotKey(namespace));
    return envelope?.data ?? null;
  } catch {
    return null;
  }
}

async function writeRedisSnapshot<T>(namespace: string, data: T): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const envelope: SnapshotEnvelope<T> = { savedAt: new Date().toISOString(), data };
    await redis.set(snapshotKey(namespace), envelope);
  } catch {
    // Best-effort persistence.
  }
}

/** Read the last successful WordPress payload for a namespace. */
export async function readWordPressSnapshot<T>(namespace: string): Promise<T | null> {
  const redis = await readRedisSnapshot<T>(namespace);
  if (redis) return redis;
  return readFileSnapshot<T>(namespace);
}

/** Persist the last successful WordPress payload for a namespace. */
export async function writeWordPressSnapshot<T>(namespace: string, data: T): Promise<void> {
  await Promise.all([writeRedisSnapshot(namespace, data), writeFileSnapshot(namespace, data)]);
}

/**
 * Try live fetch first; on success persist snapshot.
 * On failure, return the last snapshot if available.
 */
export async function withWordPressSnapshot<T>(
  namespace: string,
  fetchLive: () => Promise<T | null>
): Promise<T | null> {
  try {
    const live = await fetchLive();
    if (live != null) {
      void writeWordPressSnapshot(namespace, live);
      return live;
    }
  } catch {
    // Fall through to snapshot.
  }

  return readWordPressSnapshot<T>(namespace);
}
