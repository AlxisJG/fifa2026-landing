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
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-4 z-[55] rounded-full border border-white/15 bg-black px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_14px_32px_rgba(0,0,0,0.35)]"
      aria-label="Volver arriba"
    >
      Arriba
    </button>
  );
}
