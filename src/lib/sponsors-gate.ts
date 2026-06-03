/**
 * Sponsor logo wall — hidden until real partner assets are ready.
 * Set NEXT_PUBLIC_ENABLE_SPONSOR_LOGOS=true when logos are uploaded.
 */
export function isSponsorLogosEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_SPONSOR_LOGOS === "true";
}
