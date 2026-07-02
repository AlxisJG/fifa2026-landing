export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).get("native_app") === "1") return true;
  const capacitor = (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } })
    .Capacitor;
  return capacitor?.isNativePlatform?.() ?? /Capacitor/i.test(navigator.userAgent);
}

export function isCapacitorNativePlatform(): boolean {
  return isNativeApp();
}
