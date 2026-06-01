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

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Props de Framer para fade-in al montar (sin whileInView / scroll). */
export function fadeInMotionProps(delay = 0, offsetY = 10, offsetX = 0) {
  return {
    initial: { opacity: 0, y: offsetY, x: offsetX },
    animate: { opacity: 1, y: 0, x: 0 },
    transition: { duration: 0.35, delay, ease: EASE_OUT }
  };
}

/** Entrada suave al montar o cuando `ready` pasa a true — sin scroll ni blur. */
export function Reveal({ children, delay = 0, className, ready = true }: RevealProps) {
  const motionProps = fadeInMotionProps(ready ? delay : 0);

  return (
    <motion.div {...motionProps} animate={ready ? motionProps.animate : motionProps.initial} className={className}>
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
