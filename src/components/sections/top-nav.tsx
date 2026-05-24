"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { BrandLogoMark } from "@/components/ui/brand-logo-mark";
import { LiveNavButton } from "@/components/ui/live-nav-button";
import { useAuth } from "@/hooks/use-auth";
import { scrollToSection } from "@/lib/scroll-to-section";

type NavItem = {
  label: string;
  sectionId: string;
};

const landingNavLeft: NavItem[] = [
  { label: "Noticias", sectionId: "news" },
  { label: "Partidos", sectionId: "fixtures" },
  { label: "Match Center", sectionId: "match-center" }
];

const landingNavRight: NavItem[] = [
  { label: "Posiciones", sectionId: "standings" },
  { label: "Highlights", sectionId: "summaries" },
  { label: "Galería", sectionId: "gallery" }
];

function NavAnchor({ item, onNavigate }: { item: NavItem; onNavigate: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.sectionId)}
      className="whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-white/70 transition hover:text-white sm:text-[11px] sm:tracking-[0.2em]"
    >
      {item.label}
    </button>
  );
}

export function TopNav() {
  const { user, loading } = useAuth();
  const loggedIn = !loading && !!user;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [menuOpen]);

  const handleNavigate = useCallback((sectionId: string) => {
    setMenuOpen(false);
    window.requestAnimationFrame(() => scrollToSection(sectionId));
  }, []);

  const loggedInLeft = [{ label: "Transmisión", href: "/transmision" }];
  const loggedInRight = [
    { label: "Perfil", href: "/perfil" },
    { label: "Planes", href: "/planes" }
  ];

  const mobileLandingItems = [...landingNavLeft, ...landingNavRight];

  return (
    <>
      <header
        className="theater-dark fixed inset-x-0 top-0 z-40 overflow-visible border-b border-white/15 bg-black/90 backdrop-blur-2xl"
        style={{ paddingTop: "max(env(safe-area-inset-top), 0px)" }}
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-[#d71920]" />
        <div className="section-shell h-[4.5rem] overflow-visible sm:h-[4.75rem]">
          <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-2 overflow-visible">
            {loggedIn ? (
              <nav className="hidden items-center justify-start gap-4 md:flex lg:gap-5">
                {loggedInLeft.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-[10px] uppercase tracking-[0.18em] text-white/70 transition hover:text-white sm:text-[11px] sm:tracking-[0.2em]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : (
              <nav className="hidden items-center justify-start gap-3 md:flex lg:gap-4 xl:gap-5">
                <LiveNavButton onClick={() => handleNavigate("live")} />
                {landingNavLeft.map((item) => (
                  <NavAnchor key={item.sectionId} item={item} onNavigate={handleNavigate} />
                ))}
              </nav>
            )}

            <div className="relative h-full w-[10.5rem] shrink-0 justify-self-center sm:w-[12.5rem] md:w-[15rem]">
              <div className="absolute left-1/2 z-50 -translate-x-1/2 -translate-y-1/2" style={{ top: "55px" }}>
                {loggedIn ? (
                  <BrandLogoMark variant="crest" />
                ) : (
                  <BrandLogoMark variant="crest" onClick={() => handleNavigate("hero")} />
                )}
              </div>
            </div>

            {loggedIn ? (
              <nav className="hidden items-center justify-end gap-4 md:flex lg:gap-5">
                {loggedInRight.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-[10px] uppercase tracking-[0.18em] text-white/70 transition hover:text-white sm:text-[11px] sm:tracking-[0.2em]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : (
              <nav className="hidden items-center justify-end gap-3 md:flex lg:gap-4 xl:gap-5">
                {landingNavRight.map((item) => (
                  <NavAnchor key={item.sectionId} item={item} onNavigate={handleNavigate} />
                ))}
                <Link
                  href="/suscribete"
                  className="ml-1 shrink-0 rounded-full bg-electric px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-midnight transition hover:brightness-110 sm:text-[11px]"
                >
                  Suscríbete
                </Link>
              </nav>
            )}

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="glass col-start-3 justify-self-end flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 md:hidden"
              aria-label="Abrir menú"
            >
              <motion.span animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }} className="absolute h-0.5 w-4 bg-white" />
              <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="absolute h-0.5 w-4 bg-white" />
              <motion.span animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }} className="absolute h-0.5 w-4 bg-white" />
            </button>
          </div>
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
            <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="theater-dark absolute inset-x-4 rounded-2xl border border-white/15 bg-black/95 p-5 shadow-glow"
              style={{ top: "max(calc(env(safe-area-inset-top) + 4.5rem), 4.75rem)" }}
            >
              <div className="mb-4 flex justify-center border-b border-white/10 pb-4">
                <BrandLogoMark onClick={() => handleNavigate("hero")} />
              </div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.22em] text-white/65">Menú</p>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/75"
                >
                  Cerrar
                </button>
              </div>
              <div className="max-h-[60vh] space-y-2 overflow-y-auto">
                {!loggedIn && (
                  <LiveNavButton variant="menu" onClick={() => handleNavigate("live")} />
                )}
                {loggedIn
                  ? [...loggedInLeft, ...loggedInRight].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/90 transition hover:border-electric/45 hover:bg-white/[0.06]"
                      >
                        {item.label}
                      </Link>
                    ))
                  : mobileLandingItems.map((item, index) => (
                      <motion.button
                        key={item.sectionId}
                        type="button"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04, duration: 0.3 }}
                        onClick={() => handleNavigate(item.sectionId)}
                        className="block w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm font-medium text-white/90 transition hover:border-electric/45 hover:bg-white/[0.06]"
                      >
                        {item.label}
                      </motion.button>
                    ))}
              </div>
              {!loggedIn && (
                <Link
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 block rounded-full bg-electric py-3 text-center text-sm font-semibold text-midnight"
                >
                  Suscríbete
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
