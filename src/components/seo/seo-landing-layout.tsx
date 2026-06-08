import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/seo/breadcrumbs";
import { RelatedSeoLinks } from "@/components/seo/related-seo-links";
import { buildLandingPageGraphSchema } from "@/lib/seo/json-ld";

type SeoLandingLayoutProps = {
  path: string;
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  faqs?: { question: string; answer: string }[];
  children: React.ReactNode;
};

export function SeoLandingLayout({
  path,
  title,
  description,
  breadcrumbs,
  faqs,
  children
}: SeoLandingLayoutProps) {
  const schemaItems = breadcrumbs
    .filter((item): item is BreadcrumbItem & { path: string } => Boolean(item.path))
    .map((item) => ({ name: item.name, path: item.path }));

  return (
    <>
      <JsonLd
        data={buildLandingPageGraphSchema({
          path,
          title,
          description,
          breadcrumbs: schemaItems,
          faqs
        })}
      />
      <Breadcrumbs items={breadcrumbs} />
      {children}
      <div className="section-shell pb-14">
        <RelatedSeoLinks currentPath={path} />
      </div>
    </>
  );
}
