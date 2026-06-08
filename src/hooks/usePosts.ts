"use client";

import { useEffect, useState } from "react";
import type { PostItem } from "@/lib/posts-types";

export function usePosts(initialPosts?: PostItem[]) {
  const hasInitial = initialPosts !== undefined;
  const [posts, setPosts] = useState<PostItem[]>(initialPosts ?? []);
  const [loading, setLoading] = useState(!hasInitial);

  useEffect(() => {
    let active = true;
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data)) {
          setPosts(data);
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

  return { posts, loading };
}
