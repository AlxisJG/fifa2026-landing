import localFont from "next/font/local";

export const fwc26 = localFont({
  src: [
    {
      path: "../../../public/recursos/web-font/FWC26-NormalThin.woff2",
      weight: "100",
      style: "normal"
    },
    {
      path: "../../../public/recursos/web-font/FWC26-NormalLight.woff2",
      weight: "300",
      style: "normal"
    },
    {
      path: "../../../public/recursos/web-font/FWC26-NormalRegular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "../../../public/recursos/web-font/FWC26-NormalMedium.woff2",
      weight: "500",
      style: "normal"
    },
    {
      path: "../../../public/recursos/web-font/FWC26-NormalBold.woff2",
      weight: "700",
      style: "normal"
    },
    {
      path: "../../../public/recursos/web-font/FWC26-NormalBlack.woff2",
      weight: "900",
      style: "normal"
    }
  ],
  variable: "--font-fwc26",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"]
});
