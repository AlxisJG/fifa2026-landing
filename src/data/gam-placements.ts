export type GamSizeMappingBreakpoint = {
  /** Ancho mínimo del viewport [width, height] — GPT usa el primer match de arriba hacia abajo. */
  viewport: [number, number];
  sizes: [number, number][];
};

export type GamSlotConfig = {
  adUnitPath: string;
  slotId: string;
  sizes: [number, number][];
  /** Restringe qué tamaños puede pedir GAM según el viewport (evita mezclar desktop/mobile). */
  sizeMapping?: GamSizeMappingBreakpoint[];
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
  slotId: "div-gpt-ad-1781227543176-0",
  sizes: [
    [970, 90],
    [728, 90],
    [320, 50],
    [300, 50]
  ],
  sizeMapping: [
    { viewport: [1024, 0], sizes: [[970, 90], [728, 90]] },
    { viewport: [768, 0], sizes: [[728, 90]] },
    { viewport: [0, 0], sizes: [[320, 50], [300, 50]] }
  ],
  minWidth: 300,
  minHeight: 50
};

/** Unidad de prueba oficial de Google — siempre entrega creativo en localhost. */
export const transmissionPlayerGamTestSlot: GamSlotConfig = {
  adUnitPath: "/6355419/Travel",
  slotId: "div-gpt-ad-transmission-test",
  sizes: [
    [970, 90],
    [728, 90],
    [320, 50],
    [300, 50]
  ],
  sizeMapping: transmissionPlayerGamSlot.sizeMapping,
  minWidth: 300,
  minHeight: 50
};

function parseEnvFlag(value: string | undefined): boolean {
  if (!value?.trim()) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

/**
 * En desarrollo usa la unidad demo de Google por defecto (creativo garantizado).
 * Pon NEXT_PUBLIC_GAM_USE_PRODUCTION_UNIT=true para probar Bri001 en local.
 */
export function getTransmissionPlayerGamSlot(): GamSlotConfig {
  const forceProduction = parseEnvFlag(process.env.NEXT_PUBLIC_GAM_USE_PRODUCTION_UNIT);
  const useTestUnit = parseEnvFlag(process.env.NEXT_PUBLIC_GAM_USE_TEST_UNIT);

  if (forceProduction) {
    return transmissionPlayerGamSlot;
  }

  if (process.env.NODE_ENV === "development" || useTestUnit) {
    return transmissionPlayerGamTestSlot;
  }

  return transmissionPlayerGamSlot;
}
