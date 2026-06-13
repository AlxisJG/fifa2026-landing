declare global {
  interface BrightcoveVideoJsPlayer {
    dispose(): void;
  }

  interface BrightcoveVideoJs {
    getPlayer(id: string): BrightcoveVideoJsPlayer | undefined;
  }

  interface Window {
    bc?: (element: Element) => unknown;
    videojs?: BrightcoveVideoJs;
  }
}

export {};
