import Script from "next/script";
import { Suspense } from "react";
import { getGaMeasurementId } from "@/lib/ga4";
import { GoogleAnalyticsPageView } from "./google-analytics-page-view";

/**
 * GA4 via gtag.js (Admin → Data streams → Web → Install with tag manually).
 * @see https://developers.google.com/analytics/devguides/collection/ga4
 */
export function GoogleAnalytics() {
  const measurementId = getGaMeasurementId();
  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');
`}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageView measurementId={measurementId} />
      </Suspense>
    </>
  );
}
