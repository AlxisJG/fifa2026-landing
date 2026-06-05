"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrandLogoMark } from "@/components/ui/brand-logo-mark";
import { LiveNavButton } from "@/components/ui/live-nav-button";
import { useAuth } from "@/hooks/use-auth";
import { NAV_PAGES, type PageSeoKey } from "@/lib/seo/pages";
import { isSubscriptionFunnelEnabled } from "@/lib/subscription-funnel-gate";

const navLinkClass =
  "whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 transition hover:text-white sm:text-[11px] sm:tracking-[0.2em]";

const mobileNavLinkClass =
  "block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/90 transition hover:border-electric/45 hover:bg-white/[0.06]";

const NAV_LEFT_KEYS: PageSeoKey[] = ["partidos", "posiciones"];
const NAV_RIGHT_KEYS: PageSeoKey[] = ["noticias", "highlights", "galeria"];
const MOBILE_NAV_KEYS: PageSeoKey[] = ["partidos", "posiciones", "noticias", "highlights", "galeria"];

function navPagesByKeys(keys: PageSeoKey[]) {
  return keys.map((key) => NAV_PAGES.find((page) => page.key === key)).filter((page) => page != null);
}

export function TopNav() {
  const { user, loading } = useAuth();
  const loggedIn = !loading && !!user;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [menuOpen]);

  const funnelEnabled = isSubscriptionFunnelEnabled();
  const navLeft = navPagesByKeys(NAV_LEFT_KEYS);
  const navRight = navPagesByKeys(NAV_RIGHT_KEYS);
  const mobileNavPages = navPagesByKeys(MOBILE_NAV_KEYS);

  return (
    <>
      <header
        className="theater-dark fixed inset-x-0 top-0 z-40 overflow-visible border-b border-white/15 bg-black/90 backdrop-blur-2xl"
        style={{ paddingTop: "max(env(safe-area-inset-top), 0px)" }}
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-[#d71920]" />
        <div className="section-shell h-[4.5rem] sm:h-[4.75rem]">
          <div className="flex h-full items-center justify-between gap-3 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-2">
            <div className="flex min-w-0 shrink-0 items-center md:hidden">
              <Link href="/">
                <BrandLogoMark variant="nav" showRedBackground={false} />
              </Link>
            </div>

            <nav className="hidden items-center justify-start gap-3 md:flex lg:gap-4 xl:gap-5">
              <Link href="/" className={navLinkClass}>
                Portada
              </Link>
              <LiveNavButton />
              {navLeft.map((item) => (
                <Link key={item.path} href={item.path} className={navLinkClass}>
                  {item.navLabel}
                </Link>
              ))}
            </nav>

            <div className="relative hidden h-full w-[10.5rem] shrink-0 justify-self-center sm:w-[12.5rem] md:block md:w-[15rem]">
              <div className="absolute left-1/2 z-50 -translate-x-1/2 -translate-y-1/2" style={{ top: "55px" }}>
                <Link href="/">
                  <BrandLogoMark variant="crest" />
                </Link>
              </div>
            </div>

            <nav className="hidden items-center justify-end gap-3 md:flex lg:gap-4 xl:gap-5">
              {navRight.map((item) => (
                <Link key={item.path} href={item.path} className={navLinkClass}>
                  {item.navLabel}
                </Link>
              ))}
              {loggedIn ? (
                <>
                  <Link href="/perfil" className={navLinkClass}>
                    Perfil
                  </Link>
                  <Link href="/planes" className={navLinkClass}>
                    Planes
                  </Link>
                </>
              ) : funnelEnabled ? (
                <Link
                  href="/suscribete"
                  className="ml-1 shrink-0 rounded-full bg-electric px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-midnight transition hover:brightness-110 sm:text-[11px]"
                >
                  Suscríbete
                </Link>
              ) : null}
            </nav>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="glass relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 md:hidden"
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
              <div className="mb-4 flex justify-start border-b border-white/10 pb-4">
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <BrandLogoMark variant="nav" showRedBackground={false} />
                </Link>
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
                <LiveNavButton variant="menu" onClick={() => setMenuOpen(false)} />
                <Link href="/" onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
                  Portada
                </Link>
                {mobileNavPages.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 1) * 0.04, duration: 0.3 }}
                  >
                    <Link href={item.path} onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
                      {item.navLabel}
                    </Link>
                  </motion.div>
                ))}
                {loggedIn ? (
                  <>
                    <Link href="/perfil" onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
                      Perfil
                    </Link>
                    <Link href="/planes" onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
                      Planes
                    </Link>
                  </>
                ) : funnelEnabled ? (
                  <Link
                    href="/suscribete"
                    onClick={() => setMenuOpen(false)}
                    className="mt-2 block rounded-full bg-electric py-3 text-center text-sm font-semibold text-midnight"
                  >
                    Suscríbete
                  </Link>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
