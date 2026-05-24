import type { Fixture } from "./types";

const LOCALE = "es-DO";

export function formatKickoffEs(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString(LOCALE, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit"
  });
}

export function formatRoundLabelEs(round?: string): string {
  if (!round?.trim()) return "Fase de grupos";

  const normalized = round.trim();
  const groupMatch = normalized.match(/group\s*([A-Za-z])/i);
  if (groupMatch) {
    return `Grupo ${groupMatch[1].toUpperCase()} — Fase de grupos`;
  }

  const lower = normalized.toLowerCase();
  if (lower.includes("round of 16") || lower.includes("1/8")) return "Octavos de final";
  if (lower.includes("quarter")) return "Cuartos de final";
  if (lower.includes("semi")) return "Semifinal";
  if (lower.includes("3rd") || lower.includes("third")) return "Tercer puesto";
  if (lower.includes("final")) return "Final";

  return normalized.replace(/group/gi, "Grupo").replace(" - ", " — ");
}

export function formatStandingsGroupEs(group?: string): string {
  if (!group?.trim()) return "Grupo A";
  return group.replace(/group/gi, "Grupo");
}

export function formatVenueEs(venue?: { name?: string; city?: string } | null): string {
  if (!venue?.name) return "Por confirmar";
  if (venue.city && !venue.name.toLowerCase().includes(venue.city.toLowerCase())) {
    return `${venue.name}, ${venue.city}`;
  }
  return venue.name;
}

export function stageFromLeagueRound(round?: string): Fixture["stage"] {
  if (!round) return "Group Stage";
  const r = round.toLowerCase();
  if (r.includes("group")) return "Group Stage";
  if (r.includes("round") || r.includes("quarter") || r.includes("semi") || r.includes("final")) {
    return "Knockout";
  }
  return "Group Stage";
}

export function resolveFixtureStage(round: string | undefined, date: Date, now = new Date()): Fixture["stage"] {
  let stage: Fixture["stage"] = stageFromLeagueRound(round);
  const diffHrs = (date.getTime() - now.getTime()) / 3600000;
  if (diffHrs >= 0 && diffHrs < 24) stage = "Today";
  else if (diffHrs >= 24 && diffHrs < 48) stage = "Tomorrow";
  return stage;
}

export const FIXTURE_STAGE_LABELS: Record<Fixture["stage"], string> = {
  Today: "Hoy",
  Tomorrow: "Mañana",
  "Group Stage": "Fase de grupos",
  Knockout: "Eliminatorias"
};
