declare global {
  type GoogletagSize = [number, number];
  type GamAdSize = GoogletagSize | "fluid";

  interface GoogletagSizeMappingBuilder {
    addSize(viewport: GoogletagSize, sizes: GamAdSize[]): GoogletagSizeMappingBuilder;
    build(): unknown;
  }

  interface GoogletagSlot {
    addService(service: GoogletagPubAdsService): GoogletagSlot;
    defineSizeMapping(mapping: unknown): GoogletagSlot;
    getSlotElementId(): string;
    getAdUnitPath(): string;
  }

  interface GoogletagSlotRenderEndedEvent {
    slot: GoogletagSlot;
    isEmpty: boolean;
    size?: GoogletagSize;
  }

  interface GoogletagPubAdsService {
    enableSingleRequest(): void;
    collapseEmptyDivs(collapse?: boolean): void;
    getSlots(): GoogletagSlot[];
    set(key: string, value: string): void;
    addEventListener(
      event: "slotRenderEnded",
      handler: (event: GoogletagSlotRenderEndedEvent) => void
    ): void;
    removeEventListener(
      event: "slotRenderEnded",
      handler: (event: GoogletagSlotRenderEndedEvent) => void
    ): void;
  }

  interface Googletag {
    cmd: Array<() => void>;
    defineSlot?(
      adUnitPath: string,
      size: GamAdSize | GamAdSize[],
      divId: string
    ): GoogletagSlot | null;
    sizeMapping?(): GoogletagSizeMappingBuilder;
    display?(divId: string): void;
    destroySlots?(slots: GoogletagSlot[]): boolean;
    pubads?(): GoogletagPubAdsService;
    enableServices?(): void;
  }

  namespace googletag {
    namespace events {
      type SlotRenderEndedEvent = GoogletagSlotRenderEndedEvent;
    }
  }

  interface Window {
    googletag?: Googletag;
  }
}

export {};
