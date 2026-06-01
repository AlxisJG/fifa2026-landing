const DEFAULT_FREE_PRODUCT_ID = 0;
const DEFAULT_PAID_PRODUCT_ID = 13;

export function getFreePlanProductId(): number {
  const raw = process.env.NEXT_PUBLIC_FREE_PLAN_PRODUCT_ID;
  if (raw === undefined || raw === "") return DEFAULT_FREE_PRODUCT_ID;
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? DEFAULT_FREE_PRODUCT_ID : parsed;
}

export function getPaidPlanProductId(): number {
  const raw =
    process.env.NEXT_PUBLIC_PAID_PLAN_PRODUCT_ID ?? process.env.NEXT_PUBLIC_PPV_PRODUCT_ID;
  if (raw === undefined || raw === "") return DEFAULT_PAID_PRODUCT_ID;
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? DEFAULT_PAID_PRODUCT_ID : parsed;
}

export const FREE_PLAN_NAME = "Plan Gratis";
export const FREE_PLAN_LABEL = "Gratis con anuncios";
