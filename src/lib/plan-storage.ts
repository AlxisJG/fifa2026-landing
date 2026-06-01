import { FREE_PLAN_NAME, getFreePlanProductId, getPaidPlanProductId } from "@/lib/plan-config";

export const PLAN_STORAGE_KEY = "fifapp_plan";

export type PlanTier = "free" | "paid";

export type StoredPlan = {
  productId: number;
  tier: PlanTier;
  name: string;
  adFree: boolean;
  updatedAt: string;
};

function isStoredPlan(value: unknown): value is StoredPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as StoredPlan;
  return (
    typeof plan.productId === "number" &&
    (plan.tier === "free" || plan.tier === "paid") &&
    typeof plan.name === "string" &&
    typeof plan.adFree === "boolean" &&
    typeof plan.updatedAt === "string"
  );
}

export function getStoredPlan(): StoredPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PLAN_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isStoredPlan(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function setStoredPlan(plan: StoredPlan): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
}

export function clearStoredPlan(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PLAN_STORAGE_KEY);
}

export function createFreePlan(): StoredPlan {
  return {
    productId: getFreePlanProductId(),
    tier: "free",
    name: FREE_PLAN_NAME,
    adFree: false,
    updatedAt: new Date().toISOString()
  };
}

export function createPaidPlan(name: string, productId = getPaidPlanProductId()): StoredPlan {
  return {
    productId,
    tier: "paid",
    name,
    adFree: true,
    updatedAt: new Date().toISOString()
  };
}

export function hasStreamAccess(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("fifapp_token");
  const plan = getStoredPlan();
  return Boolean(token && plan);
}

export function planShowsAds(plan: StoredPlan | null): boolean {
  if (!plan) return true;
  return !plan.adFree;
}
