import { HOME_SEO } from "@/lib/seo/site";

export function SeoIntroSection() {
  return (
    <section aria-labelledby="seo-intro-heading" className="section-shell py-6 sm:py-8">
      <h1 id="seo-intro-heading" className="sr-only">
        {HOME_SEO.h1}
      </h1>
      <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
        {HOME_SEO.introParagraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
