"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Masonry from "react-masonry-css";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Reveal } from "@/components/ui/motion";
import { useGallery } from "@/hooks/useGallery";
import type { GalleryItem } from "@/lib/gallery-types";

const breakpointCols = {
  default: 4,
  1280: 3,
  768: 2,
  640: 1
};

function GallerySkeleton() {
  return (
    <div className="-ml-4 flex w-auto">
      {Array.from({ length: 4 }).map((_, column) => (
        <div key={column} className="flex-1 pl-4">
          {Array.from({ length: 3 }).map((__, row) => (
            <div
              key={row}
              className="mb-4 animate-pulse rounded-3xl bg-slate-200"
              style={{ height: row % 2 === 0 ? "12rem" : "18rem" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function GalleryLightbox({
  item,
  onClose
}: {
  item: GalleryItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="theater-dark fixed inset-0 z-[110]"
    >
      <button
        type="button"
        aria-label="Cerrar galería"
        className="absolute inset-0 z-0 cursor-pointer"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.88)" }}
        onClick={onClose}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 backdrop-blur-[2px]"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
      />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/25 bg-black/90 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition hover:border-white/40 hover:bg-black sm:right-6 sm:top-6"
      >
        <span aria-hidden className="text-lg leading-none">
          ×
        </span>
        Cerrar
      </button>

      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 flex h-full w-full items-center justify-center p-5 pt-16 sm:p-8 sm:pt-20"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          className="max-h-[85vh] w-auto max-w-full object-contain drop-shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
          priority
        />
      </motion.div>
    </motion.div>
  );
}

export function GallerySection() {
  const { items, loading } = useGallery();
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const closeLightbox = useCallback(() => setActive(null), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="gallery" className="section-shell pb-16 sm:pb-20">
      <Reveal>
        {loading ? (
          <GallerySkeleton />
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-600">No hay imágenes en la galería por el momento.</p>
        ) : (
          <Masonry
            breakpointCols={breakpointCols}
            className="-ml-4 flex w-auto"
            columnClassName="bg-clip-padding pl-4"
          >
            {items.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="group relative mb-4 block w-full overflow-hidden rounded-3xl border border-white/10"
                onClick={() => setActive(item)}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="h-auto w-full transition duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              </motion.button>
            ))}
          </Masonry>
        )}
      </Reveal>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {active && <GalleryLightbox key={active.id} item={active} onClose={closeLightbox} />}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
