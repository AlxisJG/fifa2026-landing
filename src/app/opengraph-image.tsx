import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "PIO Deportes — Mundial FIFA 2026 en República Dominicana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PIO_RED = "#d71920";
const PIO_RED_BORDER = "#9e1218";

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public/LOGOS/logo-pio-fifa.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: PIO_RED
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 24,
            border: `4px solid ${PIO_RED_BORDER}`,
            padding: 32,
            backgroundColor: PIO_RED
          }}
        >
          <img
            src={logoSrc}
            alt=""
            width={920}
            height={390}
            style={{
              objectFit: "contain"
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
