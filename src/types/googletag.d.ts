declare global {
  type GoogletagSize = [number, number];

  interface GoogletagSizeMappingBuilder {
    addSize(viewport: GoogletagSize, sizes: GoogletagSize[]): GoogletagSizeMappingBuilder;
    build(): unknown;
  }

  interface GoogletagSlot {
    addService(service: GoogletagPubAdsService): GoogletagSlot;
    defineSizeMapping(mapping: unknown): GoogletagSlot;
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
    sizeMapping?(): GoogletagSizeMappingBuilder;
    display?(divId: string): void;
    pubads?(): GoogletagPubAdsService;
    enableServices?(): void;
  }

  interface Window {
    googletag?: Googletag;
  }
}

export {};
