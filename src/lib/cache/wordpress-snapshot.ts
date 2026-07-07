import { Redis } from "@upstash/redis";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { WORDPRESS_SNAPSHOT_REVALIDATE_SECONDS } from "@/lib/cache/wordpress";

export type SnapshotEnvelope<T> = {
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

function isSnapshotFresh(savedAt: string): boolean {
  const ageMs = Date.now() - new Date(savedAt).getTime();
  return ageMs >= 0 && ageMs < WORDPRESS_SNAPSHOT_REVALIDATE_SECONDS * 1000;
}

async function readFileSnapshotEnvelope<T>(namespace: string): Promise<SnapshotEnvelope<T> | null> {
  try {
    const filePath = path.join(SNAPSHOT_DIR, `${namespace}.json`);
    const raw = await readFile(filePath, "utf8");
    const envelope = JSON.parse(raw) as SnapshotEnvelope<T>;
    if (!envelope?.savedAt || envelope.data == null) return null;
    return envelope;
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

async function readRedisSnapshotEnvelope<T>(namespace: string): Promise<SnapshotEnvelope<T> | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const envelope = await redis.get<SnapshotEnvelope<T>>(snapshotKey(namespace));
    if (!envelope?.savedAt || envelope.data == null) return null;
    return envelope;
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

async function readSnapshotEnvelope<T>(namespace: string): Promise<SnapshotEnvelope<T> | null> {
  const redis = await readRedisSnapshotEnvelope<T>(namespace);
  if (redis) return redis;
  return readFileSnapshotEnvelope<T>(namespace);
}

/** Read the last successful WordPress payload for a namespace. */
export async function readWordPressSnapshot<T>(namespace: string): Promise<T | null> {
  const envelope = await readSnapshotEnvelope<T>(namespace);
  return envelope?.data ?? null;
}

/** Persist the last successful WordPress payload for a namespace. */
export async function writeWordPressSnapshot<T>(namespace: string, data: T): Promise<void> {
  await Promise.all([writeRedisSnapshot(namespace, data), writeFileSnapshot(namespace, data)]);
}

export async function readWordPressSnapshotMeta(namespace: string): Promise<{
  savedAt: string | null;
  fresh: boolean;
  count: number;
} | null> {
  const envelope = await readSnapshotEnvelope<unknown[]>(namespace);
  if (!envelope) return null;

  return {
    savedAt: envelope.savedAt,
    fresh: isSnapshotFresh(envelope.savedAt),
    count: Array.isArray(envelope.data) ? envelope.data.length : 0
  };
}

/**
 * Serve cached Redis snapshot when fresh; otherwise fetch live and update Redis.
 * On live failure, fall back to the last snapshot (even if stale).
 */
export async function withWordPressSnapshot<T>(
  namespace: string,
  fetchLive: () => Promise<T | null>
): Promise<T | null> {
  const envelope = await readSnapshotEnvelope<T>(namespace);
  if (envelope && isSnapshotFresh(envelope.savedAt)) {
    return envelope.data;
  }

  try {
    const live = await fetchLive();
    if (live != null) {
      void writeWordPressSnapshot(namespace, live);
      return live;
    }
  } catch {
    // Fall through to snapshot.
  }

  return envelope?.data ?? null;
}

/** Bypass TTL and try a live fetch; keep the previous snapshot if live fails. */
export async function forceRefreshWordPressSnapshot<T>(
  namespace: string,
  fetchLive: () => Promise<T | null>
): Promise<{ data: T | null; refreshed: boolean; savedAt: string | null }> {
  const previous = await readSnapshotEnvelope<T>(namespace);

  try {
    const live = await fetchLive();
    if (live != null) {
      await writeWordPressSnapshot(namespace, live);
      const envelope = await readSnapshotEnvelope<T>(namespace);
      return { data: live, refreshed: true, savedAt: envelope?.savedAt ?? new Date().toISOString() };
    }
  } catch {
    // Fall through to previous snapshot.
  }

  return {
    data: previous?.data ?? null,
    refreshed: false,
    savedAt: previous?.savedAt ?? null
  };
}
