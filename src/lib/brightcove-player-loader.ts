import { getBrightcoveLivePlayerScript } from "@/lib/brightcove-live-config";

const scriptLoads = new Map<string, Promise<void>>();

function isBrightcovePlayerApiReady(): boolean {
  return typeof window.bc === "function" || typeof window.videojs !== "undefined";
}

function findScriptBySrc(src: string): HTMLScriptElement | null {
  return document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
}

function waitForScript(script: HTMLScriptElement): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (isBrightcovePlayerApiReady()) {
      resolve();
      return;
    }

    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("brightcove_script_failed")), {
      once: true
    });
  });
}

/**
 * Loads a Brightcove player bundle once per playerId and resolves when bc/videojs is available.
 */
export function loadBrightcovePlayerScript(playerId: string): Promise<void> {
  const src = getBrightcoveLivePlayerScript(playerId);
  const cached = scriptLoads.get(src);
  if (cached) return cached;

  const loadPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    const existing = findScriptBySrc(src);
    if (existing) {
      void waitForScript(existing).then(resolve).catch(reject);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("brightcove_script_failed"));
    document.head.appendChild(script);
  });

  scriptLoads.set(src, loadPromise);
  return loadPromise;
}

/** Fire-and-forget preload for the primary live player script. */
export function prefetchBrightcovePlayerScript(playerId: string): void {
  void loadBrightcovePlayerScript(playerId).catch(() => {
    // Player component handles user-visible retry.
  });
}
