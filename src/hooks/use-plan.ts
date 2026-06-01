"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createFreePlan,
  createPaidPlan,
  getStoredPlan,
  setStoredPlan,
  type StoredPlan
} from "@/lib/plan-storage";
import { getPaidPlanProductId } from "@/lib/plan-config";

export function usePlan() {
  const [plan, setPlan] = useState<StoredPlan | null>(null);
  const [ready, setReady] = useState(false);

  const refreshPlan = useCallback(() => {
    setPlan(getStoredPlan());
    setReady(true);
  }, []);

  useEffect(() => {
    refreshPlan();
  }, [refreshPlan]);

  const assignFreePlan = useCallback(() => {
    const free = createFreePlan();
    setStoredPlan(free);
    setPlan(free);
    return free;
  }, []);

  const assignPaidPlan = useCallback((name: string, productId?: number) => {
    const paid = createPaidPlan(name, productId);
    setStoredPlan(paid);
    setPlan(paid);
    return paid;
  }, []);

  const syncPaidAccessFromApi = useCallback(async () => {
    const token = localStorage.getItem("fifapp_token");
    if (!token) return null;

    try {
      const productId = getPaidPlanProductId();
      const res = await fetch(`/api/access/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json?.data?.has_access) {
        return assignPaidPlan("Plan Premium", productId);
      }
    } catch {
      /* keep cached plan */
    }
    return getStoredPlan();
  }, [assignPaidPlan]);

  return {
    plan,
    ready,
    refreshPlan,
    assignFreePlan,
    assignPaidPlan,
    syncPaidAccessFromApi
  };
}
