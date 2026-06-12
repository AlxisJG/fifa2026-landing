/**
 * Ad inventory gate — placeholder slots stay hidden until real creatives are configured.
 * Set NEXT_PUBLIC_ENABLE_AD_SLOTS=true when ready to show placeholder or live units.
 */
export function isAdsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_AD_SLOTS === "true";
}
