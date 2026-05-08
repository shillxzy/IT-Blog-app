// ============================================================
// app/tags/[slug]/page.tsx — Tag feed page (ISR)
// ============================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTagBySlug, getArticles, getAllTagSlugs } from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";
import { ArticleCardComponent } from "@/components/blog/ArticleCardComponent";
import { Pagination } from "@/components/ui/Pagination";
import { Hash } from "lucide-react";

export const revalidate = 3600;

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllTagSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  let tag;
  try {
    tag = await getTagBySlug(slug);
  } catch {
    return { title: "Тег не знайдений" };
  }

  return {
    title: `#${tag.name} — YourBlog`,
    description: `Статті з тегом «${tag.name}» на YourBlog`,
    alternates: { canonical: absoluteUrl(`/tags/${slug}`) },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr ?? "1");

  let tag;
  try {
    tag = await getTagBySlug(slug);
  } catch {
    notFound();
  }

  const { data: articles, meta } = await getArticles({
    tagSlug: slug,
    page,
    limit: 12,
    status: "published",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Tag header */}
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 bg-stone-100 text-stone-600 px-4 py-2 rounded-full mb-4">
          <Hash size={16} className="text-stone-400" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Тег
          </span>
        </div>

        <h1 className="font-display text-4xl font-bold text-stone-900 mb-2">
          #{tag.name}
        </h1>

        <p className="text-sm text-stone-400">
          {tag.articlesCount} статей з цим тегом
        </p>
      </header>

      {/* Articles */}
      {articles.length === 0 ? (
        <div className="text-center py-24 text-stone-400">
          <p>Статей з цим тегом не знайдено</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCardComponent key={article.id} article={article} />
            ))}
          </div>
          <Suspense>
            <Pagination meta={meta} />
          </Suspense>
        </>
      )}
    </div>
  );
}
