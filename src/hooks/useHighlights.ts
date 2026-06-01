"use client";

import { useEffect, useState } from "react";
import type { HighlightItem } from "@/lib/highlights-types";

export function useHighlights() {
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/highlights")
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data)) {
          setItems(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { items, loading };
}
