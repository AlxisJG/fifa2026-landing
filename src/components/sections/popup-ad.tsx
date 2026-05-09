"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function PopupAd() {
  const [open, setOpen] = useState(true);
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    if (!open || timer <= 0) return;
    const id = window.setInterval(() => setTimer((v) => v - 1), 1000);
    return () => window.clearInterval(id);
  }, [open, timer]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-[#02040d]/70 p-4"
        >
          <motion.div
            initial={{ scale: 0.96, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="sweep relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-300/80 bg-white/95 shadow-[0_20px_70px_rgba(15,23,42,0.2)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(70,210,255,0.25),transparent_42%),radial-gradient(circle_at_88%_0%,rgba(231,190,98,0.22),transparent_35%)]" />
            <div className="relative h-64 p-6 sm:h-80 sm:p-8">
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full border border-[#0f2d63]/40 bg-[#0d2a5e] px-3 py-1 text-[10px] uppercase tracking-[0.25em] shadow-[0_0_16px_rgba(37,99,235,0.35)]"
                  style={{ color: "#FFFFFF", opacity: 0.92, textShadow: "0 1px 6px rgba(255,255,255,0.15)" }}
                >
                  Official Sponsor Takeover
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-blue-700">World Cup 2026</span>
              </div>
              <div className="mt-10 max-w-2xl">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-600">Presented by</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-5xl">Premium Brand Experience</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">Creative slot for full video or image campaign with countdown, CTA and deterministic impression tracking.</p>
              </div>
            </div>
            <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-5 sm:px-8">
              <button className="rounded-full bg-electric px-6 py-2.5 text-sm font-semibold text-midnight transition hover:brightness-110">Explore Sponsor</button>
              <button
                disabled={timer > 0}
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {timer > 0 ? `Close in ${timer}s` : "Close"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
