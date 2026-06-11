/** SportMonks returns kickoff timestamps in UTC (often without a Z suffix). */
export function parseSportmonksStartingAt(value: string | undefined | null): Date {
  const trimmed = value?.trim();
  if (!trimmed) return new Date(NaN);

  if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(trimmed)) {
    return new Date(trimmed);
  }

  const normalized = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  return new Date(`${normalized}Z`);
}

export function sportmonksStartingAtToIso(value: string | undefined | null): string {
  const date = parseSportmonksStartingAt(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : new Date().toISOString();
}
