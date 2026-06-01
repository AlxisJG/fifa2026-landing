import type { Fixture, FixturePhase } from "./types";
import { FIXTURE_STAGE_LABELS } from "./formatters";
import { DOMINICAN_TIMEZONE, LOCALE_RD } from "@/lib/datetime-rd";
import { isWorldCupFirstMatchDayReached } from "@/lib/world-cup-kickoff";

export const FIXTURE_TABS = ["Today", "Tomorrow", "Group Stage", "Knockout"] as const;
export type FixtureTab = (typeof FIXTURE_TABS)[number];

function toCalendarKey(date: Date, timeZone = DOMINICAN_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function getFixtureDateKey(startsAt: string): string {
  return toCalendarKey(new Date(startsAt));
}

export function formatFixtureDateLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat(LOCALE_RD, {
    timeZone: DOMINICAN_TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

export function getFixtureDateOptions(fixtures: Fixture[]): string[] {
  const keys = new Set(fixtures.map((fixture) => getFixtureDateKey(fixture.startsAt)));
  return [...keys].sort();
}

export function filterFixturesByDate(fixtures: Fixture[], dateKey: string | null): Fixture[] {
  if (!dateKey) return fixtures;
  return fixtures.filter((fixture) => getFixtureDateKey(fixture.startsAt) === dateKey);
}

export function sortFixturesByKickoff(fixtures: Fixture[]): Fixture[] {
  return [...fixtures].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
}

export function isFixtureToday(startsAt: string, now = new Date()): boolean {
  return toCalendarKey(new Date(startsAt)) === toCalendarKey(now);
}

export function isFixtureTomorrow(startsAt: string, now = new Date()): boolean {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toCalendarKey(new Date(startsAt)) === toCalendarKey(tomorrow);
}

export function getFixtureDisplayStage(fixture: Pick<Fixture, "startsAt" | "phase">): FixtureTab {
  if (isFixtureToday(fixture.startsAt)) return "Today";
  if (isFixtureTomorrow(fixture.startsAt)) return "Tomorrow";
  return fixture.phase;
}

export function getFixtureDisplayStageLabel(fixture: Pick<Fixture, "startsAt" | "phase">): string {
  return FIXTURE_STAGE_LABELS[getFixtureDisplayStage(fixture)];
}

export function filterFixturesByTab(fixtures: Fixture[], tab: FixtureTab): Fixture[] {
  switch (tab) {
    case "Today":
      return fixtures.filter((f) => isFixtureToday(f.startsAt));
    case "Tomorrow":
      return fixtures.filter((f) => isFixtureTomorrow(f.startsAt));
    case "Group Stage":
      return fixtures.filter((f) => f.phase === "Group Stage");
    case "Knockout":
      return fixtures.filter((f) => f.phase === "Knockout");
  }
}

export function countFixturesByTab(fixtures: Fixture[]): Record<FixtureTab, number> {
  return {
    Today: fixtures.filter((f) => isFixtureToday(f.startsAt)).length,
    Tomorrow: fixtures.filter((f) => isFixtureTomorrow(f.startsAt)).length,
    "Group Stage": fixtures.filter((f) => f.phase === "Group Stage").length,
    Knockout: fixtures.filter((f) => f.phase === "Knockout").length
  };
}

export function isDayFixtureTab(tab: FixtureTab): boolean {
  return tab === "Today" || tab === "Tomorrow";
}

/**
 * Hoy / Mañana: hidden until the opening-match calendar day (CountdownWidget date).
 * Eliminatorias: hidden when there are no knockout fixtures.
 */
export function isFixtureTabVisible(
  tab: FixtureTab,
  counts: Record<FixtureTab, number>,
  at = Date.now()
): boolean {
  if (isDayFixtureTab(tab)) {
    return isWorldCupFirstMatchDayReached(at);
  }
  if (tab === "Knockout") {
    return counts.Knockout > 0;
  }
  return true;
}

export function getVisibleFixtureTabs(
  counts: Record<FixtureTab, number>,
  at = Date.now()
): FixtureTab[] {
  return FIXTURE_TABS.filter((tab) => isFixtureTabVisible(tab, counts, at));
}

export function getDefaultFixtureTab(
  counts: Record<FixtureTab, number>,
  at = Date.now()
): FixtureTab {
  const visible = getVisibleFixtureTabs(counts, at);
  if (visible.includes("Today") && counts.Today > 0) return "Today";
  if (visible.includes("Group Stage")) return "Group Stage";
  if (visible.includes("Tomorrow") && counts.Tomorrow > 0) return "Tomorrow";
  if (visible.includes("Knockout")) return "Knockout";
  return "Group Stage";
}

export type { FixturePhase };
