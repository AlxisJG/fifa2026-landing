function parsePositiveInt(raw: string | undefined, fallback: number): number {
  const value = Number(raw?.trim());
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

/** Redis snapshot + CDN cache for noticias/galería — default 3 hours. */
export const WORDPRESS_SNAPSHOT_REVALIDATE_SECONDS = parsePositiveInt(
  process.env.WP_SNAPSHOT_REVALIDATE_SECONDS,
  3 * 60 * 60
);

/** @deprecated alias — use WORDPRESS_SNAPSHOT_REVALIDATE_SECONDS */
export const WORDPRESS_CACHE_SECONDS = WORDPRESS_SNAPSHOT_REVALIDATE_SECONDS;

/** Serve stale CDN responses while revalidating in the background. */
export const WORDPRESS_STALE_WHILE_REVALIDATE_SECONDS = WORDPRESS_SNAPSHOT_REVALIDATE_SECONDS;

export function wordpressFetchCache() {
  return { next: { revalidate: WORDPRESS_CACHE_SECONDS } } as const;
}

export function wordpressCdnCacheHeaders(): HeadersInit {
  return {
    "Cache-Control": `public, s-maxage=${WORDPRESS_CACHE_SECONDS}, stale-while-revalidate=${WORDPRESS_STALE_WHILE_REVALIDATE_SECONDS}`
  };
}
