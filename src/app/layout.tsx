import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { JsonLd } from "@/components/seo/json-ld";
import { ROOT_OG_IMAGE } from "@/lib/seo/metadata-shared";
import { HOME_SEO, GOOGLE_SITE_VERIFICATION, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { buildSiteGraphSchema } from "@/lib/seo/json-ld";
import { fwc26 } from "@/lib/fonts/fwc26";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_SEO.title,
    template: `%s | ${SITE_NAME}`
  },
  description: HOME_SEO.description,
  verification: {
    google: GOOGLE_SITE_VERIFICATION
  },
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    images: ROOT_OG_IMAGE
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    images: ROOT_OG_IMAGE.map((img) => img.url)
  },
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
    <html lang="es-DO" className={fwc26.variable}>
      <body className={`${fwc26.className} font-sans`}>
        <JsonLd data={buildSiteGraphSchema()} />
        <GoogleAnalytics />
        <MetaPixel />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
