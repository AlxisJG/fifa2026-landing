const GAM_PAGE_URL =
  process.env.NEXT_PUBLIC_GAM_PAGE_URL?.trim() || "https://fifa.piodeportes.com/transmision";

let gptServicesEnabled = false;

/** Evita doble init de GPT con React Strict Mode (dev). */
const initializedSlotIds = new Set<string>();

export function hasGptSlotInitialized(slotId: string): boolean {
  return initializedSlotIds.has(slotId);
}

export function markGptSlotInitialized(slotId: string): void {
  initializedSlotIds.add(slotId);
}

function isLocalGptHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

/** Espera a que gpt.js (layout) exponga la API de googletag. */
export function loadGptScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  window.googletag = window.googletag || { cmd: [] };

  if (window.googletag.defineSlot) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error("gpt_script_timeout"));
    }, 15_000);

    const finish = () => {
      window.clearTimeout(timeoutId);
      resolve();
    };

    window.googletag!.cmd.push(finish);

    const existing = document.querySelector<HTMLScriptElement>('script[src*="gpt.js"]');
    if (!existing) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
      script.onload = () => window.googletag!.cmd.push(finish);
      script.onerror = () => {
        window.clearTimeout(timeoutId);
        reject(new Error("gpt_script_failed"));
      };
      document.head.appendChild(script);
    }
  });
}

function configurePubads(googletag: NonNullable<Window["googletag"]>): void {
  const pubads = googletag.pubads!();

  if (isLocalGptHost() || process.env.NODE_ENV === "development") {
    pubads.set("page_url", GAM_PAGE_URL);
  }

  pubads.collapseEmptyDivs(false);

  if (process.env.NODE_ENV === "development") {
    pubads.addEventListener("slotRenderEnded", (event) => {
      const slotId = event.slot.getSlotElementId();
      // eslint-disable-next-line no-console -- diagnóstico local GAM
      console.info(
        `[GAM] ${slotId}:`,
        event.isEmpty ? "sin creativo (vacío)" : `render OK ${event.size?.join("x") ?? ""}`
      );
    });
  }
}

export function enableGptServicesOnce(): void {
  const googletag = window.googletag;
  if (typeof window === "undefined" || !googletag?.pubads || !googletag.enableServices || gptServicesEnabled) {
    return;
  }

  configurePubads(googletag);
  googletag.enableServices();
  gptServicesEnabled = true;
}

export function findGptSlot(slotId: string) {
  const googletag = window.googletag;
  if (!googletag?.pubads) return null;
  return googletag.pubads().getSlots().find((entry) => entry.getSlotElementId() === slotId) ?? null;
}
