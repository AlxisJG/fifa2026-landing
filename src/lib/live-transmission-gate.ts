function parseEnvFlag(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
  if (normalized === "false" || normalized === "0" || normalized === "no") return false;
  return undefined;
}

/** Activa la transmisión en vivo en UI y en `/transmision` (requiere también señal Brightcove). */
export function isLiveTransmissionEnabled(): boolean {
  const fromServer = parseEnvFlag(process.env.ENABLE_LIVE_TRANSMISSION);
  if (fromServer !== undefined) return fromServer;

  const fromPublic = parseEnvFlag(process.env.NEXT_PUBLIC_ENABLE_LIVE_TRANSMISSION);
  if (fromPublic !== undefined) return fromPublic;

  return false;
}
