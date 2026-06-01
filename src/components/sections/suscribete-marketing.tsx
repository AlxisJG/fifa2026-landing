"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GlowOrb, Reveal } from "@/components/ui/motion";

const benefits = [
  {
    icon: "📺",
    title: "4K HDR sin anuncios",
    desc: "Streaming en ultra alta definición. Cero cortes comerciales. La experiencia definitiva."
  },
  {
    icon: "🔒",
    title: "Exclusivo suscriptores",
    desc: "Acceso solo para miembros FIFApp. Contenido premium protegido con DRM."
  },
  {
    icon: "🏆",
    title: "Todos los partidos",
    desc: "Cobertura completa del Mundial 2026. 64 partidos en vivo y bajo demanda."
  },
  {
    icon: "📱",
    title: "Multi-dispositivo",
    desc: "Smart TV, web, tablet y móvil. Cambia de dispositivo sin perder tu lugar."
  }
];

const heroBg =
  "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=2200&q=80";

export function SuscribeteMarketing() {
  return (
    <section className="theater-dark relative z-0 min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={heroBg}
          alt="FIFA World Cup 2026 stadium atmosphere"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,13,31,0.7)_0%,rgba(6,13,31,0.5)_30%,rgba(6,13,31,0.8)_70%,#060d1f_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(70,210,255,0.18),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(231,190,98,0.10),transparent_35%)]" />

      <GlowOrb className="pointer-events-none absolute -left-20 top-32 h-72 w-72 rounded-full bg-electric/20 blur-[120px]" duration={14} />
      <GlowOrb className="pointer-events-none absolute right-[-4rem] top-52 h-60 w-60 rounded-full bg-gold/15 blur-[110px]" duration={16} />

      <div className="section-shell relative z-0 flex min-h-screen flex-col justify-center pb-16 pt-[calc(env(safe-area-inset-top)+9rem)] sm:pt-[calc(env(safe-area-inset-top)+10rem)]">
        <Reveal>
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/80 text-electric">
            Pay Per View — Suscripción exclusiva
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="max-w-4xl text-white/80 text-[clamp(2.4rem,10vw,5.5rem)] font-semibold leading-[0.94] tracking-[-0.03em]">
            Vive el Mundial{" "}
            <span className="text-gold">sin anuncios</span>
            <br />
            <span className="text-2xl font-normal tracking-[0] sm:text-4xl">
              Streaming PPV exclusivo para suscriptores FIFApp
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Accede a la transmisión en vivo más premium del FIFA World Cup 2026.
            Producción cinematográfica, DRM protegido, cero interrupciones.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                className="group glass rounded-2xl border border-white/15 p-5 transition hover:border-electric/30"
              >
                <span className="text-3xl">{b.icon}</span>
                <h3 className="mt-3 text-sm font-semibold">{b.title}</h3>
                <p className="mt-2 text-xs leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <motion.a
            href="#registro"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-full bg-electric px-8 py-3.5 text-sm font-semibold text-midnight shadow-[0_0_30px_rgba(70,210,255,0.3)] transition hover:brightness-110"
          >
            Quiero suscribirme
            <span className="text-base">→</span>
          </motion.a>
        </Reveal>
      </div>
    </section>
  );
}
