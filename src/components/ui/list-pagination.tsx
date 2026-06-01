import Link from "next/link";

type ListPaginationProps = {
  currentPage: number;
  totalPages: number;
  /** Query string prefix, e.g. "?fecha=2026-06-15&" or "?" */
  queryPrefix?: string;
};

function pageHref(page: number, queryPrefix: string) {
  if (queryPrefix === "?") {
    return page <= 1 ? "?" : `?page=${page}`;
  }
  const base = queryPrefix.endsWith("&") || queryPrefix.endsWith("?") ? queryPrefix : `${queryPrefix}&`;
  return page <= 1 ? base.replace(/&$/, "").replace(/\?$/, "") || "?" : `${base}page=${page}`;
}

function PaginationLink({
  href,
  label,
  active = false,
  disabled = false
}: {
  href?: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
}) {
  const className = [
    "inline-flex min-w-10 items-center justify-center rounded-full px-3 py-2 text-sm font-semibold transition",
    active ? "bg-electric text-midnight" : "border border-slate-300 text-slate-700 hover:bg-slate-50",
    disabled ? "pointer-events-none opacity-40" : ""
  ].join(" ");

  if (!href || disabled) {
    return (
      <span className={className} aria-disabled="true">
        {label}
      </span>
    );
  }

  return (
    <Link href={href} className={className} aria-current={active ? "page" : undefined}>
      {label}
    </Link>
  );
}

export function ListPagination({ currentPage, totalPages, queryPrefix = "?" }: ListPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación">
      <PaginationLink
        href={currentPage > 1 ? pageHref(currentPage - 1, queryPrefix) : undefined}
        label="Anterior"
        disabled={currentPage <= 1}
      />
      {pages.map((page) => (
        <PaginationLink
          key={page}
          href={pageHref(page, queryPrefix)}
          label={String(page)}
          active={page === currentPage}
        />
      ))}
      <PaginationLink
        href={currentPage < totalPages ? pageHref(currentPage + 1, queryPrefix) : undefined}
        label="Siguiente"
        disabled={currentPage >= totalPages}
      />
    </nav>
  );
}
