import { flattenScheduleFixtures, getSeasonId, sportmonksFetch } from "./sportmonks-client";
import { isLiveFootballDataEnabled } from "./config";
import type { SportmonksFixture, SportmonksListResponse, SportmonksSchedule } from "./sportmonks-types";

export type SportmonksInspectSummary = {
  scheduleFixtureCount: number;
  placeholderFixtureCount: number;
  placeholderParticipantCount: number;
  knockoutFixtureCount: number;
  samplePlaceholderFixture: string | null;
  note: string;
};

function countPlaceholders(fixtures: SportmonksFixture[]) {
  let placeholderFixtureCount = 0;
  let placeholderParticipantCount = 0;
  let samplePlaceholderFixture: string | null = null;

  for (const f of fixtures) {
    if (f.placeholder) {
      placeholderFixtureCount++;
      if (!samplePlaceholderFixture) samplePlaceholderFixture = f.name ?? `Fixture ${f.id}`;
    }
    for (const p of f.participants ?? []) {
      if (p.placeholder) {
        placeholderParticipantCount++;
        if (!samplePlaceholderFixture) samplePlaceholderFixture = f.name ?? `Fixture ${f.id}`;
      }
    }
  }

  return { placeholderFixtureCount, placeholderParticipantCount, samplePlaceholderFixture };
}

/** Probe schedule endpoint for WC 2026 placeholder/TBD rows (SportMonks dummy data). */
export async function inspectSportmonksPlaceholders(): Promise<SportmonksInspectSummary | null> {
  if (!isLiveFootballDataEnabled()) return null;

  try {
    const seasonId = getSeasonId();
    const json = await sportmonksFetch<SportmonksListResponse<SportmonksSchedule>>(
      `/schedules/seasons/${seasonId}`,
      { revalidate: 0 }
    );
    const flat = flattenScheduleFixtures(json.data ?? []);
    const counts = countPlaceholders(flat);

    const knockoutFixtureCount = (json.data ?? [])
      .filter((s) => s.name && !/group stage/i.test(s.name))
      .reduce((acc, s) => acc + (s.rounds?.reduce((a, r) => a + (r.fixtures?.length ?? 0), 0) ?? 0), 0);

    let note =
      "Datos desde SportMonks API (no es el mock local de worldcup-widgets.ts). ";
    if (counts.placeholderFixtureCount === 0 && knockoutFixtureCount === 0) {
      note +=
        "Aún no hay fixtures en eliminatorias; los placeholder suelen aparecer en cruces TBD del knockout.";
    } else if (counts.placeholderFixtureCount > 0) {
      note += "Fixtures/participantes con placeholder=true son datos TBD de SportMonks.";
    }

    return {
      scheduleFixtureCount: flat.length,
      knockoutFixtureCount,
      ...counts,
      note
    };
  } catch (err) {
    return {
      scheduleFixtureCount: 0,
      placeholderFixtureCount: 0,
      placeholderParticipantCount: 0,
      knockoutFixtureCount: 0,
      samplePlaceholderFixture: null,
      note: err instanceof Error ? err.message : "Error al inspeccionar schedule"
    };
  }
}
