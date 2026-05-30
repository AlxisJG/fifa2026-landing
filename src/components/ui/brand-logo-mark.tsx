import Link from "next/link";
import { BRANDING } from "@/lib/branding";

const NAV_ACCENT_RED = "#d71920";

type BrandLogoMarkProps = {
  onClick?: () => void;
  className?: string;
  variant?: "default" | "crest" | "large" | "nav";
  /** Cuando es false, muestra solo la imagen (mismo tamaño según variant). */
  showRedBackground?: boolean;
};

const imageHeights: Record<NonNullable<BrandLogoMarkProps["variant"]>, string> = {
  default: "h-[2.7rem] sm:h-[3rem] md:h-[3.3rem] lg:h-[3.6rem]",
  nav: "h-10 sm:h-11",
  crest: "h-[5rem] sm:h-[5.75rem] md:h-[6.5rem] lg:h-[6.5rem]",
  large: "h-[4.2rem] sm:h-[4.8rem] md:h-[6rem] lg:h-[7.2rem]"
};

const imageMaxWidths: Partial<Record<NonNullable<BrandLogoMarkProps["variant"]>, string>> = {
  nav: "max-w-[10.5rem] sm:max-w-[11.5rem]",
  crest: "max-w-[9.5rem] sm:max-w-[11rem] md:max-w-[12rem] lg:max-w-[12rem]"
};

export function BrandLogoMark({
  onClick,
  className = "",
  variant = "default",
  showRedBackground = true
}: BrandLogoMarkProps) {
  const logoImg = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={BRANDING.navLogoCombined}
      alt="Pio Deportes y FIFA World Cup 2026"
      draggable={false}
      width={1434}
      height={607}
      className={`m-0 block w-auto max-w-full shrink-0 ${imageHeights[variant]} ${imageMaxWidths[variant] ?? ""}`}
      style={{
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.35))",
        objectFit: "contain",
        objectPosition: "center center",
        ...(showRedBackground ? { padding: "10px" } : {})
      }}
    />
  );

  const redBox = (
    <span
      className="inline-flex min-w-0 items-center justify-center rounded-xl border border-[#9e1218]/90 p-2 sm:p-2.5"
      style={{ backgroundColor: NAV_ACCENT_RED }}
    >
      {logoImg}
    </span>
  );

  const mark = showRedBackground ? redBox : logoImg;
  const baseClass = `inline-flex shrink-0 items-center justify-center leading-none ${className}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${baseClass} border-0 bg-transparent p-0`}>
        {mark}
      </button>
    );
  }

  return (
    <Link href="/" className={baseClass}>
      {mark}
    </Link>
  );
}
