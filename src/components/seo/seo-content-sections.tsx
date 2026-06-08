import type { SeoContentSection } from "@/data/seo-landing-content";

type SeoContentSectionsProps = {
  sections: SeoContentSection[];
};

export function SeoContentSections({ sections }: SeoContentSectionsProps) {
  return (
    <div className="max-w-3xl space-y-10">
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{section.heading}</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

type SeoFaqSectionProps = {
  faqs: { question: string; answer: string }[];
};

export function SeoFaqSection({ faqs }: SeoFaqSectionProps) {
  return (
    <section className="mt-12 max-w-3xl">
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Preguntas frecuentes</h2>
      <dl className="mt-6 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="font-semibold text-slate-900">{faq.question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
