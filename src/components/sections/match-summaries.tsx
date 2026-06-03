"use client";

import { BrightcovePlaylistEmbed } from "@/components/highlights/brightcove-playlist-embed";
import { Reveal } from "@/components/ui/motion";

export function MatchSummariesSection() {
  return (
    <section id="summaries" className="section-shell pb-16 sm:pb-20">
      <Reveal>
        <div className="glass-heavy overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95">
          <p className="border-b border-slate-200/80 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-800 sm:px-6">
            Playlist de highlights
          </p>
          <BrightcovePlaylistEmbed />
        </div>
      </Reveal>
    </section>
  );
}
