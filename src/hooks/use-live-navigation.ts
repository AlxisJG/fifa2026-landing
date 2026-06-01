"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getLiveDestination } from "@/lib/live-access";

export function useLiveNavigation() {
  const router = useRouter();
  const { user } = useAuth();

  return useCallback(() => {
    router.push(getLiveDestination(Boolean(user)));
  }, [router, user]);
}
