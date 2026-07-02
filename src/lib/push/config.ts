export function isPushNotificationsEnabled(): boolean {
  const value = process.env.ENABLE_PUSH_NOTIFICATIONS?.trim().toLowerCase();
  if (!value) return false;
  return value === "true" || value === "1" || value === "yes";
}

export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://fifa.piodeportes.com";
  try {
    return new URL(raw).origin;
  } catch {
    return "https://fifa.piodeportes.com";
  }
}
