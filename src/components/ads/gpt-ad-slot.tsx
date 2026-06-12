"use client";

import { useEffect, useState } from "react";
import type { GamSlotConfig } from "@/data/gam-placements";
import { applyGptSizeMapping } from "@/lib/gpt-size-mapping";
import {
  enableGptServicesOnce,
  findGptSlot,
  hasGptSlotInitialized,
  loadGptScript,
  markGptSlotInitialized
} from "@/lib/gpt-loader";

type GptAdSlotProps = {
  slot: GamSlotConfig;
  className?: string;
};

type SlotStatus = "loading" | "filled" | "empty" | "error";

export function GptAdSlot({ slot, className = "" }: GptAdSlotProps) {
  const [status, setStatus] = useState<SlotStatus>("loading");

  useEffect(() => {
    const existingEl = document.getElementById(slot.slotId);
    if (hasGptSlotInitialized(slot.slotId) && existingEl?.querySelector("iframe")) {
      return;
    }

    let cancelled = false;

    async function mountSlot() {
      try {
        await loadGptScript();
        if (cancelled) return;

        window.googletag = window.googletag || { cmd: [] };

        window.googletag.cmd.push(() => {
          if (cancelled || hasGptSlotInitialized(slot.slotId)) return;

          const googletag = window.googletag;
          if (!googletag?.defineSlot || !googletag.pubads || !googletag.display) {
            setStatus("error");
            return;
          }

          const pubads = googletag.pubads();
          let defined = googletag.defineSlot(slot.adUnitPath, slot.sizes, slot.slotId);

          if (!defined) {
            const existing = findGptSlot(slot.slotId);
            if (existing && googletag.destroySlots) {
              googletag.destroySlots([existing]);
              defined = googletag.defineSlot(slot.adUnitPath, slot.sizes, slot.slotId);
            }
          }

          if (!defined) {
            setStatus("error");
            return;
          }

          if (slot.sizeMapping?.length) {
            const mapping = applyGptSizeMapping(googletag, slot.sizeMapping);
            if (mapping) {
              defined.defineSizeMapping(mapping);
            }
          }

          defined.addService(pubads);

          const onRender = (event: googletag.events.SlotRenderEndedEvent) => {
            if (event.slot.getSlotElementId() !== slot.slotId || cancelled) return;
            pubads.removeEventListener("slotRenderEnded", onRender);
            setStatus(event.isEmpty ? "empty" : "filled");
          };

          pubads.addEventListener("slotRenderEnded", onRender);
          enableGptServicesOnce();
          googletag.display(slot.slotId);
          markGptSlotInitialized(slot.slotId);
        });
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void mountSlot();

    return () => {
      cancelled = true;
    };
  }, [slot.adUnitPath, slot.slotId, slot.sizes, slot.sizeMapping]);

  const showDevHint =
    process.env.NODE_ENV === "development" && (status === "empty" || status === "error");

  return (
    <div className={`relative w-full ${className}`.trim()}>
      <div
        id={slot.slotId}
        className="mx-auto block w-full max-w-[970px]"
        style={{
          minWidth: slot.minWidth,
          minHeight: status === "loading" ? slot.minHeight : undefined
        }}
      />
      {showDevHint ? (
        <p className="mt-2 px-2 text-center text-[11px] leading-relaxed text-amber-200/90">
          {status === "error"
            ? "GPT no cargó (¿ad blocker activo?). Desactiva bloqueadores y recarga."
            : `GAM sin creativo para ${slot.adUnitPath}. Si usas Bri001 en local, prueba con la unidad demo o verifica línea en Ad Manager.`}
        </p>
      ) : null}
    </div>
  );
}
