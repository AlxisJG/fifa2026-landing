"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function StickyMobileAd() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-x-0 bottom-0 z-30 bg-transparent px-4 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 md:hidden"
      >
        <div className="section-shell px-0">
          <motion.div
            animate={{ boxShadow: ["0 0 0 1px rgba(255,255,255,0.14), 0 18px 45px rgba(0,0,0,0.4)", "0 0 0 1px rgba(124,226,255,0.35), 0 22px 55px rgba(6,108,185,0.35)", "0 0 0 1px rgba(255,255,255,0.14), 0 18px 45px rgba(0,0,0,0.4)"] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            className="glass-heavy flex min-h-[64px] items-center justify-between gap-3 rounded-2xl border border-white/20 px-3 py-2"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">Sponsor</p>
              <p className="text-xs font-medium text-white/90">Live Matchday Mobile Unit</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/20 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60">300x50</span>
              <button
                onClick={() => setVisible(false)}
                className="rounded-full border border-white/20 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70"
                aria-label="Dismiss mobile sponsor"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
