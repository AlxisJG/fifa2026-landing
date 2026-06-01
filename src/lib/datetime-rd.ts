/** República Dominicana — Atlantic Standard Time (UTC−4), sin horario de verano. */
export const DOMINICAN_TIMEZONE = "America/Santo_Domingo";

export const LOCALE_RD = "es-DO";

export function formatKickoffRd(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString(LOCALE_RD, {
    timeZone: DOMINICAN_TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit"
  });
}

export function formatDateRd(
  dateStr: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }
): string {
  return new Date(dateStr).toLocaleDateString(LOCALE_RD, {
    timeZone: DOMINICAN_TIMEZONE,
    ...options
  });
}
