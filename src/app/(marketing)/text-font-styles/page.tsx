import type { Metadata } from "next";
import { MarketingPageMain } from "@/components/layout/page-intro";
import { FWC26_VARIANTS_BY_FAMILY } from "@/lib/fonts/fwc26-catalog";
import "./fonts-showcase.css";

export const metadata: Metadata = {
  title: "FWC26 Font Styles (prueba)",
  robots: { index: false, follow: false }
};

const SAMPLE_LINES = [
  "TRES PAISES. UNA PASIÓN",
  "11 DE JUNIO 2026",
  "Mundial FIFA 2026 · PIO Deportes"
] as const;

function VariantCard({
  id,
  familyLabel,
  weightLabel,
  weightValue,
  fileName,
  fontFamily,
  inDefaultStack
}: {
  id: string;
  familyLabel: string;
  weightLabel: string;
  weightValue: number;
  fileName: string;
  fontFamily: string;
  inDefaultStack: boolean;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <code className="rounded-md bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white">{id}</code>
        {inDefaultStack && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-800">
            Fuente global actual
          </span>
        )}
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {familyLabel} · {weightLabel}
      </p>

      <div className="mt-3 space-y-1" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>
        {SAMPLE_LINES.map((line) => (
          <p key={line} className="text-lg uppercase leading-tight text-slate-900 sm:text-xl">
            {line}
          </p>
        ))}
      </div>

      <dl className="mt-4 grid gap-1 text-[11px] text-slate-600">
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-semibold text-slate-800">Archivo:</dt>
          <dd>
            <code>{fileName}</code>
          </dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-semibold text-slate-800">Peso CSS:</dt>
          <dd>{weightValue}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-semibold text-slate-800">font-family:</dt>
          <dd>
            <code>{fontFamily}</code>
          </dd>
        </div>
      </dl>
    </article>
  );
}

export default function TextFontStylesPage() {
  return (
    <MarketingPageMain>
      <section className="section-shell py-10 sm:py-14">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-electric">Prueba interna</p>
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl">FWC26 · Catálogo de estilos</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Usa el <strong>slug</strong> de cada tarjeta para pedir una variante. Ejemplo:{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800">condensed-black</code> o{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800">expanded-bold</code>.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Cómo referenciarla</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>Slug:</strong> <code>familia-peso</code> (ej. <code>normal-bold</code>,{' '}
              <code>ultra-condensed-medium</code>)
            </li>
            <li>
              <strong>Familias:</strong> normal, condensed, expanded, semi-expanded, ultra-condensed
            </li>
            <li>
              <strong>Pesos:</strong> thin, light, regular, medium, bold, black
            </li>
            <li>
              <strong>Hoy en producción:</strong> solo la familia <code>normal</code> vía{' '}
              <code>font-sans</code> + clases Tailwind (<code>font-bold</code>, <code>font-black</code>, etc.)
            </li>
          </ul>
        </div>
      </section>

      {FWC26_VARIANTS_BY_FAMILY.map((group) => (
        <section key={group.familySlug} className="section-shell pb-12 sm:pb-16">
          <h2 className="mb-6 text-xl font-black uppercase tracking-tight text-slate-900 sm:text-2xl">
            {group.familyLabel}
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {group.variants.map((variant) => (
              <VariantCard key={variant.id} {...variant} />
            ))}
          </div>
        </section>
      ))}
    </MarketingPageMain>
  );
}
