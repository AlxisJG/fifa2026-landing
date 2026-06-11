/**
 * Ad inventory gate — placeholder slots stay hidden until real creatives are configured.
 * Set NEXT_PUBLIC_ENABLE_AD_SLOTS=true when ready to show placeholder or live units.
 */
export function isAdsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_AD_SLOTS === "true";
}

/**
 * GAM unit below the live player on `/transmision` — not gated by `NEXT_PUBLIC_ENABLE_AD_SLOTS`.
 * Kill switch only: `NEXT_PUBLIC_DISABLE_GAM_TRANSMISSION_AD=true`.
 */
export function isGamTransmissionPlayerAdEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DISABLE_GAM_TRANSMISSION_AD !== "true";
}
