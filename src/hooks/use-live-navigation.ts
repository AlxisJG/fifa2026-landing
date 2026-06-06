"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { getLiveDestination } from "@/lib/live-access";

export function useLiveNavigation() {
  const router = useRouter();

  return useCallback(() => {
    router.push(getLiveDestination());
  }, [router]);
}
