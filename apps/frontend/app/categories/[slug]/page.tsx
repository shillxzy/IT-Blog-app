import type { Metadata } from "next";
import type { ArticleCard } from "@/types";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategoryArticles } from "@/lib/api";
import { ArticleCardComponent } from "@/components/blog/ArticleCardComponent";
import { Pagination } from "@/components/ui/Pagination";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    return { title: category.name, description: category.description };
  } catch {
    return { title: "Категорія" };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr ?? "1");

  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  const articlesRes = await getCategoryArticles(slug, page, 10).catch(() => ({
    data: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
  }));

  return (
    <div>
      <div className="category-header">
        <div className="category-header-accent" style={{ backgroundColor: category.color ?? "#57534e" }} />
        <h1 className="category-title">{category.name}</h1>
        {category.description && <p className="category-description">{category.description}</p>}
        <p className="category-count">{category.articlesCount} статей</p>
      </div>

      {articlesRes.data.length === 0 ? (
        <p className="empty-state">Статей у цій категорії ще немає.</p>
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