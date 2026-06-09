const PIO_DEPORTES_NEWS_URL = "https://www.piodeportes.com";

type ArticleBodyProps = {
  html: string;
};

export function ArticleBody({ html }: ArticleBodyProps) {
  return (
    <div
      className="article-body max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

type ArticleSourceFooterProps = {
  originalUrl?: string;
};

export function ArticleSourceFooter({ originalUrl }: ArticleSourceFooterProps) {
  return (
    <footer className="mt-12 border-t border-slate-200 pt-8">
      <p className="text-sm leading-relaxed text-slate-600">
        Visítanos en nuestra web de noticias{" "}
        <a
          href={PIO_DEPORTES_NEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-slate-900 underline-offset-2 hover:underline"
        >
          piodeportes.com
        </a>
        .
      </p>
      {originalUrl && (
        <p className="mt-3 text-sm text-slate-500">
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-700 underline-offset-2 hover:underline"
          >
            Ver esta noticia en piodeportes.com
          </a>
        </p>
      )}
    </footer>
  );
}
