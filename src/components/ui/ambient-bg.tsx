"use client";

import { motion } from "framer-motion";

export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(77,161,255,0.22),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(231,190,98,0.12),transparent_25%),linear-gradient(180deg,#ffffff_0%,#f6faff_36%,#eef5ff_100%)]" />
      <motion.div
        className="absolute left-[-12%] top-[8%] h-[32rem] w-[32rem] rounded-full bg-[#00b7ff]/14 blur-[110px]"
        animate={{ x: [0, 35, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-8%] top-[26%] h-[30rem] w-[30rem] rounded-full bg-[#ffd17a]/12 blur-[120px]"
        animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-0 top-[14%] h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
        animate={{ opacity: [0.15, 0.5, 0.15], y: [0, 30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_45%_35%,rgba(255,255,255,0.06),transparent_45%)]"
        animate={{ opacity: [0.1, 0.22, 0.1], scale: [1, 1.04, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="ambient-scanlines absolute inset-0 opacity-[0.08]" />
      <div className="ambient-noise absolute inset-0 opacity-[0.05]" />
      <div className="ambient-particles absolute inset-0" />
    </div>
  );
}
