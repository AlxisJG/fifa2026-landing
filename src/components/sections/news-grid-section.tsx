"use client";

import { Reveal } from "@/components/ui/motion";
import { usePosts } from "@/hooks/usePosts";
import { NewsCard, fallbackPosts, sortPostsByDate } from "@/components/sections/news-shared";

export function NewsGridSection() {
  const { posts: apiPosts, loading } = usePosts();
  const posts = sortPostsByDate(apiPosts.length > 0 ? apiPosts : fallbackPosts);

  if (loading) {
    return (
      <section className="section-shell pb-16 sm:pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-[4/3] animate-pulse rounded-3xl bg-slate-200" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell pb-16 sm:pb-20">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.04}>
            <NewsCard
              image={item.image}
              title={item.title}
              category={item.category}
              date={item.date}
              uniform
              priority={index < 3}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
