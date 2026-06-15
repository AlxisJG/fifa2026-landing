import { TRANSMISSION_ROTATING_SPONSORS } from "@/data/sponsor-banner-assets";

/** Cada patrocinador visible ~30 s antes de pasar al siguiente. */
export const TRANSMISSION_SPONSOR_ROTATION_MS = 30_000;

export function getTransmissionSponsorIndex(at = Date.now()): number {
  return Math.floor(at / TRANSMISSION_SPONSOR_ROTATION_MS) % TRANSMISSION_ROTATING_SPONSORS.length;
}

export function getTransmissionRotatingSponsor(at = Date.now()) {
  return TRANSMISSION_ROTATING_SPONSORS[getTransmissionSponsorIndex(at)];
}
