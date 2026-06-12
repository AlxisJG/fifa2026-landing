/**
 * Ad inventory gate — placeholder slots stay hidden until real creatives are configured.
 * Set NEXT_PUBLIC_ENABLE_AD_SLOTS=true when ready to show placeholder or live units.
 *
 * Patrocinadores con arte propio (Brugal en /noticias, Brillante en /transmision) no usan esta flag.
 */
export function isAdsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_AD_SLOTS === "true";
}
