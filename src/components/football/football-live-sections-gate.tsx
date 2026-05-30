"use client";

import type { ReactNode } from "react";
import { useFootballLiveSectionsVisible } from "@/contexts/football-live-sections-context";

/** Renders children only when live football sections are allowed (prod gate or dev). */
export function FootballLiveSectionsGate({ children }: { children: ReactNode }) {
  const visible = useFootballLiveSectionsVisible();
  if (!visible) return null;
  return children;
}
