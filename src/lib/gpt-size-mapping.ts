import type { GamSizeMappingBreakpoint } from "@/data/gam-placements";

export function applyGptSizeMapping(
  googletag: NonNullable<Window["googletag"]>,
  breakpoints: GamSizeMappingBreakpoint[]
): unknown | null {
  if (!googletag.sizeMapping) {
    return null;
  }

  let builder = googletag.sizeMapping();
  for (const row of breakpoints) {
    builder = builder.addSize(row.viewport, row.sizes);
  }
  return builder.build();
}
