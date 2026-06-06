import Link from "next/link";
import type { ReactNode } from "react";

type HeroActionButtonProps = {
  onClick?: () => void;
  href?: string;
  icon: ReactNode;
  iconTone?: "sky" | "red";
  children: ReactNode;
  className?: string;
};

const iconToneClass = {
  sky: "bg-electric/15 text-[#005fcc] group-hover:bg-electric/25",
  red: "bg-[#d71920]/12 text-[#d71920] group-hover:bg-[#d71920]/20"
};

const buttonClass =
  "group inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-slate-200/90 bg-gradient-to-b from-white to-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition hover:border-electric/45 hover:from-white hover:to-white hover:shadow-[0_10px_28px_rgba(70,210,255,0.18)] sm:min-h-12 sm:gap-2.5 sm:px-4 sm:text-sm md:w-auto md:shrink-0";

export function HeroActionButton({
  onClick,
  href,
  icon,
  iconTone = "sky",
  children,
  className = ""
}: HeroActionButtonProps) {
  const content = (
    <>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition sm:h-9 sm:w-9 ${iconToneClass[iconTone]}`}
        aria-hidden
      >
        {icon}
      </span>
      <span className="truncate leading-tight">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${buttonClass} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${buttonClass} ${className}`}>
      {content}
    </button>
  );
}

export function IconFixturesCalendar({ className = "h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth="2.25" />
      <path d="M3 9.5h18" stroke="currentColor" strokeWidth="2.25" />
      <path d="M8 2.5v3M16 2.5v3" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      <circle cx="8" cy="14.5" r="1.35" fill="currentColor" />
      <circle cx="12" cy="14.5" r="1.35" fill="currentColor" />
      <circle cx="16" cy="14.5" r="1.35" fill="currentColor" />
      <circle cx="12" cy="17.5" r="1.35" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function IconHighlightsVideo({ className = "h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="2.25" />
      <path
        d="M10.5 9.25v5.5l5.25-2.75-5.25-2.75z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
