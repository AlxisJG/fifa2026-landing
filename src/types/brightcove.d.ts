declare global {
  interface BrightcoveVideoJsPlayer {
    dispose(): void;
    currentSrc?(): string;
    error?(): unknown;
    on?(event: string, handler: () => void): void;
    ready?(handler: () => void): void;
    src?(source: { src: string; type: string }): void;
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
