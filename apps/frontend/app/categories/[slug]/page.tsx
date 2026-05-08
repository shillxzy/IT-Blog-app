// app/categories/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getArticles } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    return {
      title: `${category.name} — IT Blog`,
      description: category.description,
    };
  } catch {
    return { title: "Категорія — IT Blog" };
  }
}

export const revalidate = 3600;

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;

  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  const articlesRes = await getArticles({
    categorySlug: slug,
    page: Number(page),
    limit: 9,
    status: "published",
  });

  const { data: articles, meta } = articlesRes;

  return (
    <div className="category-page">
      {/* Header */}
      <div className="category-header">
        {category.cover && (
          <div className="category-cover-wrap">
            <Image src={category.cover} alt={category.name} fill className="category-cover" />
            <div className="category-cover-overlay" />
          </div>
        )}
        <div className="category-header-content">
          <span
            className="category-badge"
            style={{ backgroundColor: category.color ?? "#6366f1" }}
          >
            Категорія
          </span>
          <h1 className="category-title">{category.name}</h1>
          {category.description && (
            <p className="category-description">{category.description}</p>
          )}
          <p className="category-count">{meta.total} статей</p>
        </div>
      </div>

      {/* Articles */}
      {articles.length === 0 ? (
        <p className="empty-state">У цій категорії ще немає статей.</p>
      ) : (
        <div className="articles-grid">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/categories/${slug}/${article.slug}`}
              className="article-card"
            >
              {article.cover && (
                <div className="article-card-image-wrap">
                  <Image src={article.cover} alt={article.title} fill className="article-card-image" />
                </div>
              )}
              <div className="article-card-body">
                <h2 className="article-card-title">{article.title}</h2>
                <p className="article-card-excerpt">{article.excerpt}</p>
                <div className="article-card-meta">
                  {article.author.avatar && (
                    <Image src={article.author.avatar} alt={article.author.name} width={22} height={22} className="avatar-xs" />
                  )}
                  <span className="meta-author">{article.author.name}</span>
                  <span className="meta-dot">·</span>
                  <span className="meta-time">
                    {article.publishedAt ? formatDate(article.publishedAt) : ""}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="pagination">
          {meta.hasPrev && (
            <Link href={`/categories/${slug}?page=${meta.page - 1}`} className="page-btn">
              ← Назад
            </Link>
          )}
          <span className="page-info">
            {meta.page} / {meta.totalPages}
          </span>
          {meta.hasNext && (
            <Link href={`/categories/${slug}?page=${meta.page + 1}`} className="page-btn">
              Вперед →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
