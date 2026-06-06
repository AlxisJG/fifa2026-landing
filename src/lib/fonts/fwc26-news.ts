import localFont from "next/font/local";

export const fwc26NewsMedium = localFont({
  src: [
    {
      path: "../../../public/recursos/web-font/FWC26-NormalMedium.woff2",
      weight: "500",
      style: "normal"
    }
  ],
  display: "swap"
});

export const fwc26NewsBold = localFont({
  src: [
    {
      path: "../../../public/recursos/web-font/FWC26-NormalBold.woff2",
      weight: "700",
      style: "normal"
    }
  ],
  display: "swap"
});
