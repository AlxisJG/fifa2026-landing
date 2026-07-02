import Link from "next/link";
import { NAV_PAGES, SEO_FOOTER_PAGES } from "@/lib/seo/pages";

export function FooterSection() {
  return (
    <footer className="theater-dark border-t border-white/15 bg-black/90 backdrop-blur-2xl">
      <div className="section-shell py-8 sm:py-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">Contenido</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="text-sm text-white/65 transition hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/donde-ver-mundial-2026-rd"
                  className="text-sm text-white/65 transition hover:text-white"
                >
                  Dónde ver el Mundial 2026
                </Link>
              </li>
              {NAV_PAGES.map((page) => (
                <li key={page.path}>
                  <Link href={page.path} className="text-sm text-white/65 transition hover:text-white">
                    {page.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">Mundial 2026</p>
            <ul className="mt-3 space-y-2">
              {SEO_FOOTER_PAGES.map((page) => (
                <li key={page.path}>
                  <Link href={page.path} className="text-sm text-white/65 transition hover:text-white">
                    {page.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6">
          <Link href="/privacidad" className="text-sm text-white/65 transition hover:text-white">
            Política de privacidad
          </Link>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr]">
            <p className="text-[10px] leading-snug text-white/70 sm:text-[11px]">
              Todos los derechos reservados Pio Deportes
            </p>
            <p className="text-right text-[10px] leading-snug text-white/70 sm:text-[11px]">
              Desarrollado por AxWorkflow
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
