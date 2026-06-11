declare global {
  type GoogletagSize = [number, number];

  interface GoogletagSlot {
    addService(service: GoogletagPubAdsService): GoogletagSlot;
    getSlotElementId(): string;
  }

  interface GoogletagPubAdsService {
    enableSingleRequest(): void;
    collapseEmptyDivs(): void;
    getSlots(): GoogletagSlot[];
  }

  interface Googletag {
    cmd: Array<() => void>;
    defineSlot?(
      adUnitPath: string,
      size: GoogletagSize | GoogletagSize[],
      divId: string
    ): GoogletagSlot | null;
    display?(divId: string): void;
    pubads?(): GoogletagPubAdsService;
    enableServices?(): void;
  }

  interface Window {
    googletag?: Googletag;
  }
}

export {};
