"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/motion";
import { news } from "@/data/landing-content";

export function NewsSection() {
  return (
    <section className="section-shell py-14 sm:py-20">
      <SectionTitle kicker="Editorial" title="News & Highlights" subtitle="Contenido premium para extender session depth y aumentar retorno organico." />
      <div className="grid gap-4 lg:grid-cols-3">
        {news.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <motion.article whileHover={{ y: -6 }} className={`group glass-heavy overflow-hidden rounded-3xl ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}>
              <div className="relative h-56 sm:h-64 lg:h-72">
                <Image src={item.image} alt={item.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.35)_35%,rgba(0,0,0,0.05)_70%,transparent_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-[11px] uppercase tracking-[0.23em] text-[rgba(255,255,255,0.9)] [text-shadow:0_2px_10px_rgba(0,0,0,0.45)]">{item.category}</p>
                  <h3 className="mt-3 text-xl font-bold leading-tight tracking-[-0.02em] text-[#ffffff] [text-shadow:0_2px_10px_rgba(0,0,0,0.45)]">{item.title}</h3>
                </div>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
