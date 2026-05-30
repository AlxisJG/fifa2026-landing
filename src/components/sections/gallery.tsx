"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";
import { gallery } from "@/data/landing-content";

export function GallerySection() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="gallery" className="section-shell py-14 sm:py-20">
      <SectionTitle
        kicker="Multimedia"
        as="h3"
        title="Galería inmersiva FIFA 2026"
        subtitle="Tres paneles destacados en desktop con lightbox para exploración inmersiva."
      />
      <Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((img, index) => (
            <motion.button
              key={img}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10"
              onClick={() => setActive(img)}
            >
              <Image src={img} alt={`Galería FIFA 2026 ${index + 1}`} fill className="object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            </motion.button>
          ))}
        </div>
      </Reveal>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 grid place-items-center bg-black/92 p-5"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="relative h-[72vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/15"
            >
              <Image src={active} alt="Preview" fill className="object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
