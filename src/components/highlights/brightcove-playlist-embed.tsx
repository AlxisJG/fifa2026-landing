/** Proporción del embed Brightcove (padding-top 75% ≈ 4:3). */
const BRIGHTCOVE_ASPECT_PADDING = "75%";

const DEFAULT_EMBED_SRC =
  "https://players.brightcove.net/6416149296001/default_default/index.html?playlistId=1867009149758593664";

function getBrightcoveEmbedSrc(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BRIGHTCOVE_HIGHLIGHTS_EMBED_URL?.trim();
  return fromEnv || DEFAULT_EMBED_SRC;
}

type BrightcovePlaylistEmbedProps = {
  title?: string;
  className?: string;
};

/** Playlist Brightcove — ancho completo hasta 1280px, relación 4:3. */
export function BrightcovePlaylistEmbed({
  title = "Highlights Mundial FIFA 2026",
  className = ""
}: BrightcovePlaylistEmbedProps) {
  const src = getBrightcoveEmbedSrc();

  return (
    <div className={`relative mx-auto block w-full max-w-[1280px] ${className}`}>
      <div className="relative w-full" style={{ paddingTop: BRIGHTCOVE_ASPECT_PADDING }}>
        <iframe
          src={src}
          title={title}
          allowFullScreen
          allow="encrypted-media"
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
