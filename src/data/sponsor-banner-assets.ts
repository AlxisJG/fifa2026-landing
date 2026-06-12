export type SponsorBannerAsset = {
  src: string;
  width: number;
  height: number;
};

export type SponsorBannerAssets = {
  desktopWide: SponsorBannerAsset;
  desktop: SponsorBannerAsset;
  mobile: SponsorBannerAsset;
  alt: string;
};

const brillanteBase = "/ads/brillante";

export const BRILLANTE_BANNER_ASSETS: SponsorBannerAssets = {
  desktopWide: { src: `${brillanteBase}/Brillante-Sport-750x100px-ANM.gif`, width: 750, height: 100 },
  desktop: { src: `${brillanteBase}/Brillante-Sport-728X90px-Futbol.gif`, width: 728, height: 90 },
  mobile: { src: `${brillanteBase}/Brillante-Sport-300x50px-ANM.gif`, width: 300, height: 50 },
  alt: "Brillante Sport"
};

const brugalBase = "/ads/brugal";

function brugalAsset(filename: string, width: number, height: number): SponsorBannerAsset {
  return {
    src: `${brugalBase}/${encodeURIComponent(filename)}`,
    width,
    height
  };
}

export const BRUGAL_BANNER_ASSETS: SponsorBannerAssets = {
  desktopWide: brugalAsset("Banner digital Futbol Brugal 2026 (750x100).jpg", 750, 100),
  desktop: brugalAsset("Final Banner digital Futbol Brugal 2026 (728x90).jpg", 728, 90),
  mobile: brugalAsset("Banner digital Futbol Brugal 2026 (300x50).jpg", 300, 50),
  alt: "Brugal"
};
