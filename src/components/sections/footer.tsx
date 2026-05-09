"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BRANDING } from "@/lib/branding";

export function FooterSection() {
  return (
    <footer className="relative border-t border-white/10 py-12 sm:py-16">
      <div className="section-shell grid gap-8 text-sm text-white/70 md:grid-cols-3">
        <div>
          <div className="glass inline-flex h-11 w-44 items-center rounded-xl px-3">
            <Image src={BRANDING.pioLogoCleanA} alt="Pio Deportes" width={170} height={36} className="h-7 w-auto object-contain" />
          </div>
          <p className="mt-3 leading-relaxed">Official broadcaster for FIFA World Cup 2026 in Dominican Republic.</p>
          <div className="mt-4 flex gap-2">
            {['X', 'IG', 'YT'].map((s) => (
              <motion.button key={s} whileHover={{ y: -2 }} className="rounded-full border border-white/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]">
                {s}
              </motion.button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Navigation</p>
          <ul className="mt-3 space-y-2 text-white/70">
            <li>Partidos</li>
            <li>Noticias</li>
            <li>Streaming</li>
            <li>Patrocinadores</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Legal</p>
          <p className="mt-3 leading-relaxed">El streaming esta sujeto a georestricciones, DRM activo, politicas de derechos FIFA y disponibilidad de señal.</p>
        </div>
      </div>
    </footer>
  );
}
