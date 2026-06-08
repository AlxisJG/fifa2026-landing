/** WordPress / FIFApp feed — refresh at most every 5 minutes. */
export const WORDPRESS_CACHE_SECONDS = 300;

/** Serve stale CDN responses while revalidating in the background (10 min). */
export const WORDPRESS_STALE_WHILE_REVALIDATE_SECONDS = 600;

export function wordpressFetchCache() {
  return { next: { revalidate: WORDPRESS_CACHE_SECONDS } } as const;
}

export function wordpressCdnCacheHeaders(): HeadersInit {
  return {
    "Cache-Control": `public, s-maxage=${WORDPRESS_CACHE_SECONDS}, stale-while-revalidate=${WORDPRESS_STALE_WHILE_REVALIDATE_SECONDS}`
  };
}
