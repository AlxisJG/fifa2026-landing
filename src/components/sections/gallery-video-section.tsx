import { BrightcovePlaylistEmbed } from "@/components/highlights/brightcove-playlist-embed";
import { Reveal } from "@/components/ui/motion";

export function GalleryVideoSection() {
  return (
    <section id="gallery-video" className="section-shell pb-8 sm:pb-10">
      <Reveal>
        <div className="glass-heavy overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95">
          <p className="border-b border-slate-200/80 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-800 sm:px-6">
            Materiales Publicitarios FIFA 2026
          </p>
          <BrightcovePlaylistEmbed title="Materiales publicitarios FIFA 2026" />
        </div>
      </Reveal>
    </section>
  );
}
