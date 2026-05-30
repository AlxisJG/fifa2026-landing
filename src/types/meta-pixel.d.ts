type FbqCommand = "init" | "track" | "trackCustom";

interface Fbq {
  (command: "init", pixelId: string): void;
  (command: "track", event: string, params?: Record<string, unknown>): void;
  (command: "trackCustom", event: string, params?: Record<string, unknown>): void;
  (command: FbqCommand, ...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
}

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export {};
