import { CACHE_REVALIDATE } from "@/lib/football-api/sportmonks-client";

export function footballApiCacheHeaders(
  revalidateSeconds: number,
  staleMultiplier = 2
): HeadersInit {
  const stale = revalidateSeconds * staleMultiplier;
  return {
    "Cache-Control": `public, s-maxage=${revalidateSeconds}, stale-while-revalidate=${stale}`
  };
}

export const standingsApiCacheHeaders = footballApiCacheHeaders(CACHE_REVALIDATE.standings);
export const squadsApiCacheHeaders = footballApiCacheHeaders(CACHE_REVALIDATE.teams);
export const topscorersApiCacheHeaders = footballApiCacheHeaders(CACHE_REVALIDATE.topscorers);
