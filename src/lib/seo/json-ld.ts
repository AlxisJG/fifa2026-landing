import { matchSummaries, type Match, type MatchSummary } from "@/data/landing-content";
import { BRANDING } from "@/lib/branding";
import type { Fixture } from "@/lib/football-api/types";
import { getPostPath } from "@/lib/posts-slug";
import type { PostItem } from "@/lib/posts-types";
import { HOME_SEO, SITE_NAME, SITE_URL } from "@/lib/seo/site";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

function parseDurationToIso8601(duration: string): string | undefined {
  const parts = duration.split(":").map((part) => Number.parseInt(part, 10));
  if (parts.some((part) => Number.isNaN(part))) {
    return undefined;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return `PT${minutes}M${seconds}S`;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return `PT${hours}H${minutes}M${seconds}S`;
  }

  return undefined;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Pio Deportes",
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(BRANDING.navLogoCombined)
    },
    description: HOME_SEO.description
  };
}

export function buildWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Pio Deportes",
    description: HOME_SEO.description,
    inLanguage: "es-DO",
    publisher: {
      "@id": ORGANIZATION_ID
    }
  };
}

export function buildSiteGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [buildOrganizationSchema(), buildWebSiteSchema()]
  };
}

function buildPublisherReference() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Pio Deportes",
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(BRANDING.navLogoCombined)
    }
  };
}

export function buildArticleSchema(post: PostItem, index: number) {
  const articleUrl = absoluteUrl(getPostPath(post));
  const schema: Record<string, unknown> = {
    "@type": "NewsArticle",
    "@id": `${articleUrl}#article`,
    headline: post.title,
    author: buildPublisherReference(),
    publisher: buildPublisherReference(),
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    inLanguage: "es-DO",
    isPartOf: {
      "@id": WEBSITE_ID
    },
    about: {
      "@type": "SportsEvent",
      name: "FIFA World Cup 2026"
    }
  };

  if (post.image) {
    schema.image = [post.image.startsWith("http") ? post.image : absoluteUrl(post.image)];
  }

  if (post.date) {
    schema.datePublished = post.date;
    schema.dateModified = post.date;
  }

  const excerpt = stripHtml(post.excerpt ?? "");
  if (excerpt) {
    schema.description = excerpt;
  }

  const articleBody = stripHtml(post.content ?? "");
  if (articleBody) {
    schema.articleBody = articleBody;
  }

  return schema;
}

export function buildSportsEventSchema(match: Match) {
  return {
    "@type": "SportsEvent",
    "@id": `${SITE_URL}/#event-${match.id}`,
    name: `${match.home} vs ${match.away}`,
    startDate: match.kickoff,
    eventStatus: match.live ? "https://schema.org/EventScheduled" : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: match.venue,
      address: {
        "@type": "PostalAddress",
        addressCountry: "US"
      }
    },
    homeTeam: {
      "@type": "SportsTeam",
      name: match.home
    },
    awayTeam: {
      "@type": "SportsTeam",
      name: match.away
    },
    organizer: {
      "@id": ORGANIZATION_ID
    },
    isPartOf: {
      "@type": "SportsEvent",
      name: "FIFA World Cup 2026"
    }
  };
}

export function buildVideoSchema(summary: MatchSummary) {
  const schema: Record<string, unknown> = {
    "@type": "VideoObject",
    "@id": `${SITE_URL}/#video-${summary.id}`,
    name: summary.title,
    description: `Resumen en video: ${summary.title}`,
    thumbnailUrl: [summary.image],
    contentUrl: `${SITE_URL}/#summaries`,
    embedUrl: `${SITE_URL}/#summaries`,
    inLanguage: "es-DO",
    publisher: buildPublisherReference(),
    isPartOf: {
      "@id": WEBSITE_ID
    }
  };

  const duration = parseDurationToIso8601(summary.duration);
  if (duration) {
    schema.duration = duration;
  }

  return schema;
}

export function buildFixtureSportsEventSchema(fixture: Fixture) {
  const home = fixture.home;
  const away = fixture.away;
  return {
    "@type": "SportsEvent",
    "@id": `${SITE_URL}/#fixture-${fixture.id}`,
    name: `${home} vs ${away}`,
    startDate: fixture.startsAt,
    eventStatus: fixture.live ? "https://schema.org/EventScheduled" : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: fixture.venue
      ? {
          "@type": "Place",
          name: fixture.venue
        }
      : undefined,
    homeTeam: { "@type": "SportsTeam", name: home },
    awayTeam: { "@type": "SportsTeam", name: away },
    organizer: { "@id": ORGANIZATION_ID },
    isPartOf: { "@type": "SportsEvent", name: "FIFA World Cup 2026" }
  };
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function buildWebPageSchema({
  path,
  title,
  description
}: {
  path: string;
  title: string;
  description: string;
}) {
  const url = absoluteUrl(path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: "es-DO",
    isPartOf: { "@id": WEBSITE_ID }
  };
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function buildLandingPageGraphSchema({
  path,
  title,
  description,
  breadcrumbs,
  faqs
}: {
  path: string;
  title: string;
  description: string;
  breadcrumbs: { name: string; path: string }[];
  faqs?: { question: string; answer: string }[];
}) {
  const graph: Record<string, unknown>[] = [
    buildWebPageSchema({ path, title, description }),
    buildBreadcrumbSchema(breadcrumbs)
  ];
  if (faqs?.length) {
    graph.push(buildFaqSchema(faqs));
  }
  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

export function buildHomepageGraphSchema(posts: PostItem[], fixtures: Fixture[] = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...posts.slice(0, 5).map((post, index) => buildArticleSchema(post, index)),
      ...fixtures.slice(0, 8).map((fixture) => buildFixtureSportsEventSchema(fixture)),
      ...matchSummaries.map((summary) => buildVideoSchema(summary))
    ]
  };
}
