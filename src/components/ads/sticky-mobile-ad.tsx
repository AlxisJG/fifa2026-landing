"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AdSlotFrame } from "@/components/ads/ad-slot-frame";
import { AD_SIZES } from "@/lib/ad-sizes";
import { isAdsEnabled } from "@/lib/ads-gate";

export function StickyMobileAd() {
  const [visible, setVisible] = useState(true);

  if (!isAdsEnabled() || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-x-0 bottom-0 z-30 flex justify-center bg-transparent px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 md:hidden"
      >
        <div className="relative w-full max-w-[320px]">
          <AdSlotFrame
            format="mobile-banner"
            id="sticky-mobile-banner"
            title="Live Matchday Mobile Unit"
            placement="Sticky inferior"
            activeSizeLabel={AD_SIZES["mobile-banner"].label}
            variant="matchday"
            className="!block w-full max-w-[320px]"
          />
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute -right-1 -top-2 z-20 rounded-full border border-white/25 bg-[#08142c]/95 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-white/80"
            aria-label="Cerrar anuncio"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
