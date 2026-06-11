export type GamSlotConfig = {
  adUnitPath: string;
  slotId: string;
  sizes: [number, number][];
  minWidth: number;
  minHeight: number;
};

/**
 * Debajo del reproductor Brightcove en `/transmision`.
 * Sustituye el placeholder `leaderboard-live-player` (ad-placements.liveStreamPlayer).
 * Siempre activo en producción — no depende de `NEXT_PUBLIC_ENABLE_AD_SLOTS`.
 */
export const transmissionPlayerGamSlot: GamSlotConfig = {
  adUnitPath: "/22818118543/Bri001",
  slotId: "div-gpt-ad-1781205455759-0",
  sizes: [
    [970, 90],
    [728, 90],
    [320, 50],
    [300, 50]
  ],
  minWidth: 300,
  minHeight: 50
};
