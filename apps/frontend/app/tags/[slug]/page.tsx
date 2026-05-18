import type { Metadata } from "next";
import type { ArticleCard } from "@/types";
import { notFound } from "next/navigation";
import { getTagBySlug, getTagArticles } from "@/lib/api";
import { ArticleCardComponent } from "@/components/blog/ArticleCardComponent";
import { Pagination } from "@/components/ui/Pagination";

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tag = await getTagBySlug(slug);
    return { title: `#${tag.name}`, description: `Статті з тегом ${tag.name}` };
  } catch {
    return { title: "Тег" };
  }
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

  const articlesRes = await getTagArticles(slug, page, 10).catch(() => ({
    data: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
  }));

  return (
    <div>
      <div className="tag-header">
        <h1 className="tag-title">#{tag.name}</h1>
        <p className="tag-count">{tag.articlesCount} статей</p>
      </div>

      {articlesRes.data.length === 0 ? (
        <p className="empty-state">Статей з цим тегом ще немає.</p>
      ) : (
        <div className="articles-grid">
          {articlesRes.data.map((article: ArticleCard) => (
            <ArticleCardComponent key={article.id} article={article} />
          ))}
        </div>
      )}
      <Pagination meta={articlesRes.meta} />
    </div>
  );
}