import { parseSportmonksStartingAt } from "@/lib/football-api/datetime";
import type { SportmonksFixture } from "./sportmonks-types";

function kickoffMs(fixture: SportmonksFixture): number {
  return parseSportmonksStartingAt(fixture.starting_at).getTime();
}

function fixtureRichness(fixture: SportmonksFixture): number {
  let score = 0;
  if ((fixture.scores?.length ?? 0) > 0) score += 4;
  if (fixture.state?.developer_name) score += 2;
  if ((fixture.participants?.length ?? 0) >= 2) score += 1;
  return score;
}

/** Overlay livescores / fixtures con scores sobre filas del schedule (sin includes). */
export function mergeSportmonksFixtures(
  base: SportmonksFixture[],
  overlays: SportmonksFixture[]
): SportmonksFixture[] {
  const map = new Map<number, SportmonksFixture>();

  for (const fixture of base) {
    map.set(fixture.id, fixture);
  }

  for (const overlay of overlays) {
    const existing = map.get(overlay.id);
    if (!existing) {
      map.set(overlay.id, overlay);
      continue;
    }

    const preferOverlay = fixtureRichness(overlay) >= fixtureRichness(existing);
    const primary = preferOverlay ? overlay : existing;
    const secondary = preferOverlay ? existing : overlay;

    map.set(overlay.id, {
      ...secondary,
      ...primary,
      participants: primary.participants?.length ? primary.participants : secondary.participants,
      scores: primary.scores?.length ? primary.scores : secondary.scores,
      state: primary.state ?? secondary.state,
      venue: primary.venue ?? secondary.venue,
      round: primary.round ?? secondary.round,
      stage: primary.stage ?? secondary.stage,
      group: primary.group ?? secondary.group
    });
  }

  return [...map.values()].sort((a, b) => kickoffMs(a) - kickoffMs(b));
}
