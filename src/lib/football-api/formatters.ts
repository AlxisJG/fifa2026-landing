import type { FixturePhase } from "./types";

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

export function formatMatchdayEs(roundName?: string): string {
  if (!roundName?.trim()) return "";
  const trimmed = roundName.trim();
  if (/^\d+$/.test(trimmed)) return `Jornada ${trimmed}`;
  return trimmed.replace(/round/gi, "Jornada");
}

export function stageFromLeagueRound(round?: string, stageName?: string): FixturePhase {
  const combined = `${stageName ?? ""} ${round ?? ""}`.toLowerCase();
  if (combined.includes("group")) return "Group Stage";
  if (
    combined.includes("round of") ||
    combined.includes("quarter") ||
    combined.includes("semi") ||
    (combined.includes("final") && !combined.includes("group"))
  ) {
    return "Knockout";
  }
  if (!round && !stageName) return "Group Stage";
  return "Group Stage";
}

export function formatPlayerPositionEs(position?: {
  name?: string;
  code?: string;
  developer_name?: string;
}): string | undefined {
  if (!position) return undefined;

  const dev = position.developer_name?.toUpperCase() ?? "";
  const code = position.code?.toLowerCase() ?? "";
  const name = position.name?.toLowerCase() ?? "";

  if (dev.includes("GOALKEEPER") || code.includes("goalkeeper") || name.includes("goalkeeper")) {
    return "Portero";
  }
  if (dev.includes("DEFENDER") || code.includes("defender") || name.includes("defender")) {
    return "Defensa";
  }
  if (dev.includes("MIDFIELD") || code.includes("midfield") || name.includes("midfield")) {
    return "Mediocampista";
  }
  if (
    dev.includes("ATTACK") ||
    dev.includes("FORWARD") ||
    code.includes("attacker") ||
    code.includes("forward") ||
    name.includes("attack") ||
    name.includes("forward")
  ) {
    return "Delantero";
  }

  return position.name?.trim() || undefined;
}

export const FIXTURE_STAGE_LABELS: Record<FixturePhase | "Today" | "Tomorrow", string> = {
  Today: "Hoy",
  Tomorrow: "Mañana",
  "Group Stage": "Fase de grupos",
  Knockout: "Eliminatorias"
};
