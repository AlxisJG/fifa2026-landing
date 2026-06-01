"use client";

import { useEffect, useState } from "react";
import type { SquadPlayer } from "@/lib/football-api/types";

export function useTeamSquad(teamId: number | null, enabled: boolean) {
  const [players, setPlayers] = useState<SquadPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!enabled || teamId == null) return;

    let active = true;
    setLoading(true);
    setError(undefined);

    fetch(`/api/football/squads/${teamId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed request: ${res.status}`);
        return res.json();
      })
      .then((payload: { data?: SquadPlayer[]; error?: string }) => {
        if (!active) return;
        setPlayers(payload.data ?? []);
        if (payload.error) setError(payload.error);
      })
      .catch((err) => {
        if (!active) return;
        setPlayers([]);
        setError(err instanceof Error ? err.message : "Failed to load squad");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [teamId, enabled]);

  return { players, loading, error };
}
