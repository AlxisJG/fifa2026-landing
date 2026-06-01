"use client";

import { useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/gallery-types";

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/gallery")
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
