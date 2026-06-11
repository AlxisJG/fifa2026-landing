let gptScriptInjected = false;
let gptServicesEnabled = false;

export function ensureGptScript(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.googletag = window.googletag || { cmd: [] };

  if (gptScriptInjected) {
    return;
  }

  gptScriptInjected = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  document.head.appendChild(script);
}

export function enableGptServicesOnce(): void {
  const googletag = window.googletag;
  if (typeof window === "undefined" || !googletag?.pubads || !googletag.enableServices || gptServicesEnabled) {
    return;
  }

  googletag.pubads().enableSingleRequest();
  googletag.pubads().collapseEmptyDivs();
  googletag.enableServices();
  gptServicesEnabled = true;
}
