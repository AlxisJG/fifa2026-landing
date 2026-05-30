type FootballDataEmptyProps = {
  message?: string;
  variant?: "dark" | "light";
};

export function FootballDataEmpty({
  message = "Disponible próximamente.",
  variant = "dark"
}: FootballDataEmptyProps) {
  const styles =
    variant === "dark"
      ? "border-white/10 bg-white/5 text-white/50"
      : "border-slate-200 bg-slate-50 text-slate-500";

  return (
    <p
      className={`rounded-2xl border px-6 py-10 text-center text-sm ${styles}`}
      role="status"
    >
      {message}
    </p>
  );
}
