import type { AdPlacement } from "@/data/ad-placements";
import { horizontalSizeLabel } from "@/lib/ad-sizes";

export type PageAdKey =
  | "home"
  | "noticias"
  | "partidos"
  | "posiciones"
  | "highlights"
  | "galeria"
  | "mundial2026Rd"
  | "dondeVerMundial"
  | "partidosEnVivoMundial"
  | "transmision";

type PageAdLabels = {
  top: string;
  bottom: string;
};

const PAGE_LABELS: Record<PageAdKey, PageAdLabels> = {
  /** Superior: banner Domino's (`DOMINOS_BANNER_ASSETS`), debajo del partido destacado. */
  home: { top: "Inicio · superior", bottom: "Inicio · inferior" },
  /** Superior/inferior: banner Brugal. Rectángulo en grid sigue en placeholder. */
  noticias: { top: "Noticias · superior", bottom: "Noticias · inferior" },
  partidos: { top: "Partidos · superior", bottom: "Partidos · inferior" },
  posiciones: { top: "Posiciones · superior", bottom: "Posiciones · inferior" },
  highlights: { top: "Highlights · superior", bottom: "Highlights · inferior" },
  galeria: { top: "Galería · superior", bottom: "Galería · inferior" },
  mundial2026Rd: { top: "Mundial RD · superior", bottom: "Mundial RD · inferior" },
  dondeVerMundial: { top: "Dónde ver · superior", bottom: "Dónde ver · inferior" },
  partidosEnVivoMundial: { top: "Partidos en vivo · superior", bottom: "Partidos en vivo · inferior" },
  /** Superior: Domino's. Inferior: Brillante (`TransmisionBottomAd`). */
  transmision: { top: "Transmisión · superior", bottom: "Transmisión · inferior" }
};

const horizontalLabel = horizontalSizeLabel();

export function getPageHorizontalPlacements(page: PageAdKey): { top: AdPlacement; bottom: AdPlacement } {
  const labels = PAGE_LABELS[page];

  return {
    top: {
      id: `leaderboard-${page}-top`,
      title: "Banner Horizontal",
      sizeLabel: horizontalLabel,
      placement: labels.top
    },
    bottom: {
      id: `leaderboard-${page}-bottom`,
      title: "Banner Horizontal",
      sizeLabel: horizontalLabel,
      placement: labels.bottom
    }
  };
}
