import { getBrightcoveLivePlayerScript } from "@/lib/brightcove-live-config";

const scriptLoads = new Map<string, Promise<void>>();
const SCRIPT_DATA_ATTR = "data-brightcove-live-player-script";
let activePlayerScriptSrc: string | null = null;

function isBrightcovePlayerApiReady(): boolean {
  return typeof window.bc === "function" && typeof window.videojs !== "undefined";
}

function findScriptBySrc(src: string): HTMLScriptElement | null {
  return document.querySelector<HTMLScriptElement>(`script[${SCRIPT_DATA_ATTR}="true"][src="${src}"]`);
}

function waitForBrightcoveApi(timeoutMs = 5_000): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const startedAt = Date.now();

    function tick() {
      if (isBrightcovePlayerApiReady()) {
        resolve();
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error("brightcove_api_not_ready"));
        return;
      }

      window.setTimeout(tick, 50);
    }

    tick();
  });
}

function waitForScript(script: HTMLScriptElement): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (script.dataset.loaded === "true") {
      resolve();
      return;
    }

    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("brightcove_script_failed")), {
      once: true
    });
  });
}

function removeManagedPlayerScripts(exceptSrc?: string): void {
  document
    .querySelectorAll<HTMLScriptElement>(`script[${SCRIPT_DATA_ATTR}="true"]`)
    .forEach((script) => {
      if (exceptSrc && script.src === exceptSrc) return;
      script.remove();
    });
}

function resetBrightcoveGlobals(): void {
  window.bc = undefined;
  window.videojs = undefined;
}

/**
 * Loads the active Brightcove player bundle.
 *
 * Brightcove exposes `bc`/`videojs` globals from a player-specific script. When switching
 * between different player IDs, re-run the target script so the next mount initializes
 * with the matching player bundle.
 */
export function loadBrightcovePlayerScript(playerId: string): Promise<void> {
  const src = getBrightcoveLivePlayerScript(playerId);
  const cached = scriptLoads.get(src);
  if (cached && activePlayerScriptSrc === src) return cached;

  const loadPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    if (activePlayerScriptSrc === src) {
      const existing = findScriptBySrc(src);
      if (!existing) {
        activePlayerScriptSrc = null;
      } else {
        void waitForScript(existing).then(resolve).catch(reject);
        return;
      }
    }

    removeManagedPlayerScripts();
    resetBrightcoveGlobals();

    const staleExisting = findScriptBySrc(src);
    if (staleExisting) {
      staleExisting.remove();
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.setAttribute(SCRIPT_DATA_ATTR, "true");
    script.onload = () => {
      script.dataset.loaded = "true";
      void waitForBrightcoveApi()
        .then(() => {
          activePlayerScriptSrc = src;
          resolve();
        })
        .catch(reject);
    };
    script.onerror = () => reject(new Error("brightcove_script_failed"));
    document.head.appendChild(script);
  });

  scriptLoads.set(src, loadPromise);
  void loadPromise.finally(() => {
    if (scriptLoads.get(src) === loadPromise) {
      scriptLoads.delete(src);
    }
  });
  return loadPromise;
}

/** Fire-and-forget preload for the primary live player script. */
export function prefetchBrightcovePlayerScript(playerId: string): void {
  if (activePlayerScriptSrc) return;
  void loadBrightcovePlayerScript(playerId).catch(() => {
    // Player component handles user-visible retry.
  });
}
