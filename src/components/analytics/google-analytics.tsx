import Script from "next/script";
import { Suspense } from "react";
import { getGaMeasurementId } from "@/lib/ga4";
import { getGoogleAdsId } from "@/lib/google-ads";
import { GoogleAnalyticsPageView } from "./google-analytics-page-view";

/**
 * GA4 + Google Ads via a single gtag.js load.
 * @see https://developers.google.com/analytics/devguides/collection/ga4
 * @see https://support.google.com/google-ads/answer/7548399
 */
export function GoogleAnalytics() {
  const measurementId = getGaMeasurementId();
  const googleAdsId = getGoogleAdsId();
  const loaderId = measurementId ?? googleAdsId;

  if (!loaderId) {
    return null;
  }

  const configLines = [
    measurementId ? `gtag('config', '${measurementId}');` : "",
    googleAdsId ? `gtag('config', '${googleAdsId}');` : ""
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${loaderId}`} strategy="afterInteractive" />
      <Script id="google-gtag" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${configLines}
`}
      </Script>
      {measurementId || googleAdsId ? (
        <Suspense fallback={null}>
          <GoogleAnalyticsPageView measurementId={measurementId} googleAdsId={googleAdsId} />
        </Suspense>
      ) : null}
    </>
  );
}
