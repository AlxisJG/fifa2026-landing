export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  return /Capacitor/i.test(navigator.userAgent);
}

export function isCapacitorNativePlatform(): boolean {
  if (typeof window === "undefined") return false;
  const capacitor = (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } })
    .Capacitor;
  return capacitor?.isNativePlatform?.() ?? isNativeApp();
}
