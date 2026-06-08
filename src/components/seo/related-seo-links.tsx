import Link from "next/link";
import { PAGE_SEO } from "@/lib/seo/pages";

const SEO_LANDING_LINKS = [
  { href: PAGE_SEO.mundial2026Rd.path, label: PAGE_SEO.mundial2026Rd.h1 },
  { href: PAGE_SEO.dondeVerMundial.path, label: PAGE_SEO.dondeVerMundial.h1 },
  { href: PAGE_SEO.partidosEnVivoMundial.path, label: PAGE_SEO.partidosEnVivoMundial.h1 }
] as const;

type RelatedSeoLinksProps = {
  currentPath: string;
};

export function RelatedSeoLinks({ currentPath }: RelatedSeoLinksProps) {
  const links = SEO_LANDING_LINKS.filter((link) => link.href !== currentPath);

  return (
    <aside className="mt-10 rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
      <h2 className="text-lg font-bold text-slate-900">También te puede interesar</h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm font-medium text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href={PAGE_SEO.partidos.path} className="text-sm font-medium text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline">
            Calendario de partidos del Mundial 2026
          </Link>
        </li>
        <li>
          <Link href={PAGE_SEO.noticias.path} className="text-sm font-medium text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline">
            Noticias FIFA y Mundial 2026
          </Link>
        </li>
      </ul>
    </aside>
  );
}
