import type { TopscorersData } from "@/lib/football-api/types";

export function normalizeTopscorersData(data: Partial<TopscorersData>): TopscorersData {
  return {
    goals: data.goals ?? [],
    assists: data.assists ?? [],
    yellowCards: data.yellowCards ?? [],
    redCards: data.redCards ?? [],
    cards: data.cards ?? []
  };
}
