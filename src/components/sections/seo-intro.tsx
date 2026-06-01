import { HOME_SEO } from "@/lib/seo/site";

export function SeoIntroSection() {
  return (
    <section aria-labelledby="seo-intro-heading" className="sr-only">
      <h1 id="seo-intro-heading">{HOME_SEO.h1}</h1>
      {HOME_SEO.introParagraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 32)}>{paragraph}</p>
      ))}
    </section>
  );
}
