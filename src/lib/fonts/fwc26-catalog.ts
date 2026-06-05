export const FWC26_FAMILY_SLUGS = [
  "normal",
  "condensed",
  "expanded",
  "semi-expanded",
  "ultra-condensed"
] as const;

export const FWC26_WEIGHT_SLUGS = ["thin", "light", "regular", "medium", "bold", "black"] as const;

export type Fwc26FamilySlug = (typeof FWC26_FAMILY_SLUGS)[number];
export type Fwc26WeightSlug = (typeof FWC26_WEIGHT_SLUGS)[number];

export type Fwc26Variant = {
  /** Identificador para pedir la fuente: `condensed-bold`, `normal-black`, etc. */
  id: string;
  familySlug: Fwc26FamilySlug;
  familyLabel: string;
  weightSlug: Fwc26WeightSlug;
  weightLabel: string;
  weightValue: number;
  fileName: string;
  fontFamily: string;
  /** Variante incluida hoy en la fuente global del sitio (solo Normal + pesos Tailwind). */
  inDefaultStack: boolean;
};

const FAMILY_LABELS: Record<Fwc26FamilySlug, string> = {
  normal: "Normal",
  condensed: "Condensed",
  expanded: "Expanded",
  "semi-expanded": "Semi Expanded",
  "ultra-condensed": "Ultra Condensed"
};

const WEIGHT_LABELS: Record<Fwc26WeightSlug, string> = {
  thin: "Thin",
  light: "Light",
  regular: "Regular",
  medium: "Medium",
  bold: "Bold",
  black: "Black"
};

const WEIGHT_VALUES: Record<Fwc26WeightSlug, number> = {
  thin: 100,
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700,
  black: 900
};

function familySlugToFileToken(slug: Fwc26FamilySlug): string {
  if (slug === "semi-expanded") return "SemiExpanded";
  if (slug === "ultra-condensed") return "UltraCondensed";
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function weightSlugToFileToken(slug: Fwc26WeightSlug): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function buildVariant(familySlug: Fwc26FamilySlug, weightSlug: Fwc26WeightSlug): Fwc26Variant {
  const familyLabel = FAMILY_LABELS[familySlug];
  const weightLabel = WEIGHT_LABELS[weightSlug];
  const fileToken = `FWC26-${familySlugToFileToken(familySlug)}${weightSlugToFileToken(weightSlug)}`;

  return {
    id: `${familySlug}-${weightSlug}`,
    familySlug,
    familyLabel,
    weightSlug,
    weightLabel,
    weightValue: WEIGHT_VALUES[weightSlug],
    fileName: `${fileToken}.woff2`,
    fontFamily: `FWC26 ${familyLabel} ${weightLabel}`,
    inDefaultStack: familySlug === "normal"
  };
}

export const FWC26_VARIANTS: Fwc26Variant[] = FWC26_FAMILY_SLUGS.flatMap((familySlug) =>
  FWC26_WEIGHT_SLUGS.map((weightSlug) => buildVariant(familySlug, weightSlug))
);

export const FWC26_VARIANTS_BY_FAMILY = FWC26_FAMILY_SLUGS.map((familySlug) => ({
  familySlug,
  familyLabel: FAMILY_LABELS[familySlug],
  variants: FWC26_VARIANTS.filter((variant) => variant.familySlug === familySlug)
}));
