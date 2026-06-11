import { parseSportmonksStartingAt, sportmonksStartingAtToIso } from "@/lib/football-api/datetime";
import type {
  FeaturedMatch,
  Fixture,
  SquadPlayer,
  SquadTeam,
  StandingsData,
  StandingsGroup,
  TickerItem,
  TopscorerEntry,
  TopscorersData
} from "./types";
import {
  formatKickoffEs,
  formatMatchdayEs,
  formatPlayerPositionEs,
  formatRoundLabelEs,
  formatStandingsGroupEs,
  formatVenueEs,
  stageFromLeagueRound
} from "./formatters";
import type {
  SportmonksFixture,
  SportmonksParticipant,
  SportmonksScore,
  SportmonksSquadEntry,
  SportmonksStanding,
  SportmonksTeam,
  SportmonksTopscorer
} from "./sportmonks-types";

const LIVE_STATE_PREFIXES = ["INPLAY", "HT", "BREAK", "EXTRA", "PEN"];
const PLACEHOLDER_LABEL = "Por definir";

export function isSportmonksFixtureLive(fixture: SportmonksFixture): boolean {
  const developerName = fixture.state?.developer_name;
  if (!developerName) return false;
  const upper = developerName.toUpperCase();
  return LIVE_STATE_PREFIXES.some((p) => upper.includes(p));
}

function getHomeAwayParticipants(fixture: SportmonksFixture) {
  const participants = fixture.participants ?? [];
  const home = participants.find((p) => p.meta?.location === "home") ?? participants[0];
  const away = participants.find((p) => p.meta?.location === "away") ?? participants[1];
  return { home, away };
}

function participantDisplayName(participant?: SportmonksParticipant, fallback = PLACEHOLDER_LABEL): string {
  if (!participant) return fallback;
  if (participant.placeholder && !participant.name?.trim()) return PLACEHOLDER_LABEL;
  return participant.name?.trim() || fallback;
}

function teamCode(participant?: SportmonksParticipant, fallback = "TBD"): string {
  if (!participant) return fallback;
  if (participant.placeholder) {
    const name = participant.name?.trim();
    if (name && name.length >= 2) return name.slice(0, 3).toUpperCase();
    return "TBD";
  }
  const code = participant.short_code?.trim().toUpperCase();
  if (code && code.length >= 2 && code.length <= 4) return code;
  const name = participant.name?.trim();
  if (name) return name.slice(0, 3).toUpperCase();
  return fallback;
}

function teamFlagUrl(participant?: SportmonksParticipant): string | undefined {
  if (participant?.placeholder) return undefined;
  const path = participant?.image_path;
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  if (path.includes("team_placeholder")) return undefined;
  return `https://cdn.sportmonks.com${path.startsWith("/") ? path : `/${path}`}`;
}

function getGoalsForParticipant(fixture: SportmonksFixture, participantId?: number): number | undefined {
  if (!participantId || !fixture.scores?.length) return undefined;

  const current = fixture.scores.find(
    (s: SportmonksScore) =>
      s.participant_id === participantId &&
      (s.description?.toUpperCase() === "CURRENT" ||
        s.description?.toUpperCase().includes("CURRENT") ||
        s.description === "2ND_HALF" ||
        s.description === "1ST_HALF")
  );

  const scoreEntry = current ?? fixture.scores.find((s) => s.participant_id === participantId);
  const goals = scoreEntry?.score?.goals;
  return goals != null ? goals : undefined;
}

function getRoundLabel(fixture: SportmonksFixture): string {
  const parts = [fixture.group?.name, fixture.stage?.name, fixture.round?.name].filter(Boolean);
  return parts.join(" — ") || fixture.name || "";
}

function formatMatchLabel(details?: string): string | undefined {
  if (!details?.trim()) return undefined;
  const match = details.trim().match(/match\s*(\d+)/i);
  if (match) return `Partido ${match[1]}`;
  return details.trim();
}

function getElapsedMinutes(fixture: SportmonksFixture): number | undefined {
  const state = fixture.state?.developer_name ?? "";
  const match = state.match(/(\d+)/);
  return match ? Number(match[1]) : undefined;
}

export function mapSportmonksFixtureToTickerItem(fixture: SportmonksFixture): TickerItem {
  const { home, away } = getHomeAwayParticipants(fixture);
  const homeCode = teamCode(home, "LOC");
  const awayCode = teamCode(away, "VIS");
  const live = isSportmonksFixtureLive(fixture);
  const elapsed = getElapsedMinutes(fixture);
  const elapsedLabel = elapsed != null ? ` ${elapsed}'` : "";
  const homeScore = getGoalsForParticipant(fixture, home?.id);
  const awayScore = getGoalsForParticipant(fixture, away?.id);
  const hasScore = homeScore != null && awayScore != null;

  return {
    id: String(fixture.id),
    homeCode,
    awayCode,
    homeLabel: homeCode,
    awayLabel: awayCode,
    homeScore: hasScore ? homeScore : undefined,
    awayScore: hasScore ? awayScore : undefined,
    detail: live
      ? `EN VIVO${elapsedLabel}`
      : formatKickoffEs(sportmonksStartingAtToIso(fixture.starting_at)),
    live,
    homeFlagUrl: teamFlagUrl(home),
    awayFlagUrl: teamFlagUrl(away)
  };
}

export function mapSportmonksFixtureToFixture(fixture: SportmonksFixture): Fixture {
  const { home, away } = getHomeAwayParticipants(fixture);
  const date = parseSportmonksStartingAt(fixture.starting_at);
  const kickoffIso = Number.isFinite(date.getTime())
    ? date.toISOString()
    : new Date().toISOString();
  const roundLabelRaw = getRoundLabel(fixture);
  const isPlaceholder = Boolean(fixture.placeholder);
  const homeScore = getGoalsForParticipant(fixture, home?.id);
  const awayScore = getGoalsForParticipant(fixture, away?.id);
  const hasScore = homeScore != null && awayScore != null;

  return {
    id: String(fixture.id),
    home: participantDisplayName(home, "Local"),
    away: participantDisplayName(away, "Visitante"),
    kickoffLabel: formatKickoffEs(kickoffIso),
    startsAt: kickoffIso,
    phase: stageFromLeagueRound(roundLabelRaw, fixture.stage?.name),
    live: isSportmonksFixtureLive(fixture),
    isPlaceholder,
    homePlaceholder: home?.placeholder,
    awayPlaceholder: away?.placeholder,
    groupLabel: fixture.group?.name ? formatStandingsGroupEs(fixture.group.name) : undefined,
    roundLabel: fixture.round?.name ? formatMatchdayEs(fixture.round.name) : undefined,
    venue: formatVenueEs(
      fixture.venue ? { name: fixture.venue.name, city: fixture.venue.city } : null
    ),
    matchLabel: formatMatchLabel(fixture.details),
    homeFlagUrl: teamFlagUrl(home),
    awayFlagUrl: teamFlagUrl(away),
    homeScore: hasScore ? homeScore : undefined,
    awayScore: hasScore ? awayScore : undefined
  };
}

export function mapSportmonksFixtureToFeaturedMatch(fixture: SportmonksFixture): FeaturedMatch {
  const { home, away } = getHomeAwayParticipants(fixture);

  return {
    homeCode: teamCode(home, "LOC"),
    awayCode: teamCode(away, "VIS"),
    homeName: participantDisplayName(home, "Local"),
    awayName: participantDisplayName(away, "Visitante"),
    groupLabel: formatRoundLabelEs(getRoundLabel(fixture)),
    venue: formatVenueEs(
      fixture.venue ? { name: fixture.venue.name, city: fixture.venue.city } : null
    ),
    kickoff: formatKickoffEs(sportmonksStartingAtToIso(fixture.starting_at)),
    kickoffAt: sportmonksStartingAtToIso(fixture.starting_at),
    homeFlagUrl: teamFlagUrl(home),
    awayFlagUrl: teamFlagUrl(away),
    isPlaceholder: Boolean(fixture.placeholder || home?.placeholder || away?.placeholder)
  };
}

function getStandingValue(details: SportmonksStanding["details"], code: string): number | undefined {
  const entry = details?.find(
    (d) =>
      d.type?.developer_name?.toUpperCase() === code ||
      d.type?.code?.toUpperCase() === code ||
      d.type?.name?.toUpperCase().includes(code)
  );
  return entry?.value;
}

function mapStandingRow(row: SportmonksStanding) {
  const participant = row.participant;
  const gdNum =
    getStandingValue(row.details, "OVERALL_GOAL_DIFFERENCE") ??
    getStandingValue(row.details, "GOAL_DIFFERENCE") ??
    0;
  const pts = row.points ?? getStandingValue(row.details, "OVERALL_POINTS") ?? 0;

  return {
    position: row.position ?? 0,
    team: participant?.name ?? "Equipo",
    shortCode: participant?.short_code?.trim().toUpperCase(),
    flagUrl: teamFlagUrl(participant),
    played: getStandingValue(row.details, "OVERALL_MATCHES") ?? 0,
    won: getStandingValue(row.details, "OVERALL_WINS") ?? 0,
    drawn: getStandingValue(row.details, "OVERALL_DRAWS") ?? 0,
    lost:
      getStandingValue(row.details, "OVERALL_LOST") ??
      getStandingValue(row.details, "OVERALL_LOSSES") ??
      0,
    gf: getStandingValue(row.details, "OVERALL_SCORED") ?? 0,
    ga: getStandingValue(row.details, "OVERALL_CONCEDED") ?? 0,
    pts,
    gd: `${gdNum > 0 ? "+" : ""}${gdNum}`,
    isPlaceholder: participant?.placeholder
  };
}

export function mapSportmonksStandings(standings: SportmonksStanding[]): StandingsData {
  if (!standings.length) {
    return { groups: [{ group: "Grupo A", rows: [] }] };
  }

  const byGroup = new Map<string, SportmonksStanding[]>();
  for (const row of standings) {
    const key = row.group?.name ?? "default";
    const list = byGroup.get(key) ?? [];
    list.push(row);
    byGroup.set(key, list);
  }

  const groups: StandingsGroup[] = Array.from(byGroup.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupName, rows]) => {
      const sorted = rows.slice().sort((a, b) => (a.position ?? 99) - (b.position ?? 99));
      return {
        group: formatStandingsGroupEs(groupName === "default" ? undefined : groupName),
        rows: sorted.map(mapStandingRow)
      };
    });

  return { groups };
}

function topscorerTypeBucket(type?: SportmonksTopscorer["type"]): keyof TopscorersData | null {
  const dev = type?.developer_name?.toUpperCase() ?? "";
  const code = type?.code?.toUpperCase() ?? "";
  const name = type?.name?.toLowerCase() ?? "";
  if (dev.includes("GOAL") || code.includes("GOAL") || name.includes("goal")) return "goals";
  if (dev.includes("ASSIST") || code.includes("ASSIST") || name.includes("assist")) return "assists";
  if (dev.includes("CARD") || code.includes("CARD") || name.includes("card")) return "cards";
  return null;
}

export function mapSportmonksTopscorers(rows: SportmonksTopscorer[]): TopscorersData {
  const result: TopscorersData = { goals: [], assists: [], cards: [] };

  for (const row of rows) {
    const bucket = topscorerTypeBucket(row.type);
    if (!bucket) continue;
    const entry: TopscorerEntry = {
      playerName: row.player?.display_name ?? row.player?.name ?? "Jugador",
      teamName: row.participant?.name,
      value: row.total ?? 0,
      typeLabel: row.type?.name ?? bucket
    };
    result[bucket].push(entry);
  }

  const sortDesc = (a: TopscorerEntry, b: TopscorerEntry) => b.value - a.value;
  result.goals.sort(sortDesc);
  result.assists.sort(sortDesc);
  result.cards.sort(sortDesc);

  return {
    goals: result.goals.slice(0, 10),
    assists: result.assists.slice(0, 10),
    cards: result.cards.slice(0, 10)
  };
}

function teamImageUrl(imagePath?: string): string | undefined {
  if (!imagePath) return undefined;
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.includes("team_placeholder")) return undefined;
  return `https://cdn.sportmonks.com${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
}

/** Team list for squads tab — players loaded per team via /squads/teams/{id}. */
export function mapSportmonksTeams(teams: SportmonksTeam[]): SquadTeam[] {
  return teams
    .filter((team) => !team.placeholder)
    .slice()
    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
    .map((team) => ({
      id: team.id,
      name: team.name ?? "Equipo",
      shortCode: team.short_code ?? undefined,
      flagUrl: teamImageUrl(team.image_path),
      placeholder: false,
      players: []
    }));
}

export function mapSportmonksSquadPlayers(entries: SportmonksSquadEntry[]): SquadPlayer[] {
  return entries
    .filter((entry) => entry.player?.id)
    .slice()
    .sort((a, b) => (a.jersey_number ?? 999) - (b.jersey_number ?? 999))
    .map((entry) => ({
      id: entry.player!.id,
      name: entry.player!.display_name?.trim() || entry.player!.name?.trim() || "Jugador",
      position: formatPlayerPositionEs(entry.position),
      jerseyNumber: entry.jersey_number ?? undefined
    }));
}
