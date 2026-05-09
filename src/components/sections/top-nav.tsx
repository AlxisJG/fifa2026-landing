"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BRANDING } from "@/lib/branding";

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [menuOpen]);

  return (
    <>
      <header
        className="theater-dark fixed inset-x-0 top-0 z-40 border-b border-white/15 bg-[#08142c]/90 backdrop-blur-2xl"
        style={{ paddingTop: "max(env(safe-area-inset-top), 0px)" }}
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-[#d71920]" />
        <div className="section-shell flex h-16 items-center justify-between">
          <a href="#" className="group flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} className="glass relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/20">
              <Image src={BRANDING.pioIcon} alt="Pio Deportes icon" width={28} height={28} className="h-7 w-7 object-contain" priority />
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle,rgba(124,226,255,0.35),transparent_65%)]" />
            </motion.div>
            <motion.div whileHover={{ x: 2 }} className="hidden h-8 w-44 items-center md:flex">
              <Image src={BRANDING.pioLogoWhite} alt="Pio Deportes" width={180} height={36} className="h-8 w-auto object-contain" priority />
            </motion.div>
            <span className="rounded-full border border-red-300/35 bg-red-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-red-300 md:hidden">Live</span>
          </a>

          <nav className="hidden items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-white/70 md:flex">
            <a href="#live" className="transition hover:text-white">Live</a>
            <a href="#" className="transition hover:text-white">Fixtures</a>
            <a href="#" className="transition hover:text-white">Highlights</a>
          </nav>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="glass relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 md:hidden"
            aria-label="Toggle menu"
          >
            <motion.span animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }} className="absolute h-0.5 w-4 bg-white" />
            <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="absolute h-0.5 w-4 bg-white" />
            <motion.span animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }} className="absolute h-0.5 w-4 bg-white" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="absolute inset-0 bg-[#061024]/70 backdrop-blur-2xl" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="theater-dark absolute inset-x-4 top-4 rounded-2xl border border-white/15 bg-[#07142cf5] p-5 shadow-glow"
              style={{ top: "max(calc(env(safe-area-inset-top) + 12px), 16px)" }}
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.22em] text-white/65">Menu</p>
                <button onClick={() => setMenuOpen(false)} className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/75">
                  Close
                </button>
              </div>
              <div className="space-y-2">
                {["Live", "Fixtures", "Highlights", "News"].map((item) => (
                  <a
                    key={item}
                    href={item === "Live" ? "#live" : "#"}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium tracking-[0.01em] text-white/90 transition hover:border-electric/45 hover:bg-white/[0.06]"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
