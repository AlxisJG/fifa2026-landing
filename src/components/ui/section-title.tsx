import { Reveal } from "@/components/ui/motion";

type Props = {
  kicker: string;
  title: string;
  subtitle?: string;
  as?: "h2" | "h3";
};

export function SectionTitle({ kicker, title, subtitle, as: Heading = "h2" }: Props) {
  return (
    <Reveal className="mb-10 space-y-3 sm:mb-12" delay={0.06}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-electric/90">{kicker}</p>
      <Heading className="max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">{title}</Heading>
      {subtitle && <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{subtitle}</p>}
    </Reveal>
  );
}
