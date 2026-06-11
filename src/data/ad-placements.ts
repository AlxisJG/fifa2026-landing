import { horizontalSizeLabel } from "@/lib/ad-sizes";

export type AdPlacement = {
  id: string;
  title: string;
  sizeLabel: string;
  placement: string;
};

export const skyscraperPlacement: AdPlacement = {
  id: "skyscraper-hero",
  title: "Banner Skyscraper",
  sizeLabel: "160×600",
  placement: "Hero Left / Right Rail"
};

export const rectanglePlacements = {
  featuredNews: {
    id: "rectangle-news",
    title: "Banner Rectángulo",
    sizeLabel: "300×250",
    placement: "Noticias destacadas"
  },
  newsListing: {
    id: "rectangle-news-listing",
    title: "Banner Rectángulo",
    sizeLabel: "300×250",
    placement: "Listado de noticias · fila central"
  },
  liveStream: {
    id: "rectangle-live-broadcast",
    title: "Banner Rectángulo",
    sizeLabel: "300×250",
    placement: "Juego en vivo · Broadcast Center"
  },
  /** Placeholder en home/demo; en `/transmision` usar GAM `transmissionPlayerGamSlot`. */
  liveStreamPlayer: {
    id: "leaderboard-live-player",
    title: "Banner Leaderboard",
    sizeLabel: "728×90",
    placement: "Juego en vivo · reproductor"
  }
} as const;

const horizontalLabel = horizontalSizeLabel();

export const horizontalPlacements: AdPlacement[] = [
  {
    id: "leaderboard-1",
    title: "Banner Horizontal",
    sizeLabel: horizontalLabel,
    placement: "Después del ticker"
  },
  {
    id: "leaderboard-2",
    title: "Banner Horizontal",
    sizeLabel: horizontalLabel,
    placement: "Después de noticias destacadas"
  },
  {
    id: "leaderboard-3",
    title: "Banner Horizontal",
    sizeLabel: horizontalLabel,
    placement: "Después de partidos y horarios"
  },
  {
    id: "leaderboard-4",
    title: "Banner Horizontal",
    sizeLabel: horizontalLabel,
    placement: "Después de tabla de posiciones"
  },
  {
    id: "leaderboard-5",
    title: "Banner Horizontal",
    sizeLabel: horizontalLabel,
    placement: "Después de resúmenes de partidos"
  },
  {
    id: "leaderboard-6",
    title: "Banner Horizontal",
    sizeLabel: horizontalLabel,
    placement: "Después de galería inmersiva"
  }
];
