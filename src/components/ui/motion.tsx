"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Anima solo cuando el contenido está listo (p. ej. fetch terminado). */
  ready?: boolean;
};

/** Entrada suave al montar o cuando `ready` pasa a true — sin scroll ni blur. */
export function Reveal({ children, delay = 0, className, ready = true }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.35, delay: ready ? delay : 0, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type GlowOrbProps = {
  className: string;
  duration?: number;
};

export function GlowOrb({ className, duration = 10 }: GlowOrbProps) {
  return (
    <motion.div
      aria-hidden
      className={className}
      animate={{ opacity: [0.35, 0.7, 0.35], y: [0, -20, 0], x: [0, 16, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
