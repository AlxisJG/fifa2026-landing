"use client";

import { useEffect, useState } from "react";
import { isNativeApp } from "@/lib/native-app";

export function NativeScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isNativeApp()) return;

    function updateVisibility() {
      setVisible(window.scrollY > 420);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      data-native-scroll-top
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-4 z-[55] inline-flex appearance-none items-center gap-2 rounded-full border border-white/25 bg-[#d71920] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] !text-white shadow-[0_14px_32px_rgba(215,25,32,0.35)]"
      style={{
        color: "#ffffff",
        WebkitTextFillColor: "#ffffff",
        backgroundColor: "#d71920"
      }}
      aria-label="Volver arriba"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
      Arriba
    </button>
  );
}
