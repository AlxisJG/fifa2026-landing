import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Pio Deportes | FIFA World Cup 2026",
  description: "Premium streaming landing page for FIFA World Cup 2026 in Dominican Republic",
  icons: {
    icon: [
      { url: "/ICON/FAV%20ICON%20LOGO%20PIO%20DEPORTES-06.png", sizes: "32x32", type: "image/png" },
      { url: "/ICON/FAV%20ICON%20LOGO%20PIO%20DEPORTES-05.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/ICON/FAV%20ICON%20LOGO%20PIO%20DEPORTES-05.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/ICON/FAV%20ICON%20LOGO%20PIO%20DEPORTES-06.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <GoogleAnalytics />
        <MetaPixel />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
