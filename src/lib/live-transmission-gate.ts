/** Activa la transmisión en vivo en UI y en `/transmision` (requiere también señal Brightcove). */
export function isLiveTransmissionEnabled(): boolean {
  return process.env.ENABLE_LIVE_TRANSMISSION === "true";
}
