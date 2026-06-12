import Script from "next/script";

/** Carga GPT en el documento antes de que los slots monten en cliente. */
export function GptScript() {
  return (
    <Script
      id="gpt-library"
      src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
      strategy="afterInteractive"
    />
  );
}
