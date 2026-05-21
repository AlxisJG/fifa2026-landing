export function FooterSection() {
  return (
    <footer className="theater-dark border-t border-white/15 bg-[#08142c]/90 backdrop-blur-2xl">
      <div className="section-shell grid h-[4.5rem] grid-cols-[1fr_1fr] items-center gap-3 sm:h-[4.75rem] sm:gap-4">
        <p className="text-[10px] leading-snug text-white/70 sm:text-[11px]">
          Todos los derechos reservados Pio Deportes
        </p>
        <p className="text-right text-[10px] leading-snug text-white/70 sm:text-[11px]">
          Desarrollado por AxWorkflow
        </p>
      </div>
    </footer>
  );
}
